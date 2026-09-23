/**
 * 精选卷·章节维度 需求注册表
 */
(function (global) {
  const featuredPapersRegistry = {
    registryId: "featured-papers",
    pageName: "精选卷·章节页",
    route: "#papers",
    module: "精选卷",
    version: "V0.8.2",
    description:
      "首页选中章节后进入的精选卷：按专题课、拓展课分类展示试卷。本期先落 V0.8.4 专题课模块口径。",
    sourceDecisionFile: "",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
    ],
    requirements: [
      {
        id: "FEATURED_PAPERS-001",
        title: "专题课试卷模块",
        sourceType: "decision",
        objectType: "tab",
        objectName: "专题课",
        module: "精选卷·章节",
        pageName: "精选卷·章节页",
        route: "#papers",
        version: "V0.8.4",
        anchorId: "papers.chapter.topic",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入精选卷", to: "#papers" },
          { type: "setTab", label: "切换到专题课", tab: "sync" },
          { type: "scrollTo", label: "定位专题课", anchorId: "papers.chapter.topic" },
          { type: "highlight", label: "高亮专题课", anchorId: "papers.chapter.topic" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "章节维度的精选卷页面，分专题课、拓展课两类分别展示试卷。",
              "两类模块里，右侧筛选按钮的可选项，和小节模块保持一致。",
              "试卷的展示字段和小节模块保持一致。",
              "两类模块里试卷操作按钮的显示和状态，均和小节模块保持一致。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "需要从配置后台获取的字段，和小节模块保持一致。",
              "具体获取字段的位置为：配置后台-教材体系知识树-章节-课程-试卷名称/缩略图/题量/预计用时/满分。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "两类模块里试卷操作按钮的逻辑，均和小节模块保持一致。",
            ],
          },
        ],
        acceptance: [
          "章节精选卷按专题课、拓展课两类分别展示试卷。",
          "两类模块的筛选项、展示字段、后台取值字段，以及操作按钮的显示、状态和逻辑，均与小节模块一致。",
          "后台取值路径为配置后台-教材体系知识树-章节-课程下的试卷名称、缩略图、题量、预计用时、满分。",
        ],
        source: {
          decisionFile: "",
          decisionObject: "章节精选卷·专题课（V0.8.4）",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
    ],
    excludedDecisions: [],
  };

  global.featuredPapersRegistry = featuredPapersRegistry;
})(typeof window !== "undefined" ? window : globalThis);
