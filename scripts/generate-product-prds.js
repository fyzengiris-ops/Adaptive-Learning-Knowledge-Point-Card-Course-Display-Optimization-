/**
 * Skill5: generate page PRD markdown from requirement registries
 * into docs/产品文档/*.md for downstream AI development.
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function loadRegistry(rel) {
  const code = fs.readFileSync(path.join(root, rel), "utf8");
  const g = {};
  const runner = new Function(
    "window",
    "globalThis",
    code + "\n;return globalThis;"
  );
  runner(undefined, g);
  const key = Object.keys(g).find((k) => /Registry$/.test(k));
  if (!key) throw new Error("No registry export in " + rel);
  return g[key];
}

function srcLabel(t) {
  if (t === "code") return "代码事实";
  if (t === "decision") return "确认决策";
  return "代码事实 + 确认决策";
}

function filterItem(s) {
  if (s == null) return false;
  const text = String(s).trim();
  if (!text) return false;
  const bad = [
    "无额外权限限制",
    "无额外数据流转",
    "无异常场景",
    "本对象无操作入口",
    "本对象仅展示",
  ];
  return !bad.includes(text);
}

function pageRelations(reg) {
  const id = reg.registryId;
  if (id === "section-course") {
    return {
      upstream: [
        "- 上级页面：首页（`#home`）",
        "- 入口位置：首页进入课程中心·小节",
        "- 进入方式：hash 跳转至 `#section`",
        "- 传入数据：当前学科与小节学习范围（原型以页面展示为准）",
        "- 依赖状态：已选择学习范围",
      ],
      downstream: [
        "- 下级页面/下游流程：精选卷等练习入口（若页内提供）；筛选抽屉为本页内面板",
        "- 触发方式：试卷「去练习」等操作、打开筛选",
        "- 传出数据：未在当前代码或注册表中确认跨页传参细则",
        "- 后续状态：未在当前代码或注册表中确认",
        "- 返回逻辑：顶栏返回首页",
      ],
    };
  }
  if (id === "chapter-course") {
    return {
      upstream: [
        "- 上级页面：首页（`#home`）",
        "- 入口位置：首页进入课程中心·章节",
        "- 进入方式：hash 跳转至 `#chapter`",
        "- 传入数据：当前学科与章节学习范围（原型以页面展示为准）",
        "- 依赖状态：已选择学习范围",
      ],
      downstream: [
        "- 下级页面/下游流程：课程学习 / 试卷练习等下游（以页内操作为入口）；筛选抽屉为本页内面板",
        "- 触发方式：课程/试卷操作、打开筛选、类型 Tab 切换",
        "- 传出数据：未在当前代码或注册表中确认跨页传参细则",
        "- 后续状态：未在当前代码或注册表中确认",
        "- 返回逻辑：顶栏返回首页",
      ],
    };
  }
  if (id === "kp-lecture-concept") {
    return {
      upstream: [
        "- 上级页面：专项学习中心（`#special`）或知识点学习入口",
        "- 入口位置：点击知识点学习进入精讲卡",
        "- 进入方式：hash 跳转至 `#kp-lecture`（默认第 1 页·核心概念）",
        "- 传入数据：当前知识点 ID/配置（由后台下发；原型为本地数据集）",
        "- 依赖状态：知识点精讲或视频至少一侧有可学内容（详见视频 Tab 规则）",
      ],
      downstream: [
        "- 下级页面/下游流程：同卡第 2 页「考点清单」；知识点视频 Tab（有配置时）；笔记/去测试为壳层入口",
        "- 触发方式：底部分页圆点/箭头进入考点清单；顶栏 Tab 切换视频",
        "- 传出数据：当前知识点上下文",
        "- 后续状态：分页与演示模式为页内状态",
        "- 返回逻辑：顶栏返回专项学习中心",
      ],
    };
  }
  if (id === "kp-lecture-exam") {
    return {
      upstream: [
        "- 上级页面：知识点精讲·核心概念页（同路由 `#kp-lecture` 第 1 页）",
        "- 入口位置：底部分页圆点/箭头",
        "- 进入方式：`setStep` 至考点清单页（`data-page=1`）",
        "- 传入数据：当前知识点下的考点列表配置",
        "- 依赖状态：已进入知识点精讲卡",
      ],
      downstream: [
        "- 下级页面/下游流程：好题本收藏（页内状态/反馈）；返回核心概念页；笔记/去测试为壳层入口",
        "- 触发方式：加入/移出好题本；底部分页回到核心概念",
        "- 传出数据：好题本收藏状态（原型为页内演示状态）",
        "- 后续状态：各考点展开/解析状态页内独立维护",
        "- 返回逻辑：底部分页回到核心概念；顶栏返回专项学习中心",
      ],
    };
  }
  return {
    upstream: [
      "- 上级页面：未在当前代码或注册表中确认",
      "- 入口位置：未在当前代码或注册表中确认",
      "- 进入方式：未在当前代码或注册表中确认",
      "- 传入数据：未在当前代码或注册表中确认",
      "- 依赖状态：未在当前代码或注册表中确认",
    ],
    downstream: [
      "- 下级页面/下游流程：未在当前代码或注册表中确认明确下游流程",
      "- 触发方式：未在当前代码或注册表中确认",
      "- 传出数据：未在当前代码或注册表中确认",
      "- 后续状态：未在当前代码或注册表中确认",
      "- 返回逻辑：未在当前代码或注册表中确认",
    ],
  };
}

function renderPrd(reg) {
  const rel = pageRelations(reg);
  const lines = [];
  lines.push("# " + reg.pageName + " PRD");
  lines.push("");
  lines.push("> 本文档由需求注册表 `logicSections` 生成，供后续 AI/研发按页实现与验收。业务规则与页面角标悬浮面板同源。");
  lines.push("");
  lines.push("## 1. 页面范围");
  lines.push("");
  lines.push("### 1.1 当前页面");
  lines.push("- 页面名称：" + reg.pageName);
  lines.push("- 所属模块：" + reg.module);
  lines.push("- 页面路由/视图：`" + reg.route + "`");
  lines.push("- 相关代码文件：");
  (reg.relatedFiles || []).forEach((f) => lines.push("  - `" + f + "`"));
  lines.push("");
  lines.push("### 1.2 上级页面/上游入口");
  rel.upstream.forEach((x) => lines.push(x));
  lines.push("");
  lines.push("### 1.3 下级页面/下游流程");
  rel.downstream.forEach((x) => lines.push(x));
  lines.push("");
  lines.push("### 1.4 范围边界摘要");
  lines.push("- 本文档覆盖：" + (reg.description || reg.pageName));
  const excluded = reg.excludedDecisions || [];
  if (excluded.length) {
    lines.push(
      "- 本文档不覆盖：" +
        excluded.map((e) => e.objectName || e.decisionObject || "").filter(Boolean).join("、")
    );
  } else {
    lines.push("- 本文档不覆盖：见第 4 章");
  }
  lines.push("");
  lines.push("## 2. 功能概述");
  lines.push("");
  lines.push(
    reg.description ||
      "本文档描述「" + reg.pageName + "」的业务逻辑，供后续开发实现与验收。"
  );
  lines.push("");
  lines.push("## 3. 业务逻辑说明");
  lines.push("");

  (reg.requirements || []).forEach((req) => {
    lines.push("### " + req.id + " " + req.title);
    lines.push("");
    lines.push("来源：" + srcLabel(req.sourceType));
    lines.push("");
    const sections = req.logicSections || [];
    sections.forEach((sec) => {
      const items = (sec.items || []).filter(filterItem);
      if (!sec || !sec.title || !items.length) return;
      lines.push("#### " + sec.title);
      items.forEach((it, idx) => {
        lines.push("1." + (idx + 1) + " " + String(it).trim());
      });
      lines.push("");
    });
    const acc = (req.acceptance || []).filter(filterItem);
    if (acc.length) {
      lines.push("#### 验收标准");
      acc.forEach((a, idx) => lines.push(idx + 1 + ". " + String(a).trim()));
      lines.push("");
    }
  });

  lines.push("## 4. 范围边界");
  lines.push("");
  lines.push("### 4.1 本文档覆盖");
  lines.push("");
  lines.push("- " + (reg.description || reg.pageName));
  (reg.requirements || []).forEach((req) => {
    lines.push("- `" + req.id + "` " + req.title);
  });
  lines.push("");
  lines.push("### 4.2 本文档不覆盖");
  lines.push("");
  if (excluded.length) {
    excluded.forEach((e) => {
      const name = e.objectName || e.decisionObject || "未命名";
      const reason = e.reason || "";
      lines.push("- " + name + (reason ? "：" + reason : ""));
    });
  } else {
    lines.push("- 无额外 excludedDecisions 记录");
  }
  lines.push("");
  lines.push("## 5. 验收标准");
  lines.push("");
  (reg.requirements || []).forEach((req) => {
    const acc = (req.acceptance || []).filter(filterItem);
    if (!acc.length) return;
    lines.push("### " + req.id);
    lines.push("");
    acc.forEach((a, idx) => lines.push(idx + 1 + ". " + String(a).trim()));
    lines.push("");
  });

  lines.push("## 6. 来源追溯");
  lines.push("");
  lines.push("- 需求注册表：`js/requirements/" + reg.registryId + ".registry.js`（registryId=`" + reg.registryId + "`）");
  lines.push("- 来源决策文件：`" + (reg.sourceDecisionFile || "未标注") + "`");
  lines.push("- 相关代码文件：");
  (reg.relatedFiles || []).forEach((f) => lines.push("  - `" + f + "`"));
  lines.push("");
  return lines.join("\n");
}

const jobs = [
  {
    registry: "js/requirements/section-course.registry.js",
    out: "docs/产品文档/01-小节课程中心.md",
  },
  {
    registry: "js/requirements/chapter-course.registry.js",
    out: "docs/产品文档/02-章节课程中心.md",
  },
  {
    registry: "js/requirements/kp-lecture-concept.registry.js",
    out: "docs/产品文档/03-知识卡片-核心概念.md",
  },
  {
    registry: "js/requirements/kp-lecture-exam.registry.js",
    out: "docs/产品文档/04-知识卡片-考点清单.md",
  },
];

const only = process.argv[2]; // optional 1|2|3|4
const selected = only
  ? jobs.filter((_, i) => String(i + 1) === String(only))
  : jobs;

selected.forEach((job) => {
  const reg = loadRegistry(job.registry);
  const md = renderPrd(reg);
  const outPath = path.join(root, job.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md, "utf8");
  console.log(
    "Wrote",
    job.out,
    "reqs=",
    (reg.requirements || []).length,
    "bytes=",
    Buffer.byteLength(md, "utf8")
  );
});
