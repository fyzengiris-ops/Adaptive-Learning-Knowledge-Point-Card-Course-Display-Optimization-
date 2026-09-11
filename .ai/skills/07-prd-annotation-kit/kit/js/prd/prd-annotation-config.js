/**
 * 需求注释运行时配置（按项目填写）
 * 其他项目复制 kit 后，改 routeRegistries / resolveRegistryForHash 即可。
 */
(function (global) {
  global.PRD_ANNOTATION_CONFIG = {
    writebackUrl: "/__prd/writeback",
    routeRegistries: {
      section: "section-course",
      chapter: "chapter-course",
      "kp-lecture": "kp-lecture-concept",
    },
    resolveRegistryForHash: function (hash, getById) {
      if (hash === "kp-lecture") {
        var slider = document.querySelector("#kp-card-root .kp-slider");
        var page = slider ? String(slider.getAttribute("data-page") || "0") : "0";
        return getById(page === "1" ? "kp-lecture-exam" : "kp-lecture-concept");
      }
      return null;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
