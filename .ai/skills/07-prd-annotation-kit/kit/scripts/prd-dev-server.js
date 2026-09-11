/**
 * 静态预览 + 需求注册表反写。
 * 用法：在项目根目录执行  node scripts/prd-dev-server.js [--port 8085]
 */
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

const root = process.cwd();
const port = Number((process.argv.includes("--port") && process.argv[process.argv.indexOf("--port") + 1]) || process.env.PRD_DEV_PORT || 8085);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ "Cache-Control": "no-store" }, headers || {}));
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });
}

function safeJoin(base, rel) {
  const resolved = path.resolve(base, rel);
  const normBase = path.resolve(base) + path.sep;
  if (resolved !== path.resolve(base) && !resolved.startsWith(normBase)) return null;
  return resolved;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function skipString(source, i) {
  const quote = source[i];
  i += 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  return source.length;
}

function skipBracket(source, i) {
  const open = source[i];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'") {
      i = skipString(source, i);
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
    i += 1;
  }
  return source.length;
}

function skipJsValue(source, i) {
  while (i < source.length && /\s/.test(source[i])) i += 1;
  if (source[i] === '"' || source[i] === "'") return skipString(source, i);
  if (source[i] === "[" || source[i] === "{") return skipBracket(source, i);
  while (i < source.length && !/[,}\]]/.test(source[i])) i += 1;
  return i;
}

function jsString(value) {
  return (
    '"' +
    String(value == null ? "" : value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\r/g, "\\r")
      .replace(/\n/g, "\\n") +
    '"'
  );
}

function formatLogicSections(sections, indent) {
  const i1 = indent + "  ";
  const i2 = indent + "    ";
  const i3 = indent + "      ";
  const blocks = (sections || []).map(function (section) {
    const items = (section.items || [])
      .map(function (item) {
        return i3 + jsString(item) + ",";
      })
      .join("\n");
    return (
      i1 +
      "{\n" +
      i2 +
      "title: " +
      jsString(section.title || "") +
      ",\n" +
      i2 +
      "items: [\n" +
      items +
      "\n" +
      i2 +
      "],\n" +
      i1 +
      "},"
    );
  });
  return "[\n" + blocks.join("\n") + "\n" + indent + "]";
}

function findRegistryFile(registryId) {
  const dir = path.join(root, "js", "requirements");
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(function (f) {
    return f.endsWith(".registry.js");
  });
  const re = new RegExp("registryId:\\s*\"" + escapeRegExp(registryId) + "\"");
  for (let i = 0; i < files.length; i += 1) {
    const full = path.join(dir, files[i]);
    const text = fs.readFileSync(full, "utf8");
    if (re.test(text)) return full;
  }
  return null;
}

function replaceRequirementField(source, requirementId, fieldName, formatted) {
  const idRe = new RegExp("id:\\s*\"" + escapeRegExp(requirementId) + "\"");
  const idMatch = idRe.exec(source);
  if (!idMatch) throw new Error("找不到需求 " + requirementId);

  let objStart = -1;
  for (let i = idMatch.index; i >= 0; i -= 1) {
    if (source[i] === "{") {
      objStart = i;
      break;
    }
  }
  if (objStart < 0) throw new Error("无法定位需求对象起始位置");
  const objEnd = skipBracket(source, objStart);
  const obj = source.slice(objStart, objEnd);
  const fieldRe = new RegExp("(\\n)([ \\t]*)" + escapeRegExp(fieldName) + "\\s*:\\s*");
  const fieldMatch = fieldRe.exec(obj);
  if (!fieldMatch) throw new Error("需求中没有字段 " + fieldName);
  const absStart = objStart + fieldMatch.index + fieldMatch[0].length;
  const valueStart = absStart;
  const valueEnd = skipJsValue(source, valueStart);
  const indent = fieldMatch[2];
  const value = fieldName === "logicSections" ? formatLogicSections(formatted, indent) : jsString(formatted);
  return source.slice(0, valueStart) + value + source.slice(valueEnd);
}

function applyPatch(filePath, requirementId, patch) {
  let source = fs.readFileSync(filePath, "utf8");
  if (patch.logicSections) {
    source = replaceRequirementField(source, requirementId, "logicSections", patch.logicSections);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "title")) {
    source = replaceRequirementField(source, requirementId, "title", patch.title);
  }
  fs.writeFileSync(filePath, source, "utf8");
}

function collectBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on("data", function (c) {
      chunks.push(c);
      if (chunks.reduce(function (n, x) { return n + x.length; }, 0) > 1024 * 1024) {
        reject(new Error("body too large"));
      }
    });
    req.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

function serveStatic(reqPath, res) {
  let rel = decodeURIComponent(reqPath.split("?")[0]);
  if (rel === "/") rel = "/index.html";
  const file = safeJoin(root, "." + rel);
  if (!file) return send(res, 403, "Forbidden");
  fs.stat(file, function (err, st) {
    if (err) return send(res, 404, "Not found");
    const target = st.isDirectory() ? path.join(file, "index.html") : file;
    fs.readFile(target, function (readErr, buf) {
      if (readErr) return send(res, 404, "Not found");
      const ext = path.extname(target).toLowerCase();
      send(res, 200, buf, { "Content-Type": MIME[ext] || "application/octet-stream" });
    });
  });
}

const server = http.createServer(async function (req, res) {
  const parsed = url.parse(req.url, true);
  if (req.method === "GET" && parsed.pathname === "/__prd/health") {
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "POST" && parsed.pathname === "/__prd/writeback") {
    try {
      const raw = await collectBody(req);
      const body = JSON.parse(raw || "{}");
      const registryId = String(body.registryId || "");
      const requirementId = String(body.requirementId || "");
      const patch = body.patch || {};
      if (!registryId || !requirementId) {
        return sendJson(res, 400, { ok: false, error: "缺少 registryId 或 requirementId" });
      }
      const filePath = findRegistryFile(registryId);
      if (!filePath) {
        return sendJson(res, 404, { ok: false, error: "找不到注册表文件：" + registryId });
      }
      applyPatch(filePath, requirementId, patch);
      return sendJson(res, 200, {
        ok: true,
        file: path.relative(root, filePath).replace(/\\/g, "/"),
      });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: String(err && err.message ? err.message : err) });
    }
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(parsed.pathname || "/", res);
  }
  send(res, 405, "Method Not Allowed");
});

server.listen(port, "127.0.0.1", function () {
  console.log("PRD annotation preview: http://127.0.0.1:" + port + "/");
  console.log("Writeback enabled at POST /__prd/writeback");
});
