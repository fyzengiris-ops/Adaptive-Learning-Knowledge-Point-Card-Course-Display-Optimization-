/**
 * 浏览器内编辑需求正文，并反写 js/requirements/*.registry.js
 * 需使用 scripts/prd-dev-server.js（或 kit 内同名脚本）启动预览。
 */
(function (global) {
  var toastTimer = null;

  function getConfig() {
    return global.PRD_ANNOTATION_CONFIG || {};
  }

  function writebackUrl() {
    return getConfig().writebackUrl || "/__prd/writeback";
  }

  function findRegistryId(requirementId) {
    var regs =
      (global.RequirementUtils && global.RequirementUtils.getRequirementRegistries()) ||
      global.requirementRegistries ||
      [];
    for (var i = 0; i < regs.length; i += 1) {
      var list = regs[i].requirements || [];
      for (var j = 0; j < list.length; j += 1) {
        if (list[j].id === requirementId) return regs[i].registryId;
      }
    }
    return null;
  }

  function showToast(message, kind) {
    var el = document.getElementById("prd-writeback-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "prd-writeback-toast";
      el.className = "prd-writeback-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.setAttribute("data-kind", kind || "ok");
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 2600);
  }

  function cloneSections(sections) {
    return (sections || []).map(function (section) {
      return {
        title: section.title,
        items: (section.items || []).slice(),
      };
    });
  }

  async function postPatch(payload) {
    var res = await fetch(writebackUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    var data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    if (!res.ok || !data || !data.ok) {
      var msg = (data && data.error) || "HTTP " + res.status;
      throw new Error(msg);
    }
    return data;
  }

  /**
   * @param {object} requirement
   * @param {{ title?: string, logicSections?: Array }} patch
   */
  async function saveRequirementPatch(requirement, patch) {
    if (!requirement || !requirement.id) {
      throw new Error("缺少需求对象");
    }
    var registryId = findRegistryId(requirement.id);
    if (!registryId) throw new Error("找不到需求所属注册表");

    var prevTitle = requirement.title;
    var prevSections = cloneSections(requirement.logicSections);

    if (patch.title != null) requirement.title = String(patch.title);
    if (patch.logicSections) {
      requirement.logicSections = cloneSections(patch.logicSections);
    }

    try {
      await postPatch({
        registryId: registryId,
        requirementId: requirement.id,
        patch: {
          title: requirement.title,
          logicSections: requirement.logicSections,
        },
      });
      showToast("已写回注册表", "ok");
      return true;
    } catch (err) {
      requirement.title = prevTitle;
      requirement.logicSections = prevSections;
      var hint =
        String(err && err.message).indexOf("Failed to fetch") >= 0 ||
        String(err && err.message).indexOf("404") >= 0
          ? "写回失败：请用 node scripts/prd-dev-server.js 启动预览"
          : "写回失败：" + ((err && err.message) || "未知错误");
      showToast(hint, "err");
      return false;
    }
  }

  function readEditableText(el) {
    var text = el.innerText != null ? el.innerText : el.textContent || "";
    text = String(text).replace(/\r\n/g, "\n").replace(/\u00a0/g, " ");
    if (/\n\n$/.test(text)) return text;
    return text.replace(/\n$/, "");
  }

  function finishEdit(el) {
    if (!el || el.getAttribute("contenteditable") !== "true") return null;
    var text = readEditableText(el);
    el.removeAttribute("contenteditable");
    el.classList.remove("is-editing");
    return text;
  }

  function startEdit(el, rawText) {
    if (!el) return;
    el.setAttribute("contenteditable", "true");
    el.classList.add("is-editing");
    el.textContent = rawText == null ? el.textContent : rawText;
    el.focus();
    try {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * 在容器上委托双击编辑。
   * 可编辑节点需带：
   * - data-edit-field="title"
   * - data-edit-field="sectionTitle" data-edit-section="0"
   * - data-edit-field="item" data-edit-section="0" data-edit-item="0"
   */
  function bindDelegatedEdit(root, options) {
    if (!root || root.getAttribute("data-prd-edit-bound") === "1") return;
    root.setAttribute("data-prd-edit-bound", "1");

    root.addEventListener("dblclick", function (e) {
      var target = e.target.closest("[data-edit-field]");
      if (!target || !root.contains(target)) return;
      e.preventDefault();
      e.stopPropagation();
      var req = options.getRequirement && options.getRequirement();
      if (!req) return;
      var field = target.getAttribute("data-edit-field");
      var raw = "";
      if (field === "title") raw = req.title || "";
      if (field === "sectionTitle") {
        var sIdx = Number(target.getAttribute("data-edit-section"));
        raw = (req.logicSections && req.logicSections[sIdx] && req.logicSections[sIdx].title) || "";
      }
      if (field === "item") {
        var si = Number(target.getAttribute("data-edit-section"));
        var ii = Number(target.getAttribute("data-edit-item"));
        raw =
          (req.logicSections &&
            req.logicSections[si] &&
            req.logicSections[si].items &&
            req.logicSections[si].items[ii]) ||
          "";
      }
      startEdit(target, raw);
    });

    async function persistSections(req, sections) {
      await saveRequirementPatch(req, { logicSections: sections });
      if (options.onSaved) options.onSaved(req);
    }

    async function removeItem(req, sectionIndex, itemIndex) {
      var sections = cloneSections(req.logicSections);
      if (!sections[sectionIndex] || !sections[sectionIndex].items) return;
      if (itemIndex < 0 || itemIndex >= sections[sectionIndex].items.length) return;
      sections[sectionIndex].items.splice(itemIndex, 1);
      if (!sections[sectionIndex].items.length) sections.splice(sectionIndex, 1);
      await persistSections(req, sections);
    }

    async function commit(target) {
      var req = options.getRequirement && options.getRequirement();
      if (!req) {
        finishEdit(target);
        return;
      }
      var field = target.getAttribute("data-edit-field");
      var next = finishEdit(target);
      if (next == null) return;
      if (field !== "item") next = String(next || "").trim();
      var patch = {};
      if (field === "title") {
        if (next === (req.title || "")) return;
        patch.title = next;
      } else {
        var sections = cloneSections(req.logicSections);
        var sIndex = Number(target.getAttribute("data-edit-section"));
        if (!sections[sIndex]) return;
        if (field === "sectionTitle") {
          if (next === sections[sIndex].title) return;
          if (!next) {
            if (options.onSaved) options.onSaved(req);
            return;
          }
          sections[sIndex].title = next;
        } else if (field === "item") {
          var iIndex = Number(target.getAttribute("data-edit-item"));
          if (sections[sIndex].items[iIndex] === next) return;
          if (!String(next).trim()) {
            await removeItem(req, sIndex, iIndex);
            return;
          }
          sections[sIndex].items[iIndex] = next;
        }
        patch.logicSections = sections;
      }
      await saveRequirementPatch(req, patch);
      if (options.onSaved) options.onSaved(req);
    }

    root.addEventListener("pointerdown", function (e) {
      var del = e.target.closest("[data-edit-delete]");
      if (!del || !root.contains(del)) return;
      e.preventDefault();
      e.stopPropagation();
      var req = options.getRequirement && options.getRequirement();
      if (!req) return;
      removeItem(
        req,
        Number(del.getAttribute("data-edit-section")),
        Number(del.getAttribute("data-edit-item"))
      );
    });

    root.addEventListener("keydown", function (e) {
      var target = e.target.closest("[data-edit-field]");
      if (!target || target.getAttribute("contenteditable") !== "true") return;
      e.stopPropagation();
      if (e.key === "Escape") {
        e.preventDefault();
        var req = options.getRequirement && options.getRequirement();
        finishEdit(target);
        if (options.onSaved) options.onSaved(req);
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commit(target);
      } else if (
        (e.key === "Backspace" || e.key === "Delete") &&
        target.getAttribute("data-edit-field") === "item"
      ) {
        var text = String(
          target.innerText != null ? target.innerText : target.textContent || ""
        )
          .replace(/\u00a0/g, " ")
          .trim();
        if (!text) {
          e.preventDefault();
          var current = options.getRequirement && options.getRequirement();
          if (!current) return;
          finishEdit(target);
          removeItem(
            current,
            Number(target.getAttribute("data-edit-section")),
            Number(target.getAttribute("data-edit-item"))
          );
        }
      }
    });

    root.addEventListener("blur", function (e) {
      var target = e.target.closest && e.target.closest("[data-edit-field]");
      if (!target || target.getAttribute("contenteditable") !== "true") return;
      commit(target);
    }, true);
  }

  global.RequirementWriteback = {
    saveRequirementPatch: saveRequirementPatch,
    bindDelegatedEdit: bindDelegatedEdit,
    findRegistryId: findRegistryId,
    showToast: showToast,
  };
})(typeof window !== "undefined" ? window : globalThis);
