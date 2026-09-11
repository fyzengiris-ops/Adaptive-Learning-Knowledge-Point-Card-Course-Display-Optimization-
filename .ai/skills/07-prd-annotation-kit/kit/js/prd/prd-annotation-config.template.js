/**
 * 按目标项目改路由映射后，保存为 js/prd/prd-annotation-config.js
 */
(function (global) {
  global.PRD_ANNOTATION_CONFIG = {
    writebackUrl: "/__prd/writeback",
    routeRegistries: {
      // hash（不含 #）: registryId
      // home: "home",
      // section: "section-course",
    },
    resolveRegistryForHash: function (hash, getById) {
      // 同一 hash 下有多份注册表时在这里分支，否则返回 null
      return null;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
