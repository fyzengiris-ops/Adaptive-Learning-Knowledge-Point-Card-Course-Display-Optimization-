/**
 * 需求锚点高亮
 */
(function (global) {
  var currentAnchorId = null;
  var clearTimer = null;

  function clearHighlight() {
    document.querySelectorAll(".req-anchor-highlight").forEach(function (el) {
      el.classList.remove("req-anchor-highlight");
    });
    currentAnchorId = null;
  }

  function highlight(anchorId, options) {
    clearHighlight();
    if (!anchorId) return null;
    var el = document.querySelector('[data-req-anchor="' + anchorId + '"]');
    if (!el) return null;
    currentAnchorId = anchorId;
    el.classList.add("req-anchor-highlight");
    if (clearTimer) clearTimeout(clearTimer);
    var duration = options && options.duration != null ? options.duration : 2600;
    if (duration > 0) {
      clearTimer = setTimeout(function () {
        if (currentAnchorId === anchorId) clearHighlight();
      }, duration);
    }
    return el;
  }

  function scrollToAnchor(anchorId) {
    var el = document.querySelector('[data-req-anchor="' + anchorId + '"]');
    if (!el) return null;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch (err) {
      el.scrollIntoView(true);
    }
    return el;
  }

  global.RequirementHighlight = {
    highlight: highlight,
    scrollToAnchor: scrollToAnchor,
    clear: clearHighlight,
    getCurrentAnchorId: function () {
      return currentAnchorId;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
