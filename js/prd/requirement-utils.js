/**
 * 需求注册表查找与空兜底过滤
 */
(function (global) {
  var EMPTY_FALLBACKS = {
    无额外权限限制: true,
    无额外数据流转: true,
    无异常场景: true,
    本对象无操作入口: true,
    本对象仅展示: true,
    沿用页面权限: true,
    暂无: true,
    无: true,
  };

  function getRequirementRegistries() {
    return global.requirementRegistries || [];
  }

  function getRequirementById(id) {
    if (typeof global.getRequirementById === "function") {
      return global.getRequirementById(id);
    }
    var registries = getRequirementRegistries();
    for (var i = 0; i < registries.length; i += 1) {
      var list = registries[i].requirements || [];
      for (var j = 0; j < list.length; j += 1) {
        if (list[j].id === id) return list[j];
      }
    }
    return null;
  }

  var ANNOTATION_VERSIONS = ["V0.8.2", "V0.8.4"];
  var DEFAULT_ANNOTATION_VERSION = "V0.8.2";
  var VERSION_STORAGE_KEY = "req-annotation-version";
  var VISIBLE_STORAGE_KEY = "req-markers-visible";
  var selectedVersion = DEFAULT_ANNOTATION_VERSION;
  var markersVisible = true;
  var layerListeners = [];

  function normalizeVersion(version) {
    return ANNOTATION_VERSIONS.indexOf(version) >= 0 ? version : DEFAULT_ANNOTATION_VERSION;
  }

  function loadAnnotationLayer() {
    try {
      var rawVersion = localStorage.getItem(VERSION_STORAGE_KEY);
      if (rawVersion) selectedVersion = normalizeVersion(rawVersion);
      var rawVisible = localStorage.getItem(VISIBLE_STORAGE_KEY);
      if (rawVisible === "0" || rawVisible === "false") markersVisible = false;
      else if (rawVisible === "1" || rawVisible === "true") markersVisible = true;
    } catch (e) {
      /* ignore */
    }
  }

  function persistAnnotationLayer() {
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, selectedVersion);
      localStorage.setItem(VISIBLE_STORAGE_KEY, markersVisible ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
  }

  function getItemVersion(req, registry) {
    if (req && req.version) return normalizeVersion(req.version);
    if (registry && registry.version) return normalizeVersion(registry.version);
    return DEFAULT_ANNOTATION_VERSION;
  }

  function filterRequirementsByVersion(reqs, registry, version) {
    var target = normalizeVersion(version || selectedVersion);
    return (reqs || []).filter(function (req) {
      return getItemVersion(req, registry) === target;
    });
  }

  function getSelectedVersion() {
    return selectedVersion;
  }

  function isMarkersVisible() {
    return markersVisible;
  }

  function getAnnotationVersions() {
    return ANNOTATION_VERSIONS.slice();
  }

  function notifyAnnotationLayerChange() {
    var payload = {
      version: selectedVersion,
      visible: markersVisible,
    };
    layerListeners.forEach(function (fn) {
      try {
        fn(payload);
      } catch (e) {
        /* ignore listener errors */
      }
    });
  }

  function onAnnotationLayerChange(fn) {
    if (typeof fn === "function") layerListeners.push(fn);
  }

  /**
   * 设置当前注释层。
   * version: 选中的版本；visible: 该版本角标是否显示。
   * 显示某一版本时，另一版本自动隐藏。
   */
  function setAnnotationLayer(version, visible) {
    selectedVersion = normalizeVersion(version);
    markersVisible = !!visible;
    persistAnnotationLayer();
    notifyAnnotationLayerChange();
    return {
      version: selectedVersion,
      visible: markersVisible,
    };
  }

  function getRequirementByAnchor(anchorId) {
    var registries = getRequirementRegistries();
    for (var i = 0; i < registries.length; i += 1) {
      var registry = registries[i];
      var list = registry.requirements || [];
      for (var j = 0; j < list.length; j += 1) {
        if (list[j].anchorId !== anchorId) continue;
        if (getItemVersion(list[j], registry) === selectedVersion) return list[j];
      }
    }
    return null;
  }

  function getRegistryById(registryId) {
    if (!registryId) return null;
    if (typeof global.getRequirementRegistry === "function") {
      return global.getRequirementRegistry(registryId);
    }
    var registries = getRequirementRegistries();
    for (var i = 0; i < registries.length; i += 1) {
      if (registries[i].registryId === registryId) return registries[i];
    }
    return null;
  }

  function getHash() {
    return (location.hash || "").replace(/^#/, "");
  }

  function getRegistryForHash(hash) {
    hash = hash == null ? getHash() : hash;
    var cfg = global.PRD_ANNOTATION_CONFIG || {};
    if (typeof cfg.resolveRegistryForHash === "function") {
      var resolved = cfg.resolveRegistryForHash(hash, getRegistryById);
      if (resolved) return resolved;
    }
    var map = cfg.routeRegistries || {};
    return getRegistryById(map[hash] || "") || null;
  }

  function isEmptyFallback(text) {
    if (text == null) return true;
    var value = String(text).trim();
    if (!value) return true;
    return !!EMPTY_FALLBACKS[value];
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * 将「【x.x需求评审后补充】」前缀渲染为橙色标签，其余正文转义后原样输出
   */
  function formatLogicItemHtml(text) {
    var raw = String(text == null ? "" : text);
    var match = raw.match(/^(【\d{1,2}\.\d{1,2}需求评审后补充】)\s*/);
    var body = match ? raw.slice(match[0].length) : raw;
    var html = escapeHtml(body).replace(/\n/g, "<br>");
    if (!match) return html;
    return (
      '<span class="req-review-tag">' +
      escapeHtml(match[1]) +
      "</span>" +
      html
    );
  }

  /**
   * 过滤后供展示的 logicSections（不改写原数据）
   */
  function getVisibleLogicSections(requirement) {
    if (!requirement || !Array.isArray(requirement.logicSections)) return [];
    return requirement.logicSections
      .map(function (section) {
        var items = (section.items || []).filter(function (item) {
          return !isEmptyFallback(item);
        });
        return {
          title: section.title,
          items: items,
        };
      })
      .filter(function (section) {
        return section.title && section.items.length > 0;
      });
  }

  loadAnnotationLayer();

  global.RequirementUtils = {
    getRequirementRegistries: getRequirementRegistries,
    getRequirementById: getRequirementById,
    getRequirementByAnchor: getRequirementByAnchor,
    getRegistryById: getRegistryById,
    getRegistryForHash: getRegistryForHash,
    isEmptyFallback: isEmptyFallback,
    escapeHtml: escapeHtml,
    formatLogicItemHtml: formatLogicItemHtml,
    getVisibleLogicSections: getVisibleLogicSections,
    DEFAULT_ANNOTATION_VERSION: DEFAULT_ANNOTATION_VERSION,
    getAnnotationVersions: getAnnotationVersions,
    getItemVersion: getItemVersion,
    filterRequirementsByVersion: filterRequirementsByVersion,
    getSelectedVersion: getSelectedVersion,
    isMarkersVisible: isMarkersVisible,
    setAnnotationLayer: setAnnotationLayer,
    onAnnotationLayerChange: onAnnotationLayerChange,
  };
})(typeof window !== "undefined" ? window : globalThis);
