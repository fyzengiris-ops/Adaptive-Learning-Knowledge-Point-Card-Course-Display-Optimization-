/**
 * 知识点精讲·考点清单页 需求注册表
 * 覆盖 Skill0 必审对象；Skill1 已确认口径优先。
 */
(function (global) {
  const kpLectureExamRegistry = {
    registryId: "kp-lecture-exam",
    pageName: "知识点精讲·考点清单页",
    route: "#kp-lecture",
    module: "专项学习·知识点精讲",
    description:
      "知识点精讲卡片第 2 页（考点清单）：页签与引导、考点列表与展开、考点说明、典型例题、解析与解题步骤/要点、好题本及反馈。正式产品以多考点为主；演示开关与壳层入口不在本期。",
    sourceDecisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
      "docs/prd-workflow/inventories/kp-lecture-exam.inventory.md",
      "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
    ],
    requirements: [
      {
        id: "KP_LECTURE_EXAM-001",
        title: "考点清单页签",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "考点清单页签",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.page-title",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点清单页签", anchorId: "kp-lecture.exam.page-title" },
          { type: "highlight", label: "高亮考点清单页签", anchorId: "kp-lecture.exam.page-title" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "本页居中展示页签文案，随当前知识点下发的考点条数切换。",
              "考点条数 ≥ 2 时展示「考点清单」；仅 1 条时展示「考点」。",
              "该文案为产品规则文案，后台不可配、学生端不可改。",
            ],
          },
        ],
        acceptance: [
          "有 2 条及以上考点时，页签为「考点清单」。",
          "仅 1 条考点时，页签为「考点」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点清单页签",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-002",
        title: "本页引导文案",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "本页引导文案",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.hint",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位本页引导文案", anchorId: "kp-lecture.exam.hint" },
          { type: "highlight", label: "高亮本页引导文案", anchorId: "kp-lecture.exam.hint" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "页签旁展示固定引导文案，随页签形态切换。",
              "页签为「考点清单」时展示：「点击考点查看例题 · 右滑查看概念」。",
              "页签为「考点」时展示：「右滑查看核心概念」。",
              "引导文案为固定展示信息，后台不可配。",
            ],
          },
        ],
        acceptance: [
          "页签为「考点清单」时可见「点击考点查看例题 · 右滑查看概念」。",
          "页签为「考点」时可见「右滑查看核心概念」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "本页引导文案",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-003",
        title: "考点列表区域",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "考点列表区域",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.list",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点列表", anchorId: "kp-lecture.exam.list" },
          { type: "highlight", label: "高亮考点列表", anchorId: "kp-lecture.exam.list" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "有考点时，按后台配置顺序以考点卡片列表展示。",
              "允许配置 0 条考点；进入本页且无考点时，展示空态文案「暂无考点，先去学习其他内容吧~」，不展示空列表容器。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "考点列表由教研在配置后台配置后随当前知识点下发。",
            ],
          },
          {
            title: "展示顺序",
            items: [
              "学生端按后台配置的考点顺序展示，不在学生端重排。",
            ],
          },
        ],
        acceptance: [
          "有考点时可见按序排列的考点卡片列表。",
          "无考点时可见空态文案「暂无考点，先去学习其他内容吧~」，且无空列表容器。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点列表区域",
          relatedFiles: ["js/app.js", "css/app.css"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-004",
        title: "考点序号徽章",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "考点序号徽章",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.badge",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点序号徽章", anchorId: "kp-lecture.exam.badge" },
          { type: "highlight", label: "高亮考点序号徽章", anchorId: "kp-lecture.exam.badge" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "每张考点卡片上沿展示序号徽章，文案为「考点」+ 序号数字。",
              "序号按配置后台配置的考点顺序从 1 起依次生成并展示（第 1 条为「考点1」，其后递增）。",
              "序号与后台考点名称是否自带「考点N」无关，不以名称内编号为准。",
            ],
          },
          {
            title: "展示顺序",
            items: [
              "徽章序号与后台下发的考点排列顺序一致，学生端不另行重排。",
            ],
          },
        ],
        acceptance: [
          "徽章序号与配置后台考点顺序一致：第 1 条为「考点1」，其后依次递增。",
          "后台名称含「考点N」时，徽章仍按下发顺序生成，不以名称内编号为准。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点序号徽章",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-005",
        title: "考点名称",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "考点名称",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.name",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点名称", anchorId: "kp-lecture.exam.name" },
          { type: "highlight", label: "高亮考点名称", anchorId: "kp-lecture.exam.name" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "考点卡片标题区展示该考点名称。",
              "展示后台配置的考点名称原文，不做「考点N：」等前缀清洗。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "考点名称由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "标题展示与后台配置的考点名称原文一致。",
          "名称前带「考点1：」等前缀时，学生端仍完整展示，不自动去掉。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点名称",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-006",
        title: "考点展开/收起",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "考点展开/收起",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.expand",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点展开入口", anchorId: "kp-lecture.exam.expand" },
          { type: "highlight", label: "高亮考点展开入口", anchorId: "kp-lecture.exam.expand" },
        ],
        logicSections: [
          {
            title: "操作说明",
            items: [
              "点击考点卡片标题区域，展开或收起该考点的说明与例题内容。",
              "允许同时展开多个考点；各考点展开/收起状态彼此独立。",
              "再点已展开考点的标题，则收起该考点。",
            ],
          },
          {
            title: "状态规则",
            items: [
              "进入本页时默认全部收起。",
              "仅有 1 个考点时，也默认收起，不自动展开。",
            ],
          },
        ],
        acceptance: [
          "进入本页（含仅 1 个考点）时，所有考点默认收起。",
          "可同时展开多个考点；收起其中一个不影响其他已展开考点。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点展开/收起",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-007",
        title: "考点说明",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "考点说明",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.direction",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位考点说明", anchorId: "kp-lecture.exam.direction" },
          { type: "highlight", label: "高亮考点说明", anchorId: "kp-lecture.exam.direction" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "考点展开后，若已配置考点说明，展示「考点说明：」及正文。",
              "考点说明非必配；未配置时不展示该整块。",
              "本页不提供编辑能力；正文按乐课网现有富文本能力集渲染。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "考点说明由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "已配置说明的考点展开后可见「考点说明」整块。",
          "未配置说明时，展开后不出现「考点说明」空块。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "考点说明",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-008",
        title: "「典型例题」标签",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "「典型例题」标签",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.example-badge",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位典型例题标签", anchorId: "kp-lecture.exam.example-badge" },
          { type: "highlight", label: "高亮典型例题标签", anchorId: "kp-lecture.exam.example-badge" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "考点展开后的例题区展示固定标签文案「典型例题」。",
              "该文案后台不可配、学生端不可改。",
              "本期一考点仅支持 1 道典型例题。",
            ],
          },
        ],
        acceptance: [
          "有典型例题的考点展开后可见「典型例题」标签。",
          "一考点仅展示 1 道典型例题。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "「典型例题」标签",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-009",
        title: "例题题干",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "例题题干",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.stem",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位例题题干", anchorId: "kp-lecture.exam.stem" },
          { type: "highlight", label: "高亮例题题干", anchorId: "kp-lecture.exam.stem" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "「典型例题」标签下方展示例题题干。",
              "有典型例题时题干必有，不做题干空占位。",
              "本页不提供编辑能力；题干按乐课网现有富文本能力集渲染。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "例题题干由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "展开有例题的考点后可见题干内容。",
          "题干展示效果符合乐课网富文本能力集，且无空题干占位。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "例题题干",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-010",
        title: "查看/收起解析",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "查看/收起解析",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.analysis",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位解析按钮", anchorId: "kp-lecture.exam.analysis" },
          { type: "highlight", label: "高亮解析按钮", anchorId: "kp-lecture.exam.analysis" },
        ],
        logicSections: [
          {
            title: "操作说明",
            items: [
              "例题区提供「解析」开关：点击展开解析内容，再点收起。",
              "展开某考点不会自动展开其解析；考点展开/收起与解析展开/收起互不联动。",
              "各考点的解析展开/收起状态彼此独立，互不影响。",
            ],
          },
          {
            title: "状态规则",
            items: [
              "解析默认收起。",
              "重新进入本页时，各考点解析均恢复为收起。",
            ],
          },
        ],
        acceptance: [
          "进入本页后解析默认收起。",
          "展开考点后解析仍保持收起，需再点「解析」才展开。",
          "一个考点展开解析不影响其他考点的解析状态；离开再进入本页后解析均收起。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "查看/收起解析",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-011",
        title: "解题步骤",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "解题步骤",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.steps",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位解题步骤", anchorId: "kp-lecture.exam.steps" },
          { type: "highlight", label: "高亮解题步骤", anchorId: "kp-lecture.exam.steps" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "解析展开后固定展示「解题步骤」模块。",
              "后台已配置步骤时，按后台顺序展示分步内容（可含步骤说明与详述）。",
              "后台未配置步骤时，模块仍展示，并显示固定提示文案「更新中~」。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "解题步骤由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "解析展开后始终可见「解题步骤」模块。",
          "未配置步骤时，模块内可见「更新中~」。",
          "已配置步骤时按后台顺序完整展示。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "解题步骤",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-012",
        title: "解题要点",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "解题要点",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.keypoints",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位解题要点", anchorId: "kp-lecture.exam.keypoints" },
          { type: "highlight", label: "高亮解题要点", anchorId: "kp-lecture.exam.keypoints" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "解析内可展示「解题要点」列表。",
              "解题要点非必配；0 条时不展示该整块。",
              "有要点时按后台配置顺序全部展示。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "解题要点由教研在配置后台配置后下发。",
            ],
          },
        ],
        acceptance: [
          "有要点时，解析展开后可见按序排列的「解题要点」。",
          "无要点时不出现「解题要点」空块。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "解题要点",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-013",
        title: "加入/移出好题本",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "加入/移出好题本",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.favorite",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位好题本入口", anchorId: "kp-lecture.exam.favorite" },
          { type: "highlight", label: "高亮好题本入口", anchorId: "kp-lecture.exam.favorite" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "例题区提供双入口：典型例题标签内的星标，以及解析底栏「加入好题本 / 移出好题本」按钮。",
              "未加入时底栏文案为「加入好题本」；已加入时为「移出好题本」，星标同步呈现已加入样式。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "点击任一入口均可加入或移出当前典型例题的好题本收藏。",
              "双入口状态始终同步：操作其中一个后，星标与底栏文案同时切换。",
            ],
          },
        ],
        acceptance: [
          "可见星标与底栏好题本按钮两个入口。",
          "点击任一入口后，另一入口状态同步变化。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "加入/移出好题本",
          relatedFiles: ["js/app.js"],
        },
      },
      {
        id: "KP_LECTURE_EXAM-014",
        title: "好题本操作反馈",
        sourceType: "code+decision",
        objectType: "state",
        objectName: "好题本操作反馈",
        module: "专项学习·知识点精讲",
        pageName: "知识点精讲·考点清单页",
        route: "#kp-lecture",
        anchorId: "kp-lecture.exam.favorite-toast",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入知识点精讲", to: "#kp-lecture" },
          { type: "setStep", label: "定位到考点清单页", step: "1" },
          { type: "scrollTo", label: "定位好题本反馈", anchorId: "kp-lecture.exam.favorite-toast" },
          { type: "highlight", label: "高亮好题本反馈", anchorId: "kp-lecture.exam.favorite-toast" },
        ],
        logicSections: [
          {
            title: "状态规则",
            items: [
              "加入好题本成功后，以 toast 提示「已加入好题本」。",
              "移出好题本成功后，以 toast 提示「已移除好题本」。",
            ],
          },
        ],
        acceptance: [
          "加入成功可见 toast「已加入好题本」。",
          "移除成功可见 toast「已移除好题本」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/kp-lecture-exam.decision.md",
          decisionObject: "好题本操作反馈",
          relatedFiles: ["js/app.js"],
        },
      },
    ],
    excludedDecisions: [
      {
        objectName: "单考点形态",
        reason: "仅评审演示对照，非正式产品主形态；正式口径按考点条数切换页签，不单独展开单考点演示决策。",
        sourceDecision: "docs/prd-workflow/inventories/kp-lecture-exam.inventory.md",
      },
      {
        objectName: "知识点名称与印章",
        reason: "已在核心概念页决策并注册，本期考点清单不重复挂卡。",
        sourceDecision: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
      },
      {
        objectName: "底部分页回到核心概念",
        reason: "切换方式已在核心概念页决策（圆点/箭头，无手势滑），本期不重复挂卡。",
        sourceDecision: "docs/prd-workflow/decisions/kp-lecture-concept.decision.md",
      },
      {
        objectName: "顶栏演示多/单考点开关",
        reason: "仅评审演示，非正式学生能力。",
        sourceDecision: "docs/prd-workflow/inventories/kp-lecture-exam.inventory.md",
      },
      {
        objectName: "返回 / 笔记 / 去测试",
        reason: "壳层入口，既往迭代或本期不挂审。",
        sourceDecision: "docs/prd-workflow/inventories/kp-lecture-exam.inventory.md",
      },
    ],
  };

  global.kpLectureExamRegistry = kpLectureExamRegistry;
})(typeof window !== "undefined" ? window : globalThis);
