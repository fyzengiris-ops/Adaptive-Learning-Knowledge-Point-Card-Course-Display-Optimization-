/**
 * 需求注册表统一出口模板
 * 复制后按实际 window.xxxRegistry 增删 push。
 */
(function (global) {
  const registries = [];

  // if (global.sectionCourseRegistry) registries.push(global.sectionCourseRegistry);
  // if (global.chapterCourseRegistry) registries.push(global.chapterCourseRegistry);

  global.requirementRegistries = registries;

  global.getRequirementRegistry = function getRequirementRegistry(registryId) {
    return (global.requirementRegistries || []).find(function (item) {
      return item.registryId === registryId;
    }) || null;
  };

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
