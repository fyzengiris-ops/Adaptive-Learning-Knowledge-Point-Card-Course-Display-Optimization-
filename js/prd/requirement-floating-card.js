/**
 * 悬浮业务逻辑面板：原样展示 logicSections
 */
(function (global) {
  var cardEl = null;
  var dragState = null;
  var currentRequirementId = null;

  function ensureCard() {
    if (cardEl) return cardEl;
    cardEl = document.createElement("div");
    cardEl.className = "req-float-card";
    cardEl.hidden = true;
    cardEl.innerHTML =
      '<div class="req-float-head">' +
      '<div class="req-float-head-main">' +
      '<div class="req-float-id"></div>' +
      '<div class="req-float-title"></div>' +
      "</div>" +
      '<button type="button" class="req-float-close" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="req-float-body"></div>' +
      '<div class="req-float-resizer" aria-hidden="true"></div>';
    document.body.appendChild(cardEl);

    cardEl.querySelector(".req-float-close").addEventListener("click", hide);
    bindDrag(cardEl.querySelector(".req-float-head"));
    bindResize(cardEl.querySelector(".req-float-resizer"));
    return cardEl;
  }

  function bindDrag(handle) {
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".req-float-close")) return;
      var card = ensureCard();
      var rect = card.getBoundingClientRect();
      dragState = {
        mode: "drag",
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragState || dragState.mode !== "drag") return;
      var card = ensureCard();
      var x = e.clientX - dragState.offsetX;
      var y = e.clientY - dragState.offsetY;
      var maxX = window.innerWidth - card.offsetWidth - 8;
      var maxY = window.innerHeight - 48;
      card.style.left = Math.max(8, Math.min(x, maxX)) + "px";
      card.style.top = Math.max(8, Math.min(y, maxY)) + "px";
      card.style.right = "auto";
    });
    handle.addEventListener("pointerup", function () {
      dragState = null;
    });
  }

  function bindResize(handle) {
    handle.addEventListener("pointerdown", function (e) {
      var card = ensureCard();
      var rect = card.getBoundingClientRect();
      dragState = {
        mode: "resize",
        startX: e.clientX,
        startY: e.clientY,
        startW: rect.width,
        startH: rect.height,
      };
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragState || dragState.mode !== "resize") return;
      var card = ensureCard();
      var w = Math.max(280, Math.min(560, dragState.startW + (e.clientX - dragState.startX)));
      var h = Math.max(220, Math.min(window.innerHeight - 24, dragState.startH + (e.clientY - dragState.startY)));
      card.style.width = w + "px";
      card.style.height = h + "px";
    });
    handle.addEventListener("pointerup", function () {
      dragState = null;
    });
  }

  function escapeHtml(text) {
    if (global.RequirementUtils && global.RequirementUtils.escapeHtml) {
      return global.RequirementUtils.escapeHtml(text);
    }
    return String(text)
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

  function buildBodyHtml(requirement) {
    var sections = global.RequirementUtils.getVisibleLogicSections(requirement);
    if (!sections.length) {
      return '<p class="req-float-empty">暂无业务逻辑说明</p>';
    }
    return sections
      .map(function (section, sectionIdx) {
        var groupNo = sectionIdx + 1;
        var list = section.items
          .map(function (item, idx) {
            var no = groupNo + "." + (idx + 1);
            return (
              '<li class="req-float-item">' +
              '<span class="req-float-item-no">' +
              no +
              "</span>" +
              '<span class="req-float-item-text">' +
              formatItemHtml(item) +
              "</span>" +
              "</li>"
            );
          })
          .join("");
        return (
          '<section class="req-float-section">' +
          "<h4>" +
          escapeHtml(section.title) +
          "</h4>" +
          '<ol class="req-float-list">' +
          list +
          "</ol>" +
          "</section>"
        );
      })
      .join("");
  }

  function positionNear(anchorEl) {
    var card = ensureCard();
    var rect = anchorEl.getBoundingClientRect();
    var width = card.offsetWidth || 360;
    var height = Math.min(card.offsetHeight || 320, window.innerHeight - 24);
    var left = rect.right + 12;
    var top = rect.top;
    if (left + width > window.innerWidth - 8) {
      left = Math.max(8, rect.left - width - 12);
    }
    if (top + height > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - height - 8);
    }
    card.style.left = left + "px";
    card.style.top = top + "px";
    card.style.right = "auto";
  }

  function show(requirement, anchorEl) {
    if (!requirement) return;
    var card = ensureCard();
    currentRequirementId = requirement.id;
    card.querySelector(".req-float-id").textContent = requirement.id;
    card.querySelector(".req-float-title").textContent = requirement.title || "";
    card.querySelector(".req-float-body").innerHTML = buildBodyHtml(requirement);
    card.hidden = false;
    if (anchorEl) positionNear(anchorEl);
    document.querySelectorAll(".req-marker").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-req-id") === requirement.id);
    });
    if (
      global.RequirementPanel &&
      typeof global.RequirementPanel.setSelected === "function" &&
      global.RequirementPanel.getSelectedId() !== requirement.id
    ) {
      global.RequirementPanel.setSelected(requirement.id, { source: "floating" });
    }
  }

  function hide() {
    if (!cardEl) return;
    cardEl.hidden = true;
    currentRequirementId = null;
    document.querySelectorAll(".req-marker").forEach(function (btn) {
      btn.classList.remove("is-active");
    });
  }

  global.RequirementFloatingCard = {
    show: show,
    hide: hide,
    getCurrentRequirementId: function () {
      return currentRequirementId;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
