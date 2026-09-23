/**
 * 页面需求角标：页面显示可编辑序号，面板展示完整需求编号
 * 单击打开悬浮面板；双击修改展示序号（不改底层 id / 锚点关联）
 *
 * 改号规则：仅对「旧序号 ↔ 新序号」闭区间内的其他角标顺延，
 * 该区间之外的序号一律不动。
 */
(function (global) {
  var mounted = false;
  var clickTimer = null;
  var editingMarker = null;
  var currentRegistryId = null;
  /** @type {Record<string, number>} */
  var numberMap = {};

  function getActiveVersion() {
    if (global.RequirementUtils && global.RequirementUtils.getSelectedVersion) {
      return global.RequirementUtils.getSelectedVersion();
    }
    return "V0.8.2";
  }

  function storageKey(registryId, version) {
    return (
      "req-marker-numbers:" +
      (registryId || "default") +
      ":" +
      (version || getActiveVersion())
    );
  }

  function legacyUnversionedNumberKey(registryId) {
    return "req-marker-numbers:" + (registryId || "default");
  }

  function legacyOrderKey(registryId) {
    return "req-marker-order:" + (registryId || "default");
  }

  function getRegistryById(registryId) {
    if (global.RequirementUtils && global.RequirementUtils.getRegistryById) {
      return global.RequirementUtils.getRegistryById(registryId);
    }
    if (!registryId) return null;
    if (typeof global.getRequirementRegistry === "function") {
      return global.getRequirementRegistry(registryId);
    }
    return null;
  }

  function getRegistryForHash(hash) {
    if (global.RequirementUtils && global.RequirementUtils.getRegistryForHash) {
      return global.RequirementUtils.getRegistryForHash(hash);
    }
    return getRegistryById("");
  }

  function loadNumberMap(registryId) {
    try {
      var raw = localStorage.getItem(storageKey(registryId));
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      }
      // V0.8.2 兼容未带版本号的旧序号存储
      if (getActiveVersion() === "V0.8.2") {
        var unversioned = localStorage.getItem(legacyUnversionedNumberKey(registryId));
        if (unversioned) {
          var oldMap = JSON.parse(unversioned);
          if (oldMap && typeof oldMap === "object" && !Array.isArray(oldMap)) {
            return oldMap;
          }
        }
      }
      // 兼容旧版「顺序数组」存储
      var legacy = localStorage.getItem(legacyOrderKey(registryId));
      if (legacy) {
        var arr = JSON.parse(legacy);
        if (Array.isArray(arr)) {
          var migrated = {};
          arr.forEach(function (id, index) {
            migrated[id] = index + 1;
          });
          return migrated;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function saveNumberMap(registryId, map) {
    try {
      localStorage.setItem(storageKey(registryId), JSON.stringify(map));
    } catch (e) {
      /* ignore quota / private mode */
    }
  }

  /**
   * 合并已存序号与当前可挂载需求：保留用户序号，新增项接在最大号之后
   */
  function resolveNumberMap(registry, mountedReqs) {
    var saved = loadNumberMap(registry.registryId) || {};
    var map = {};
    var used = {};
    var maxNo = 0;

    mountedReqs.forEach(function (req) {
      var n = parseInt(saved[req.id], 10);
      if (!isNaN(n) && n > 0 && !used[n]) {
        map[req.id] = n;
        used[n] = true;
        if (n > maxNo) maxNo = n;
      }
    });

    mountedReqs.forEach(function (req, index) {
      if (map[req.id]) return;
      var candidate = index + 1;
      while (used[candidate]) candidate += 1;
      map[req.id] = candidate;
      used[candidate] = true;
      if (candidate > maxNo) maxNo = candidate;
    });

    return map;
  }

  /**
   * 将 reqId 从 oldNo 改为 newNo：只顺延区间内其他项
   * - 前移 (new < old)：[new, old) 的项 +1
   * - 后移 (new > old)：(old, new] 的项 -1
   */
  function applyDisplayNoChange(map, reqId, newNo) {
    var oldNo = parseInt(map[reqId], 10);
    newNo = parseInt(newNo, 10);
    if (isNaN(oldNo) || isNaN(newNo) || newNo < 1 || newNo === oldNo) {
      return map;
    }

    var next = {};
    Object.keys(map).forEach(function (id) {
      next[id] = map[id];
    });

    Object.keys(next).forEach(function (id) {
      if (id === reqId) return;
      var n = next[id];
      if (newNo < oldNo) {
        if (n >= newNo && n < oldNo) next[id] = n + 1;
      } else if (n > oldNo && n <= newNo) {
        next[id] = n - 1;
      }
    });
    next[reqId] = newNo;
    return next;
  }

  function clearMarkers() {
    cancelPendingClick();
    exitEdit(false);
    document.querySelectorAll(".req-marker, .req-marker-input").forEach(function (el) {
      el.remove();
    });
  }

  function cancelPendingClick() {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
  }

  function updateMarkerLabels(map) {
    numberMap = map;
    document.querySelectorAll(".req-marker").forEach(function (btn) {
      var id = btn.getAttribute("data-req-id");
      var no = map[id];
      if (!no) return;
      if (btn.classList.contains("is-editing")) return;
      btn.textContent = String(no);
      btn.setAttribute("data-req-display-no", String(no));
      var title = btn.getAttribute("data-req-title") || "";
      btn.setAttribute("aria-label", "查看需求 " + no + "：" + title);
      btn.title = id + " · " + title + "（单击查看，双击改序号）";
    });
  }

  function exitEdit(commit) {
    if (!editingMarker) return;
    var btn = editingMarker.btn;
    var input = editingMarker.input;
    var reqId = editingMarker.reqId;
    var registryId = editingMarker.registryId;
    editingMarker = null;

    var value = input ? parseInt(String(input.value).trim(), 10) : NaN;
    if (input && input.parentNode) input.remove();
    btn.classList.remove("is-editing");
    btn.hidden = false;

    if (commit && !isNaN(value) && value > 0) {
      var nextMap = applyDisplayNoChange(numberMap, reqId, value);
      saveNumberMap(registryId, nextMap);
      updateMarkerLabels(nextMap);
      return;
    }
    updateMarkerLabels(numberMap);
  }

  function startEdit(btn, req, registryId) {
    cancelPendingClick();
    if (global.RequirementFloatingCard) global.RequirementFloatingCard.hide();
    exitEdit(false);

    var currentNo = parseInt(btn.getAttribute("data-req-display-no"), 10) || 1;
    var maxNo = 1;
    Object.keys(numberMap).forEach(function (id) {
      if (numberMap[id] > maxNo) maxNo = numberMap[id];
    });

    var input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = String(Math.max(maxNo, Object.keys(numberMap).length));
    input.className = "req-marker-input";
    input.value = String(currentNo);
    input.setAttribute("aria-label", "编辑角标序号");

    btn.classList.add("is-editing");
    btn.hidden = true;
    btn.insertAdjacentElement("afterend", input);
    editingMarker = {
      btn: btn,
      input: input,
      reqId: req.id,
      registryId: registryId,
    };

    input.focus();
    input.select();

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        exitEdit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        exitEdit(false);
      }
    });
    input.addEventListener("blur", function () {
      setTimeout(function () {
        if (editingMarker && editingMarker.input === input) exitEdit(true);
      }, 0);
    });
    input.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    input.addEventListener("dblclick", function (e) {
      e.stopPropagation();
    });
  }

  function createMarker(req, displayNo, registryId) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "req-marker";
    btn.textContent = String(displayNo);
    btn.setAttribute("data-req-id", req.id);
    btn.setAttribute("data-req-anchor-ref", req.anchorId);
    btn.setAttribute("data-req-display-no", String(displayNo));
    btn.setAttribute("data-req-title", req.title || req.id);
    btn.setAttribute("data-req-version", getActiveVersion());
    btn.setAttribute("aria-label", "查看需求 " + displayNo + "：" + (req.title || req.id));
    btn.title = req.id + " · " + (req.title || "") + "（单击查看，双击改序号）";

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (btn.classList.contains("is-editing") || btn.hidden) return;
      cancelPendingClick();
      clickTimer = setTimeout(function () {
        clickTimer = null;
        if (
          global.RequirementFloatingCard &&
          global.RequirementFloatingCard.getCurrentRequirementId() === req.id
        ) {
          global.RequirementFloatingCard.hide();
          return;
        }
        global.RequirementFloatingCard.show(req, btn);
      }, 220);
    });

    btn.addEventListener("dblclick", function (e) {
      e.preventDefault();
      e.stopPropagation();
      cancelPendingClick();
      startEdit(btn, req, registryId);
    });

    return btn;
  }

  function getVisibleRequirements(registry) {
    var reqs = (registry && registry.requirements) || [];
    if (global.RequirementUtils && global.RequirementUtils.isMarkersVisible) {
      if (!global.RequirementUtils.isMarkersVisible()) return [];
    }
    if (global.RequirementUtils && global.RequirementUtils.filterRequirementsByVersion) {
      return global.RequirementUtils.filterRequirementsByVersion(reqs, registry);
    }
    return reqs;
  }

  function mountRegistryMarkers(registry) {
    if (!registry || !Array.isArray(registry.requirements)) return;

    clearMarkers();
    currentRegistryId = registry.registryId;

    var mountedReqs = [];
    getVisibleRequirements(registry).forEach(function (req) {
      var host = document.querySelector('[data-req-anchor="' + req.anchorId + '"]');
      if (!host) return;
      mountedReqs.push(req);
    });

    numberMap = resolveNumberMap(registry, mountedReqs);
    saveNumberMap(registry.registryId, numberMap);

    mountedReqs.forEach(function (req) {
      var host = document.querySelector('[data-req-anchor="' + req.anchorId + '"]');
      if (!host) return;
      var displayNo = numberMap[req.id];
      var marker = createMarker(req, displayNo, registry.registryId);
      if (host.classList.contains("req-anchor-inline")) {
        host.appendChild(marker);
      } else {
        host.classList.add("req-anchor-host");
        host.appendChild(marker);
      }
    });

    mounted = true;
  }

  function syncByRoute() {
    var hash = (location.hash || "").replace(/^#/, "");
    var registry = getRegistryForHash(hash);
    if (registry) {
      mountRegistryMarkers(registry);
    } else if (mounted) {
      clearMarkers();
      if (global.RequirementFloatingCard) global.RequirementFloatingCard.hide();
      mounted = false;
      currentRegistryId = null;
    }
  }

  function remountCurrent() {
    var hash = (location.hash || "").replace(/^#/, "");
    var registry = getRegistryForHash(hash);
    if (registry) mountRegistryMarkers(registry);
  }

  function init() {
    syncByRoute();
    window.addEventListener("hashchange", syncByRoute);
    initMarkersVisibilityToggle();
  }

  var toggleButtons = [];

  function getLayerState() {
    var utils = global.RequirementUtils || {};
    return {
      version:
        (utils.getSelectedVersion && utils.getSelectedVersion()) || "V0.8.2",
      visible: utils.isMarkersVisible ? !!utils.isMarkersVisible() : true,
    };
  }

  function applyMarkersVisibility() {
    var state = getLayerState();
    document.body.classList.toggle("req-markers-hidden", !state.visible);
    toggleButtons.forEach(function (btn) {
      var version = btn.getAttribute("data-req-version") || "V0.8.2";
      var isOn = state.visible && state.version === version;
      btn.setAttribute("aria-pressed", isOn ? "false" : "true");
      btn.textContent = isOn ? version + "隐藏角标" : version + "显示角标";
      btn.title = isOn
        ? "隐藏 " + version + " 需求角标"
        : "显示 " + version + " 需求角标（会隐藏其他版本）";
    });
    if (!state.visible && global.RequirementFloatingCard) {
      global.RequirementFloatingCard.hide();
    }
  }

  function setAnnotationLayer(version, visible) {
    if (global.RequirementUtils && global.RequirementUtils.setAnnotationLayer) {
      global.RequirementUtils.setAnnotationLayer(version, visible);
      return;
    }
    applyMarkersVisibility();
    remountCurrent();
  }

  function setMarkersVisible(next) {
    var state = getLayerState();
    setAnnotationLayer(state.version, !!next);
  }

  function toggleMarkersVisible() {
    var state = getLayerState();
    setMarkersVisible(!state.visible);
  }

  function handleVersionToggleClick(version) {
    var state = getLayerState();
    if (state.visible && state.version === version) {
      setAnnotationLayer(version, false);
      return;
    }
    setAnnotationLayer(version, true);
  }

  function collectToggleButtons() {
    var found = [];
    var group = document.getElementById("prd-markers-toggle-group");
    if (group) {
      group.querySelectorAll("[data-req-version]").forEach(function (btn) {
        found.push(btn);
      });
    }
    var legacy = document.getElementById("prd-markers-toggle");
    if (legacy && found.indexOf(legacy) < 0) {
      if (!legacy.getAttribute("data-req-version")) {
        legacy.setAttribute("data-req-version", "V0.8.2");
      }
      found.push(legacy);
    }
    return found;
  }

  function initMarkersVisibilityToggle() {
    var group = document.getElementById("prd-markers-toggle-group");
    if (group && group.parentElement !== document.body) {
      document.body.appendChild(group);
    }
    toggleButtons = collectToggleButtons();
    if (!toggleButtons.length) return;
    applyMarkersVisibility();
    toggleButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        handleVersionToggleClick(btn.getAttribute("data-req-version") || "V0.8.2");
      });
    });
    if (global.RequirementUtils && global.RequirementUtils.onAnnotationLayerChange) {
      global.RequirementUtils.onAnnotationLayerChange(function () {
        applyMarkersVisibility();
        remountCurrent();
        if (global.RequirementFloatingCard) {
          var currentId =
            global.RequirementFloatingCard.getCurrentRequirementId &&
            global.RequirementFloatingCard.getCurrentRequirementId();
          var currentReq =
            currentId &&
            global.RequirementUtils.getRequirementById &&
            global.RequirementUtils.getRequirementById(currentId);
          var state = getLayerState();
          var currentVersion =
            currentReq && global.RequirementUtils.getItemVersion
              ? global.RequirementUtils.getItemVersion(currentReq)
              : "";
          if (!state.visible || currentVersion !== state.version) {
            global.RequirementFloatingCard.hide();
          }
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.RequirementMarker = {
    remount: remountCurrent,
    clear: clearMarkers,
    setMarkersVisible: setMarkersVisible,
    toggleMarkersVisible: toggleMarkersVisible,
    setAnnotationLayer: setAnnotationLayer,
    isMarkersVisible: function () {
      return getLayerState().visible;
    },
    getVisibleVersion: function () {
      var state = getLayerState();
      return state.visible ? state.version : null;
    },
    resetOrder: function () {
      var hash = (location.hash || "").replace(/^#/, "");
      var registry = getRegistryForHash(hash);
      if (!registry) return;
      try {
        localStorage.removeItem(storageKey(registry.registryId));
        if (getActiveVersion() === "V0.8.2") {
          localStorage.removeItem(legacyUnversionedNumberKey(registry.registryId));
        }
        localStorage.removeItem(legacyOrderKey(registry.registryId));
      } catch (e) {
        /* ignore */
      }
      mountRegistryMarkers(registry);
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
