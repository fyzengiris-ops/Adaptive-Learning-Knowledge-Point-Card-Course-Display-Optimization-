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

  function getRequirementByAnchor(anchorId) {
    var registries = getRequirementRegistries();
    for (var i = 0; i < registries.length; i += 1) {
      var list = registries[i].requirements || [];
      for (var j = 0; j < list.length; j += 1) {
        if (list[j].anchorId === anchorId) return list[j];
      }
    }
    return null;
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
    if (!match) return escapeHtml(raw);
    return (
      '<span class="req-review-tag">' +
      escapeHtml(match[1]) +
      "</span>" +
      escapeHtml(raw.slice(match[0].length))
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

  global.RequirementUtils = {
    getRequirementRegistries: getRequirementRegistries,
    getRequirementById: getRequirementById,
    getRequirementByAnchor: getRequirementByAnchor,
    isEmptyFallback: isEmptyFallback,
    escapeHtml: escapeHtml,
    formatLogicItemHtml: formatLogicItemHtml,
    getVisibleLogicSections: getVisibleLogicSections,
  };
})(typeof window !== "undefined" ? window : globalThis);
