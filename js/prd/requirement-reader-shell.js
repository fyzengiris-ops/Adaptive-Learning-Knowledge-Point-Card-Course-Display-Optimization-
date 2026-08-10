/**
 * PRD 阅读 Shell：开关右侧面板、拖拽宽度、挤压原型区
 */
(function (global) {
  var shellEl = null;
  var panelEl = null;
  var toggleEl = null;
  var resizerEl = null;
  var open = false;
  var panelWidth = 380;
  var drag = null;

  var STORAGE_KEY = "prd-reader-panel-width";

  function loadWidth() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var n = raw ? Number(raw) : NaN;
      if (!Number.isNaN(n) && n >= 280) return n;
    } catch (err) {}
    return Math.max(360, Math.round(window.innerWidth * 0.28));
  }

  function saveWidth(w) {
    try {
      localStorage.setItem(STORAGE_KEY, String(w));
    } catch (err) {}
  }

  function clampWidth(w) {
    var max = Math.floor(window.innerWidth * 0.5);
    return Math.max(280, Math.min(max, w));
  }

  function applyLayout() {
    if (!shellEl) return;
    panelWidth = clampWidth(panelWidth);
    var offset = open ? panelWidth + 16 + "px" : "20px";
    shellEl.style.setProperty("--prd-panel-width", panelWidth + "px");
    shellEl.style.setProperty("--prd-panel-offset", offset);
    // toggle 挂在 body 下，变量写到 :root，避免不继承
    document.documentElement.style.setProperty("--prd-panel-offset", offset);
    if (open) {
      shellEl.classList.add("is-panel-open");
      shellEl.style.gridTemplateColumns = "minmax(0, 1fr) " + panelWidth + "px";
      if (panelEl) panelEl.hidden = false;
      if (toggleEl) toggleEl.setAttribute("aria-pressed", "true");
    } else {
      shellEl.classList.remove("is-panel-open");
      shellEl.style.gridTemplateColumns = "minmax(0, 1fr)";
      if (panelEl) panelEl.hidden = true;
      if (toggleEl) toggleEl.setAttribute("aria-pressed", "false");
    }
  }

  function setOpen(next) {
    open = !!next;
    applyLayout();
    if (open && global.RequirementPanel) {
      global.RequirementPanel.syncToRoute();
    }
  }

  function toggle() {
    setOpen(!open);
  }

  function bindResize() {
    if (!resizerEl) return;
    resizerEl.addEventListener("pointerdown", function (e) {
      if (!open) return;
      drag = {
        startX: e.clientX,
        startW: panelWidth,
      };
      resizerEl.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    resizerEl.addEventListener("pointermove", function (e) {
      if (!drag) return;
      // 向左拖增大面板
      var next = clampWidth(drag.startW + (drag.startX - e.clientX));
      panelWidth = next;
      applyLayout();
    });
    resizerEl.addEventListener("pointerup", function () {
      if (!drag) return;
      drag = null;
      saveWidth(panelWidth);
    });
  }

  function init() {
    shellEl = document.getElementById("prd-reader-shell");
    panelEl = document.getElementById("prd-side-panel");
    toggleEl = document.getElementById("prd-panel-toggle");
    resizerEl = document.getElementById("prd-panel-resizer");
    if (!shellEl || !panelEl || !toggleEl) return;

    // 保证挂在 body 下，不被 shell grid / overflow 影响定位
    if (toggleEl.parentElement !== document.body) {
      document.body.appendChild(toggleEl);
    }

    panelWidth = loadWidth();
    setOpen(false);

    toggleEl.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });

    var closeBtn = panelEl.querySelector("[data-prd-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });
    }

    bindResize();
    window.addEventListener("resize", function () {
      panelWidth = clampWidth(panelWidth);
      applyLayout();
    });

    if (global.RequirementPanel && typeof global.RequirementPanel.init === "function") {
      global.RequirementPanel.init();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.RequirementReaderShell = {
    open: function () {
      setOpen(true);
    },
    close: function () {
      setOpen(false);
    },
    toggle: toggle,
    isOpen: function () {
      return open;
    },
    getPanelWidth: function () {
      return panelWidth;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
