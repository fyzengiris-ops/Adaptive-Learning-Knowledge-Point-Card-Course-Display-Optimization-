/**
 * 课程中心·章节页 需求注册表（决策单元粒度）
 */
(function (global) {
  const chapterCourseRegistry = {
    registryId: "chapter-course",
    pageName: "课程中心·章节页",
    route: "#chapter",
    module: "课程中心",
    description:
      "按决策单元拆分的章节课型需求：顶栏章节范围、同步/专题/拓展课型联动、课程与试卷区、三态试卷状态、筛选维度与分区空结果、列表滚动。校本课与返回不在本期。",
    sourceDecisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
      "docs/prd-workflow/decisions/chapter-course.decision.md",
      "docs/prd-workflow/inventories/chapter-course.inventory.md",
    ],
    requirements: [
      {
        id: "CHAPTER_COURSE-001",
        title: "顶栏章节标题",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "顶栏「课程中心-章节名」",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.scope.title",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位顶栏章节标题", anchorId: "chapter.scope.title" },
          { type: "highlight", label: "高亮顶栏章节标题", anchorId: "chapter.scope.title" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "顶栏展示「课程中心-」+ 当前章节完整名称。",
              "章节名称与首页目录中该章节文案一致。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "章节名来自进入课程中心时选中的章节。",
              "本页课程与试卷数据均以当前章节为范围。",
              "本期不处理校本课相关能力。",
            ],
          },
        ],
        acceptance: [
          "进入章节页顶栏可见「课程中心-」+ 章节名。",
          "章节名与入口所选章节一致。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "顶栏「课程中心-章节名」",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-002",
        title: "课型 Tab（同步/专题/拓展）",
        sourceType: "code+decision",
        objectType: "tab",
        objectName: "课型 Tab",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.type.tabs",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "setTab", label: "切换到同步课", tab: "sync" },
          { type: "scrollTo", label: "定位课型 Tab", anchorId: "chapter.type.tabs" },
          { type: "highlight", label: "高亮课型 Tab", anchorId: "chapter.type.tabs" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "Tab 展示同步课、专题课、拓展课（校本课本期不审不实现业务）。",
              "同一时间仅一个业务课型处于选中态。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "切换课型时，左侧课程列表、右侧试卷列表、课程辅助文案、试卷辅助文案、课程数量、试卷数量全部切换为该课型数据。",
            ],
          },
        ],
        acceptance: [
          "三个课型可切换且互斥选中。",
          "切课型后左右内容与文案、数量同步变化。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课型 Tab",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-003",
        title: "课程辅助文案",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "课程辅助文案",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.course.hint",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位课程辅助文案", anchorId: "chapter.course.hint" },
          { type: "highlight", label: "高亮课程辅助文案", anchorId: "chapter.course.hint" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "课程栏目标题行展示短辅助文案，与「课程」标签同处渐变容器内。",
              "同步课：「教材同步 · 循序渐进」。",
              "专题课：「重难点 · 专项突破」。",
              "拓展课：「学有余力 · 拔高拓展」。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "文案按当前课型固定展示，不随筛选条件变化。",
            ],
          },
        ],
        acceptance: [
          "切换课型时辅助文案切换为对应定稿文案。",
          "筛选后文案不变。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课程辅助文案",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-004",
        title: "课程数量",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "课程数量",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.course.count",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位课程数量", anchorId: "chapter.course.count" },
          { type: "highlight", label: "高亮课程数量", anchorId: "chapter.course.count" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "课程辅助文案后以轻量形式展示数量，如「· 4 门」。",
            ],
          },
          {
            title: "统计口径",
            items: [
              "无筛选时显示当前课型下课程总数。",
              "有课程状态筛选时显示筛选后可见数量。",
              "数量为 0 时仍显示「0 门」。",
            ],
          },
        ],
        acceptance: [
          "切课型后数量对应该课型课程数。",
          "筛选后数量等于可见课程数；为 0 时显示 0 门。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课程数量",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-005",
        title: "课程列表与空状态",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "课程列表/卡片区",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.course.list",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位课程列表", anchorId: "chapter.course.list" },
          { type: "highlight", label: "高亮课程列表", anchorId: "chapter.course.list" },
        ],
        logicSections: [
          {
            title: "数据规则",
            items: [
              "课程归属「当前章节 + 当前课型」。",
              "课程时长来自配置后台，无缺失展示态。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "当前课型无课程时，左侧显示「当前类型暂无资源，可查看其他类型的资源」。",
              "因筛选导致无匹配课程时，不走上述空配置文案；课程区显示「当前筛选状态暂无课程，可调整筛选项」。",
            ],
          },
        ],
        acceptance: [
          "列表仅含当前章节当前课型课程。",
          "无课程配置时出现指定空状态文案。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课程列表/卡片区",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-006",
        title: "课程学习状态",
        sourceType: "code+decision",
        objectType: "state",
        objectName: "课程学习状态",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.course.status",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位课程状态", anchorId: "chapter.course.status" },
          { type: "highlight", label: "高亮课程状态", anchorId: "chapter.course.status" },
        ],
        logicSections: [
          {
            title: "状态规则",
            items: [
              "课程状态为「待学习 / 学习中 / 已学习」三态。",
              "筛选抽屉中的课程状态选项与上述三态一一映射。",
              "【8.11需求评审后补充】所有视频待学习：指从未打开过这个视频；学习中：指打开过这个视频，但是这个视频还未看到最后；已学习：指打开过这个视频，且已看到视频最后（无论是自然看到最后，还是手动拖动到最后，都算是已学习）。",
            ],
          },
          {
            title: "显示说明",
            items: [
              "每张课程卡片展示当前学习状态。",
            ],
          },
        ],
        acceptance: [
          "卡片可见三态之一。",
          "课程筛选项与三态对应。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课程学习状态",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-007",
        title: "试卷辅助文案",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "试卷辅助文案",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.hint",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷辅助文案", anchorId: "chapter.papers.hint" },
          { type: "highlight", label: "高亮试卷辅助文案", anchorId: "chapter.papers.hint" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "试卷栏目标题行展示四字短辅助文案。",
              "同步课：「及时巩固」。",
              "专题课：「强化突破」。",
              "拓展课：「挑战进阶」。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "文案按当前课型固定展示，不随筛选条件变化。",
            ],
          },
        ],
        acceptance: [
          "切换课型时试卷辅助文案切换为对应定稿。",
          "筛选后文案不变。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷辅助文案",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-008",
        title: "试卷数量",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "试卷数量",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.count",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷数量", anchorId: "chapter.papers.count" },
          { type: "highlight", label: "高亮试卷数量", anchorId: "chapter.papers.count" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "试卷辅助文案后以轻量形式展示数量，如「· 2 套」。",
            ],
          },
          {
            title: "统计口径",
            items: [
              "无筛选时显示当前课型试卷总数。",
              "有试卷状态筛选时显示筛选后可见数量。",
              "筛选后可见数量为 0 时仍显示「0 套」。",
              "若该课型本身为空配置（未配置任何试卷），则隐藏数量，不显示「0 套」。",
            ],
          },
        ],
        acceptance: [
          "有配置时数量随课型与筛选变化。",
          "筛选零结果显示 0 套；空配置隐藏数量。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷数量",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-009",
        title: "试卷列表归属与空配置",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "试卷列表区",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.list",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷列表", anchorId: "chapter.papers.list" },
          { type: "highlight", label: "高亮试卷列表", anchorId: "chapter.papers.list" },
        ],
        logicSections: [
          {
            title: "数据规则",
            items: [
              "试卷归属「当前章节 + 当前课型」。",
              "切换课型后只展示该课型配套试卷。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "课型未配置试卷时，右侧展示空配置态：标题「暂未配置{课型名}练习试卷」，说明「可以先去练习其他课型的配套试卷，巩固所学内容」。",
              "空配置态提供跳转入口（如去同步课试卷、去专题课试卷）；点击后切换到对应课型 Tab，并联动左右课程与试卷。",
              "若跳转目标课型也无试卷，继续显示该课型空配置态。",
              "筛选导致无匹配时，不使用空配置文案；试卷区显示「当前筛选状态暂无试卷，可调整筛选项」。",
            ],
          },
        ],
        acceptance: [
          "切课型后试卷列表只含该课型试卷。",
          "空配置文案含课型名与说明，并可跳转其他课型。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷列表归属 / 空状态 / 空状态跳转",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-010",
        title: "试卷练习状态",
        sourceType: "decision",
        objectType: "state",
        objectName: "试卷练习状态",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.status",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷状态", anchorId: "chapter.papers.status" },
          { type: "highlight", label: "高亮试卷状态", anchorId: "chapter.papers.status" },
        ],
        logicSections: [
          {
            title: "状态规则",
            items: [
              "试卷状态为「未练习 / 练习中 / 已练习」三态。",
              "筛选抽屉中的试卷状态选项与上述三态一一映射（三选一）。",
            ],
          },
          {
            title: "显示说明",
            items: [
              "每条试卷展示当前练习状态。",
            ],
          },
        ],
        acceptance: [
          "列表可见未练习、练习中或已练习。",
          "试卷筛选项包含这三项。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷练习状态",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-011",
        title: "试卷元信息",
        sourceType: "decision",
        objectType: "field",
        objectName: "试卷元信息（题数/时长/得分）",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.meta",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷元信息", anchorId: "chapter.papers.meta" },
          { type: "highlight", label: "高亮试卷元信息", anchorId: "chapter.papers.meta" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "未练习、练习中：展示题数 + 预计时长。",
              "已练习：展示题数 + 得分。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "字段由配置或作答结果提供，不缺省。",
            ],
          },
        ],
        acceptance: [
          "未练习/练习中条目可见题数与预计时长。",
          "已练习条目可见题数与得分。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷元信息",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-012",
        title: "试卷操作入口",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "试卷操作（去练习/查看详情）",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.action",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位试卷操作", anchorId: "chapter.papers.action" },
          { type: "highlight", label: "高亮试卷操作", anchorId: "chapter.papers.action" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "操作文案随练习状态变化：未练习为去练习类入口，已练习为查看详情类入口，练习中为继续作答类入口。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "未练习：进入该卷练习作答页。",
              "已练习：进入该卷详情页。",
              "练习中：进入该卷作答页，并定位到需作答的第一题。",
              "从上述页面返回后，仍停留在章节页当前课型与已生效筛选条件。",
            ],
          },
        ],
        acceptance: [
          "三种状态进入对应目标页。",
          "练习中进入作答页并定位到待答第一题。",
          "返回后课型与筛选条件保持。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "试卷操作",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-015",
        title: "练习试卷流转说明",
        sourceType: "decision",
        objectType: "data",
        objectName: "练习试卷流转",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.papers.flow",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位练习试卷流转", anchorId: "chapter.papers.flow" },
          { type: "highlight", label: "高亮练习试卷流转", anchorId: "chapter.papers.flow" },
        ],
        logicSections: [
          {
            title: "结果与流转",
            items: [
              "【8.11需求评审后补充】只要这份练习试卷完成练习了（用户已提交整份试卷-系统已全部自动批改/或待学生自批），这份试卷就会流转到首页的「练习记录」模块的试卷 tab 栏目下，同时练习试卷里练习过的题目，也都会流转到首页的「练习记录」模块的题目 tab 栏目下。",
            ],
          },
        ],
        acceptance: [
          "整卷提交且完成自动批改或进入待学生自批后，该卷出现在首页「练习记录」-试卷 tab。",
          "该卷中已练习过的题目同步出现在首页「练习记录」-题目 tab。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "练习试卷流转说明",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "CHAPTER_COURSE-013",
        title: "筛选维度与入口",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "筛选入口",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.filter.entry",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "openPanel", label: "打开筛选抽屉", panel: "filter-drawer" },
          { type: "scrollTo", label: "定位筛选入口", anchorId: "chapter.filter.entry" },
          { type: "highlight", label: "高亮筛选入口", anchorId: "chapter.filter.entry" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "顶栏提供筛选入口，章节页任意课型下均可打开。",
              "抽屉内展示两组维度：课程状态、试卷状态。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "筛选作用于当前页可见的课程区与试卷区，不含校本课。",
              "两组条件可同时生效：课程条件只滤课程，试卷条件只滤试卷。",
            ],
          },
        ],
        acceptance: [
          "同步/专题/拓展下均可打开筛选。",
          "抽屉同时展示课程与试卷两组选项。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "筛选入口 / 抽屉选项结构",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-014",
        title: "学习状态筛选规则",
        sourceType: "decision",
        objectType: "state",
        objectName: "学习状态筛选（课程+试卷）",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.filter.course",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "openPanel", label: "打开筛选抽屉", panel: "filter-drawer" },
          { type: "scrollTo", label: "定位课程筛选", anchorId: "chapter.filter.course" },
          { type: "highlight", label: "高亮课程筛选", anchorId: "chapter.filter.course" },
        ],
        logicSections: [
          {
            title: "选取规则",
            items: [
              "筛选抽屉「学习状态」字段同时承载课程状态与试卷状态两组选项。",
              "课程状态为三选一：待学习 / 学习中 / 已学习；仅过滤左侧课程列表，不影响试卷列表。",
              "试卷状态为三选一：未练习 / 练习中 / 已练习；仅过滤右侧试卷列表，不影响课程列表。",
              "两组条件可同时生效：课程条件只滤课程，试卷条件只滤试卷。",
            ],
          },
          {
            title: "显示说明",
            items: [
              "课程筛选项文案：待学习、学习中、已学习。",
              "试卷筛选项文案：未练习、练习中、已练习。",
            ],
          },
        ],
        acceptance: [
          "学习状态字段后可见本需求角标。",
          "选择某一课程状态后，仅课程列表按该状态过滤。",
          "选择某一试卷状态后，仅试卷列表按该状态过滤。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "课程学习状态 / 试卷练习状态 / 筛选结构",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-016",
        title: "筛选确定、取消与清除",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "筛选确定/取消",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.filter.confirm",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "openPanel", label: "打开筛选抽屉", panel: "filter-drawer" },
          { type: "scrollTo", label: "定位筛选确定", anchorId: "chapter.filter.confirm" },
          { type: "highlight", label: "高亮筛选确定", anchorId: "chapter.filter.confirm" },
        ],
        logicSections: [
          {
            title: "操作说明",
            items: [
              "点「确定」立即按当前两组条件过滤并关闭抽屉。",
              "点「取消」、关闭按钮或遮罩只关闭抽屉，不改变已生效筛选。",
              "需提供「清除筛选」才能恢复为未筛选状态。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "确定后若课程区无匹配，课程区显示「当前筛选状态暂无课程，可调整筛选项」。",
              "确定后若试卷区无匹配，试卷区显示「当前筛选状态暂无试卷，可调整筛选项」。",
            ],
          },
        ],
        acceptance: [
          "确定后筛选生效并关闭抽屉。",
          "取消不改变已生效筛选。",
          "分区无匹配时出现对应筛选空文案。",
          "存在清除筛选入口并可恢复未筛选。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "筛选确定 / 取消",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "CHAPTER_COURSE-017",
        title: "列表区域滚动",
        sourceType: "decision",
        objectType: "region",
        objectName: "课程/试卷列表滚动",
        module: "课程中心·章节",
        pageName: "课程中心·章节页",
        route: "#chapter",
        anchorId: "chapter.list.scroll",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入章节课程中心", to: "#chapter" },
          { type: "scrollTo", label: "定位列表滚动区", anchorId: "chapter.list.scroll" },
          { type: "highlight", label: "高亮列表滚动区", anchorId: "chapter.list.scroll" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "课程列表与试卷列表均在各自区域内滚动。",
              "首屏展示数量由 UI 确定，超出部分继续滚动查看。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "数据过多时不分页。",
            ],
          },
        ],
        acceptance: [
          "课程与试卷区域可滚动查看超出首屏内容。",
          "无分页控件。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/chapter-course.decision.md",
          decisionObject: "列表滚动",
          relatedFiles: ["index.html", "css/app.css"],
        },
      },
    ],
    excludedDecisions: [
      {
        objectName: "校本课 Tab 及内容区",
        reason: "本期明确不在范围，不审核不实现校本课业务逻辑",
        sourceDecision: "docs/prd-workflow/decisions/chapter-course.decision.md",
      },
      {
        objectName: "返回按钮",
        reason: "本期明确不纳入审核",
        sourceDecision: "docs/prd-workflow/decisions/chapter-course.decision.md",
      },
      {
        objectName: "Tab 壳装饰（波浪/贴纸/主题色）",
        reason: "纯视觉，无业务口径",
        sourceDecision: "docs/prd-workflow/decisions/chapter-course.decision.md",
      },
      {
        objectName: "课程栏标题「课程」/ 试卷栏标题「试卷」",
        reason: "Skill0 确认为固定标签，跳过业务审核",
        sourceDecision: "docs/prd-workflow/inventories/chapter-course.inventory.md",
      },
      {
        objectName: "课程卡片类型角标",
        reason: "Skill0 确认由 UI 稿定，跳过业务审核",
        sourceDecision: "docs/prd-workflow/inventories/chapter-course.inventory.md",
      },
    ],
  };

  global.chapterCourseRegistry = chapterCourseRegistry;
})(typeof window !== "undefined" ? window : globalThis);
