/**
 * 题目练习·练习结果 需求注册表
 */
(function (global) {
  const practiceResultRegistry = {
    registryId: "practice-result",
    pageName: "题目练习·练习结果",
    route: "#practice",
    module: "专项学习中心",
    version: "V0.8.2",
    description:
      "首页知识点进入专项学习中心后，题目练习提交结果弹窗的掌握度展示与说明。",
    sourceDecisionFile: "",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
    ],
    requirements: [
      {
        id: "PRACTICE_RESULT-001",
        title: "掌握度说明",
        sourceType: "decision",
        objectType: "field",
        objectName: "掌握度说明",
        module: "专项学习中心·题目练习",
        pageName: "题目练习·练习结果",
        route: "#practice",
        version: "V0.8.4",
        anchorId: "practice.result.mastery.tip",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入题目练习", to: "#practice" },
          { type: "openDialog", label: "打开练习结果", dialog: "practice-result" },
          { type: "scrollTo", label: "定位掌握度说明", anchorId: "practice.result.mastery.tip" },
          { type: "highlight", label: "高亮掌握度说明", anchorId: "practice.result.mastery.tip" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "练习结果弹窗展示当前知识点名称，以及该知识点的掌握度等级。",
              "掌握度以等级标签展示。",
              "掌握度计算说明默认不常显，仅在掌握度旁展示说明图标。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "点击说明图标后，以气泡展示掌握度计算说明。",
              "再次点击说明图标，或点击气泡以外区域，收起说明气泡。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "当前掌握度等级纳入作业系统中同知识点同时刻完成批改的练习结果，并非仅依据本次提交题目计算。",
              "学生在本系统完成本次练习并提交时，若作业系统中同知识点题目恰好完成批改，上述题目一并纳入本次掌握度增量计算。",
            ],
          },
        ],
        acceptance: [
          "练习结果中掌握度以等级标签展示，说明图标默认不展开文案。",
          "点击说明图标可见气泡说明，再次点击或点击空白处收起。",
          "说明口径为：掌握度已纳入作业系统同知识点近期完成批改的练习，而非仅依据本次提交题目。",
        ],
        source: {
          decisionFile: "",
          decisionObject: "练习结果·掌握度说明（V0.8.4）",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
    ],
    excludedDecisions: [],
  };

  global.practiceResultRegistry = practiceResultRegistry;
})(typeof window !== "undefined" ? window : globalThis);
