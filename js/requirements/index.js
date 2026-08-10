/**
 * 需求注册表统一出口
 * 供角标、悬浮面板、右侧 PRD 面板读取。
 */
(function (global) {
  const registries = [];

  if (global.sectionCourseRegistry) {
    registries.push(global.sectionCourseRegistry);
  }

  global.requirementRegistries = registries;

  /**
   * @param {string} registryId
   */
  global.getRequirementRegistry = function getRequirementRegistry(registryId) {
    return (global.requirementRegistries || []).find(function (item) {
      return item.registryId === registryId;
    }) || null;
  };

  /**
   * @param {string} requirementId
   */
  global.getRequirementById = function getRequirementById(requirementId) {
    var list = global.requirementRegistries || [];
    for (var i = 0; i < list.length; i += 1) {
      var found = (list[i].requirements || []).find(function (req) {
        return req.id === requirementId;
      });
      if (found) return found;
    }
    return null;
  };
})(typeof window !== "undefined" ? window : globalThis);
