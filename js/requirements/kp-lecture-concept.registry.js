/**
 * 知识点精讲·核心概念页 需求注册表
 * 覆盖 Skill0 全量对象清单（含可跳过项）；Skill1 已确认口径优先。
 */
(function (global) {
  const kpLectureConceptRegistry = {
    registryId: "kp-lecture-concept",
    pageName: "知识点精讲·核心概念页",
    route: "#kp-lecture",
    module: "专项学习·知识点精讲",
    description:
      "知识点精讲卡片第 1 页（核心概念）：知识点名称、学业要求/考察频率、页签与引导、要点与配图、公式定理、底部分页切换；含壳层演示开关、视频 Tab 等。返回/页脚笔记/去测试本期不挂角标。考点清单页不在本期。",
    sourceDecisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
      "docs/prd-workflow/inventories/kp-lecture-concept.inventory.md",
      "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
    ],
    requirements: [
      {
        id: "KP_LECTURE_CONCEPT-001",
        title: "知识点名称",
        sourceType: "code",
        objectType: "copy",
        objectName: "知识点名称",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.name",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位知识点名称", anchorId: "kp-lecture.concept.name" },
          { type: "highlight", label: "高亮知识点名称", anchorId: "kp-lecture.concept.name" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "卡片顶部展示当前知识点名称。",
              "学生能进入本页时，知识点名称一定存在并展示，不出现缺省占位。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "知识点名称由教研老师在配置后台配置，随当前知识点下发到学生端。",
            ],
          },
        ],
        acceptance: [
          "进入精讲页可见知识点名称。",
          "名称与当前进入的知识点一致。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/inventories/kp-lecture-concept.inventory.md",
          decisionObject: "知识点名称",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-002",
        title: "学业要求",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "学业要求",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.ability",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位学业要求", anchorId: "kp-lecture.concept.ability" },
          { type: "highlight", label: "高亮学业要求", anchorId: "kp-lecture.concept.ability" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "知识点名称旁以印章形式展示学业要求短文案。",
              "该字段非必配；未配置时不展示印章。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "学业要求为封闭枚举：了解 / 理解 / 掌握 / 运用（可按现网微调，但仍为封闭枚举）。",
              "具体展示标签由配置后台下发，学生端按后台返回值展示。",
            ],
          },
        ],
        acceptance: [
          "已配置学业要求时，标题旁可见对应印章文案。",
          "未配置学业要求时，不展示该印章。",
          "展示文案与后台为该知识点配置的学业要求一致。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "学业要求",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-003",
        title: "考察频率",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "考察频率",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.frequency",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位考察频率", anchorId: "kp-lecture.concept.frequency" },
          { type: "highlight", label: "高亮考察频率", anchorId: "kp-lecture.concept.frequency" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "知识点名称旁以印章形式展示考察频率短文案。",
              "该字段非必配；未配置时不展示印章。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "考察频率为封闭枚举：高频 / 中频 / 低频。",
              "具体展示标签由配置后台下发，学生端按后台返回值展示。",
            ],
          },
        ],
        acceptance: [
          "已配置考察频率时，标题旁可见对应印章文案。",
          "未配置考察频率时，不展示该印章。",
          "展示文案与后台为该知识点配置的考察频率一致。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "考察频率",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-004",
        title: "核心概念页签",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "核心概念页签",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.page-title",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位核心概念页签", anchorId: "kp-lecture.concept.page-title" },
          { type: "highlight", label: "高亮核心概念页签", anchorId: "kp-lecture.concept.page-title" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "核心概念页居中展示页签文案「核心概念」。",
              "该文案为产品固定文案，后台不可配，学生端不可改。",
            ],
          },
        ],
        acceptance: [
          "核心概念页可见固定文案「核心概念」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "核心概念页签",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-005",
        title: "进入考点页的引导文案",
        sourceType: "code",
        objectType: "copy",
        objectName: "进入考点页的引导文案",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.hint",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位引导文案", anchorId: "kp-lecture.concept.hint" },
          { type: "highlight", label: "高亮引导文案", anchorId: "kp-lecture.concept.hint" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "核心概念页在页签附近展示固定引导文案，提示学生可进入考点清单页。",
              "引导文案为固定展示信息，后台不可配。",
              "引导口径与正式切换方式一致：引导使用底部分页圆点或底栏箭头，不引导手势左右滑。",
            ],
          },
        ],
        acceptance: [
          "核心概念页可见固定引导文案。",
          "引导不暗示支持手势左右滑切换。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/inventories/kp-lecture-concept.inventory.md",
          decisionObject: "进入考点页的引导文案",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-006",
        title: "要点模块",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "要点模块",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.points",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位要点模块", anchorId: "kp-lecture.concept.points" },
          { type: "highlight", label: "高亮要点模块", anchorId: "kp-lecture.concept.points" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "有要点时，以带「要点」标识的单容器展示多条编号要点，编号按后台配置顺序从 1 起排。",
              "允许配置 0 条要点；无要点时整块「要点」模块不渲染，不展示空容器。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "要点列表由教研在配置后台配置后下发。",
            ],
          },
          {
            title: "展示顺序",
            items: [
              "学生端按后台配置的要点顺序展示，不在学生端重排。",
            ],
          },
        ],
        acceptance: [
          "有要点时可见带编号的要点容器。",
          "无要点时页面不出现空的要点容器。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "要点模块",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-007",
        title: "单条要点正文",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "单条要点正文",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.point-text",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位要点正文", anchorId: "kp-lecture.concept.point-text" },
          { type: "highlight", label: "高亮要点正文", anchorId: "kp-lecture.concept.point-text" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "每条要点展示后台配置的正文内容，支持较长文案换行阅读。",
              "本页不提供富文本编辑能力。",
              "学生端按乐课网现有富文本编辑能力所能产出的效果做渲染展示。",
            ],
          },
          {
            title: "数据边界",
            items: [
              "正文内容在配置后台完成编辑；学生端只负责按乐课网富文本能力集渲染，不在本页二次编辑。",
            ],
          },
        ],
        acceptance: [
          "要点正文按后台配置展示。",
          "乐课网富文本能力范围内的效果可在学生端正确呈现。",
          "学生端本页无编辑入口。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "单条要点正文",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-008",
        title: "要点配图",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "要点配图",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.images",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位要点配图", anchorId: "kp-lecture.concept.images" },
          { type: "highlight", label: "高亮要点配图", anchorId: "kp-lecture.concept.images" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "配图挂在单条要点下展示。",
              "允许单条要点配置并展示多张图片。",
              "多图呈现效果与后台配置一致：可按配置换行多图，也可单行展示多张图片。",
              "该条要点无图时不占位。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "学生可点击图片进入放大预览。",
              "在预览层点击关闭或点击遮罩可退出预览，回到核心概念页原位置。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "图片及多图排布由教研在配置后台配置，学生端按配置结果展示。",
            ],
          },
        ],
        acceptance: [
          "有多图配置的要点可按后台排布展示多张图。",
          "无图要点不出现空白图位。",
          "点击图片可放大，关闭后回到原页。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "要点配图",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-009",
        title: "公式定理模块",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "公式定理模块",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.formulas",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位公式定理", anchorId: "kp-lecture.concept.formulas" },
          { type: "highlight", label: "高亮公式定理", anchorId: "kp-lecture.concept.formulas" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "未配置任何公式时，整块「公式定理」模块不展示。",
              "已配置时按后台顺序全部展示。",
              "模块左上角展示标签：仅 1 条时为「公式定理」；多条时为「公式定理 · N 条」（N 为当前公式条数）。",
              "每条按「名称：内容」单行呈现；名称为空时只展示内容。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "公式定理列表由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "无公式配置时页面不出现公式定理空模块。",
          "有多条公式时全部按顺序展示，且为「名称：内容」单行形态。",
          "多条时左上角标签可见「公式定理 · N 条」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "公式定理模块",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-010",
        title: "切换到考点清单",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "底部分页切换到考点",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.concept.pager",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到核心概念页", step: "0" },
          { type: "scrollTo", label: "定位底部分页", anchorId: "kp-lecture.concept.pager" },
          { type: "highlight", label: "高亮底部分页", anchorId: "kp-lecture.concept.pager" },
        ],
        logicSections: [
          {
            title: "操作说明",
            items: [
              "学生可通过底部分页圆点，或底栏左右箭头，从核心概念页切换到考点清单页。",
              "从考点清单页可通过同样方式返回核心概念页。",
              "不支持手势左右滑切换，避免与页内纵向滚动冲突。",
            ],
          },
          {
            title: "显示说明",
            items: [
              "底部分页指示当前处于核心概念页或考点页。",
              "在核心概念页时，「上一页」不可用；切到考点页后「下一页」不可用。",
            ],
          },
        ],
        acceptance: [
          "点击分页圆点或箭头可进入考点清单页。",
          "手势左右滑不会切换页面。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "左右滑切换到考点",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-011",
        title: "演示多考点/单考点开关",
        sourceType: "code",
        objectType: "button",
        objectName: "演示多考点/单考点开关",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.demo.mode",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "scrollTo", label: "定位演示开关", anchorId: "kp-lecture.demo.mode" },
          { type: "highlight", label: "高亮演示开关", anchorId: "kp-lecture.demo.mode" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "顶栏右侧展示「多考点 / 单考点」演示开关，用于原型评审对照两种形态。",
            ],
          },
          {
            title: "数据边界",
            items: [
              "该开关仅为评审演示，不属于学生正式产品能力；正式环境不向学生提供此切换。",
            ],
          },
        ],
        acceptance: [
          "原型顶栏可见演示开关。",
          "需求说明中明确其为演示用途、非正式学生能力。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/inventories/kp-lecture-concept.inventory.md",
          decisionObject: "顶栏演示多考点/单考点开关",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_CONCEPT-012",
        title: "知识点视频 Tab",
        sourceType: "code+decision",
        objectType: "tab",
        objectName: "知识点视频 Tab",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·核心概念页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.tab.video",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setTab", label: "切换到知识点视频", tab: "lecture-video" },
          { type: "scrollTo", label: "定位视频 Tab", anchorId: "kp-lecture.tab.video" },
          { type: "highlight", label: "高亮视频 Tab", anchorId: "kp-lecture.tab.video" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "顶栏在「知识点精讲」旁提供「知识点视频」Tab。",
              "配置后台已配置该知识点的视频信息时，展示「知识点视频」Tab；未配置视频信息时，不展示该 Tab。",
              "仅配置了视频、未配置知识点精讲时，「知识点精讲」Tab/模块暂不展示，仅展示视频相关内容。",
              "有精讲内容可进入本页时，默认落在「知识点精讲」Tab。",
            ],
          },
          {
            title: "异常边界",
            items: [
              "当视频与知识点精讲均未配置时，用户点击「知识点学习」不进入精讲页，弹窗提示：「正在更新中，先去学习其他知识点吧~」。",
            ],
          },
        ],
        acceptance: [
          "未配置视频时，顶栏不出现「知识点视频」Tab。",
          "仅有视频、无精讲时，不展示「知识点精讲」Tab/模块。",
          "已配置视频且有精讲时，可见「知识点视频」Tab，且默认仍落在知识点精讲。",
          "精讲与视频皆未配置时，点击知识点学习弹出「正在更新中，先去学习其他知识点吧~」，且不进入精讲页。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
          decisionObject: "知识点视频 Tab",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
    ],
    excludedDecisions: [
      {
        decisionObject: "返回",
        reason: "返回专项学习中心已在既往迭代实现并审过，本期核心概念角标核对不再挂标。",
      },
      {
        decisionObject: "查看笔记",
        reason: "本期角标核对去掉页脚笔记入口；壳层保留按钮，细则后续单独确认。",
      },
      {
        decisionObject: "去测试",
        reason: "本期角标核对去掉页脚去测试入口；壳层保留按钮，细则后续单独确认。",
      },
      {
        decisionObject: "考点清单页及例题/解析/好题本",
        reason: "Skill0 明确后续单独开清单与审核，不在核心概念页注册表展开。",
      },
    ],
  };

  global.kpLectureConceptRegistry = kpLectureConceptRegistry;
})(typeof window !== "undefined" ? window : globalThis);
