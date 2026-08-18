/**
 * 右侧 PRD 阅读面板：列表 + logicSections 详情 + activate
 */
(function (global) {
  var panelEl = null;
  var listEl = null;
  var detailEl = null;
  var pageSelectEl = null;
  var selectedId = null;
  var currentRegistryId = null;

  function escapeHtml(text) {
    if (global.RequirementUtils && global.RequirementUtils.escapeHtml) {
      return global.RequirementUtils.escapeHtml(text);
    }
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatItemHtml(text) {
    if (global.RequirementUtils && global.RequirementUtils.formatLogicItemHtml) {
      return global.RequirementUtils.formatLogicItemHtml(text);
    }
    return escapeHtml(text);
  }

  function sourceLabel(type) {
    if (type === "code") return "代码事实";
    if (type === "decision") return "确认决策";
    return "代码事实 + 确认决策";
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function getRegistries() {
    return (global.RequirementUtils && global.RequirementUtils.getRequirementRegistries()) ||
      global.requirementRegistries ||
      [];
  }

  function getRegistryById(id) {
    if (typeof global.getRequirementRegistry === "function") {
      return global.getRequirementRegistry(id);
    }
    return getRegistries().find(function (r) {
      return r.registryId === id;
    }) || null;
  }

  function registryForCurrentRoute() {
    var hash = (location.hash || "").replace(/^#/, "");
    if (hash === "kp-lecture") {
      var slider = document.querySelector("#kp-card-root .kp-slider");
      var page = slider ? String(slider.getAttribute("data-page") || "0") : "0";
      return getRegistryById(page === "1" ? "kp-lecture-exam" : "kp-lecture-concept");
    }
    if (hash === "section") return getRegistryById("section-course");
    if (hash === "chapter") return getRegistryById("chapter-course");
    return null;
  }

  function ensureDom() {
    if (panelEl) return panelEl;
    panelEl = document.getElementById("prd-side-panel");
    if (!panelEl) return null;
    listEl = panelEl.querySelector("[data-prd-list]");
    detailEl = panelEl.querySelector("[data-prd-detail]");
    pageSelectEl = panelEl.querySelector("[data-prd-page-select]");
    return panelEl;
  }

  function buildDetailHtml(requirement) {
    var sections =
      global.RequirementUtils && global.RequirementUtils.getVisibleLogicSections
        ? global.RequirementUtils.getVisibleLogicSections(requirement)
        : requirement.logicSections || [];
    if (!sections.length) {
      return '<p class="prd-detail-empty">暂无业务逻辑说明</p>';
    }
    var html = sections
      .map(function (section, sectionIdx) {
        var groupNo = sectionIdx + 1;
        var items = (section.items || [])
          .map(function (item, idx) {
            return (
              '<li><span class="prd-item-no">' +
              groupNo +
              "." +
              (idx + 1) +
              "</span><span>" +
              formatItemHtml(item) +
              "</span></li>"
            );
          })
          .join("");
        return (
          '<section class="prd-logic-section"><h4>' +
          escapeHtml(section.title) +
          "</h4><ol>" +
          items +
          "</ol></section>"
        );
      })
      .join("");

    var acceptance = (requirement.acceptance || []).filter(function (a) {
      return !(global.RequirementUtils && global.RequirementUtils.isEmptyFallback(a));
    });
    if (acceptance.length) {
      html +=
        '<section class="prd-logic-section"><h4>验收标准</h4><ol>' +
        acceptance
          .map(function (a, idx) {
            return "<li><span class=\"prd-item-no\">" + (idx + 1) + ".</span><span>" + escapeHtml(a) + "</span></li>";
          })
          .join("") +
        "</ol></section>";
    }
    return html;
  }

  function renderList(registry) {
    ensureDom();
    if (!listEl || !registry) return;
    currentRegistryId = registry.registryId;
    var reqs = registry.requirements || [];
    listEl.innerHTML = reqs
      .map(function (req, idx) {
        return (
          '<button type="button" class="prd-req-card' +
          (req.id === selectedId ? " is-active" : "") +
          '" data-req-id="' +
          escapeHtml(req.id) +
          '">' +
          '<span class="prd-req-no">' +
          (idx + 1) +
          "</span>" +
          '<span class="prd-req-main">' +
          '<span class="prd-req-id">' +
          escapeHtml(req.id) +
          "</span>" +
          '<span class="prd-req-title">' +
          escapeHtml(req.title || "") +
          "</span>" +
          "</span></button>"
        );
      })
      .join("");
  }

  function renderDetail(requirement) {
    ensureDom();
    if (!detailEl) return;
    if (!requirement) {
      detailEl.innerHTML =
        '<div class="prd-detail-placeholder">选择左侧需求卡片，查看业务逻辑并定位页面对象。</div>';
      return;
    }
    detailEl.innerHTML =
      '<div class="prd-detail-head">' +
      '<div class="prd-detail-id">' +
      escapeHtml(requirement.id) +
      "</div>" +
      '<div class="prd-detail-title">' +
      escapeHtml(requirement.title || "") +
      "</div>" +
      '<div class="prd-detail-meta">来源：' +
      escapeHtml(sourceLabel(requirement.sourceType)) +
      (requirement.anchorId ? " · 锚点：" + escapeHtml(requirement.anchorId) : "") +
      "</div></div>" +
      '<div class="prd-detail-body">' +
      buildDetailHtml(requirement) +
      "</div>";
  }

  function fillPageSelect() {
    ensureDom();
    if (!pageSelectEl) return;
    var regs = getRegistries();
    pageSelectEl.innerHTML = regs
      .map(function (r) {
        return (
          '<option value="' +
          escapeHtml(r.registryId) +
          '">' +
          escapeHtml(r.pageName || r.registryId) +
          "</option>"
        );
      })
      .join("");
  }

  function setSelected(requirementId, options) {
    selectedId = requirementId || null;
    ensureDom();
    if (listEl) {
      listEl.querySelectorAll(".prd-req-card").forEach(function (card) {
        card.classList.toggle("is-active", card.getAttribute("data-req-id") === selectedId);
      });
    }
    var req =
      selectedId && global.RequirementUtils
        ? global.RequirementUtils.getRequirementById(selectedId)
        : null;
    renderDetail(req);

    document.querySelectorAll(".req-marker").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-req-id") === selectedId);
    });

    if (options && options.syncFloating && req && global.RequirementFloatingCard) {
      var marker = document.querySelector('.req-marker[data-req-id="' + selectedId + '"]');
      global.RequirementFloatingCard.show(req, marker || null);
    }
  }

  async function runActivateStep(step) {
    var bridge = global.PrdPrototypeBridge || {};
    switch (step.type) {
      case "navigate": {
        var to = (step.to || "").replace(/^#/, "");
        var cur = (location.hash || "").replace(/^#/, "");
        if (to && to !== cur) {
          location.hash = "#" + to;
          await wait(80);
        }
        break;
      }
      case "openPanel": {
        if (step.panel === "filter-drawer" && typeof bridge.openFilter === "function") {
          bridge.openFilter();
          await wait(60);
        }
        break;
      }
      case "openDialog": {
        if (typeof bridge.openDialog === "function") bridge.openDialog(step.dialog);
        await wait(60);
        break;
      }
      case "setTab": {
        if (typeof bridge.setTab === "function") {
          bridge.setTab(step.tab);
          await wait(60);
        } else if (typeof bridge.switchChapterType === "function" && step.tab) {
          bridge.switchChapterType(step.tab);
          await wait(60);
        } else if (typeof bridge.setLectureTab === "function" && step.tab) {
          bridge.setLectureTab(step.tab);
          await wait(60);
        }
        break;
      }
      case "setStep": {
        if (typeof bridge.setKpPage === "function") {
          bridge.setKpPage(Number(step.step) || 0);
          await wait(80);
        }
        break;
      }
      case "scrollTo": {
        if (global.RequirementHighlight && step.anchorId) {
          global.RequirementHighlight.scrollToAnchor(step.anchorId);
          await wait(40);
        }
        break;
      }
      case "highlight": {
        if (global.RequirementHighlight && step.anchorId) {
          global.RequirementHighlight.highlight(step.anchorId);
        }
        break;
      }
      default:
        break;
    }
  }

  async function activateRequirement(requirement) {
    if (!requirement) return;
    setSelected(requirement.id, { source: "panel" });
    var steps = requirement.activate || [];
    for (var i = 0; i < steps.length; i += 1) {
      try {
        await runActivateStep(steps[i]);
      } catch (err) {
        // 降级：尽量继续后续 scroll/highlight
      }
    }
    // 若 activate 未含 scroll/highlight，仍尝试锚点
    if (requirement.anchorId && global.RequirementHighlight) {
      var hasScroll = steps.some(function (s) {
        return s.type === "scrollTo";
      });
      var hasHl = steps.some(function (s) {
        return s.type === "highlight";
      });
      if (!hasScroll) global.RequirementHighlight.scrollToAnchor(requirement.anchorId);
      if (!hasHl) global.RequirementHighlight.highlight(requirement.anchorId);
    }
  }

  function showRegistry(registryId) {
    ensureDom();
    var registry = registryId ? getRegistryById(registryId) : registryForCurrentRoute();
    if (!registry) {
      var regs = getRegistries();
      registry = regs[0] || null;
    }
    if (!registry) {
      if (listEl) listEl.innerHTML = '<p class="prd-detail-empty">暂无需求注册表</p>';
      renderDetail(null);
      return;
    }
    if (pageSelectEl) pageSelectEl.value = registry.registryId;
    var titleEl = panelEl && panelEl.querySelector("[data-prd-page-title]");
    if (titleEl) titleEl.textContent = registry.pageName || registry.registryId;
    selectedId = null;
    renderList(registry);
    renderDetail(null);
  }

  function syncToRoute() {
    var registry = registryForCurrentRoute();
    if (!registry) return;
    if (registry.registryId !== currentRegistryId) {
      showRegistry(registry.registryId);
    }
  }

  function bindPanelEvents() {
    ensureDom();
    if (!panelEl || panelEl.getAttribute("data-bound") === "1") return;
    panelEl.setAttribute("data-bound", "1");

    if (pageSelectEl) {
      pageSelectEl.addEventListener("change", function () {
        var id = pageSelectEl.value;
        var reg = getRegistryById(id);
        if (!reg) return;
        // 切到对应路由，便于看锚点
        if (reg.route) {
          var hash = String(reg.route).replace(/^#/, "");
          if ((location.hash || "").replace(/^#/, "") !== hash) {
            location.hash = "#" + hash;
          }
        }
        showRegistry(id);
        if (id === "kp-lecture-exam" && global.PrdPrototypeBridge && global.PrdPrototypeBridge.setKpPage) {
          global.PrdPrototypeBridge.setKpPage(1);
        }
        if (id === "kp-lecture-concept" && global.PrdPrototypeBridge && global.PrdPrototypeBridge.setKpPage) {
          global.PrdPrototypeBridge.setKpPage(0);
        }
      });
    }

    if (listEl) {
      listEl.addEventListener("click", function (e) {
        var card = e.target.closest(".prd-req-card");
        if (!card) return;
        var id = card.getAttribute("data-req-id");
        var req = global.RequirementUtils && global.RequirementUtils.getRequirementById(id);
        if (req) activateRequirement(req);
      });
    }
  }

  function init() {
    ensureDom();
    fillPageSelect();
    bindPanelEvents();
    showRegistry(null);
    window.addEventListener("hashchange", function () {
      setTimeout(syncToRoute, 50);
    });
  }

  global.RequirementPanel = {
    init: init,
    showRegistry: showRegistry,
    activateRequirement: activateRequirement,
    setSelected: setSelected,
    syncToRoute: syncToRoute,
    getSelectedId: function () {
      return selectedId;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
