/**
 * 课程中心·小节页 需求注册表（决策单元粒度）
 */
(function (global) {
  const sectionCourseRegistry = {
    registryId: "section-course",
    pageName: "课程中心·小节页",
    route: "#section",
    module: "课程中心",
    description:
      "按决策单元拆分的小节同步课需求：来源 Tab、数量角标、备课类型、课程状态、试卷归属与套数、筛选维度/课程筛选/试卷筛选等。校本课与返回不在本期。",
    sourceDecisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
    relatedFiles: [
      "index.html",
      "js/app.js",
      "css/app.css",
      "docs/prd-workflow/decisions/section-course.decision.md",
    ],
    requirements: [
      {
        id: "SECTION_COURSE-001",
        title: "当前小节标题",
        sourceType: "code+decision",
        objectType: "copy",
        objectName: "当前小节标题",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.scope.title",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位小节标题", anchorId: "section.scope.title" },
          { type: "highlight", label: "高亮小节标题", anchorId: "section.scope.title" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "内容区顶部展示当前小节名称。",
              "本期只处理同步课相关能力；校本课不在本期范围。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "页面课程与试卷数据均以当前小节为范围。",
            ],
          },
        ],
        acceptance: [
          "进入页面可见当前小节标题。",
          "本期验收不包含校本课。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "同步课主内容 / 校本课范围",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-002",
        title: "三类来源 Tab",
        sourceType: "code+decision",
        objectType: "tab",
        objectName: "三类来源 Tab",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.source.tabs",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位来源说明旁的 Tab 区", anchorId: "section.source.desc" },
          { type: "highlight", label: "高亮来源说明（Tab 区上方）", anchorId: "section.source.desc" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "同步课左侧展示三类来源：平台精选课、任课教师备课资料、课堂录像。",
              "同一时间仅一个来源处于选中态，并展示该来源课程列表。",
            ],
          },
          {
            title: "数据来源",
            items: [
              "平台精选课来自平台配置的同步课。",
              "任课教师备课资料来自本班教师为该小节准备的资料。",
              "课堂录像来自该小节课堂实录。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "点击来源 Tab 切换左侧课程列表；右侧练习试卷不随来源切换而变化。",
            ],
          },
        ],
        acceptance: [
          "三个来源可切换且互斥选中。",
          "切来源时右侧试卷列表不变。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "同步课三类来源",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "SECTION_COURSE-003",
        title: "来源数量角标",
        sourceType: "decision",
        objectType: "field",
        objectName: "来源数量角标",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.source.count",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位来源数量", anchorId: "section.source.count" },
          { type: "highlight", label: "高亮来源数量", anchorId: "section.source.count" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "每个来源 Tab 旁展示数量角标。",
              "无筛选时等于该来源全部课程数；有筛选时等于筛选后可见课程数。",
              "可见数量为 0 时 Tab 仍显示，角标为 0。",
            ],
          },
          {
            title: "统计口径",
            items: [
              "只统计当前来源下的课程，不统计试卷。",
              "仅课程状态筛选影响该角标；试卷筛选不影响。",
            ],
          },
        ],
        acceptance: [
          "筛选前后数量角标随可见课程变化。",
          "为 0 时 Tab 仍在且显示 0。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "来源 Tab 数量角标",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-004",
        title: "备课资料文件类型区分",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "备课资料类型标识",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.source.teacher.type",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位备课资料 Tab", anchorId: "section.source.teacher.type" },
          { type: "highlight", label: "高亮备课资料 Tab", anchorId: "section.source.teacher.type" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "角标落在「任课教师备课资料」Tab；切到该来源后，列表内按文件类型分子类展示，至少区分视频与 PPT。",
              "视频展示视频类型标识；PPT 展示 PPT 类型标识及页数。",
            ],
          },
          {
            title: "状态规则",
            items: [
              "【8.11需求评审后补充】PPT 达到已学习的行为为看到最后一页，即状态变更为已学习。",
            ],
          },
        ],
        acceptance: [
          "备课资料列表可区分视频与 PPT 类型。",
          "PPT 浏览至最后一页后，学习状态变更为已学习。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "备课资料类型区分",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-012",
        title: "来源辅助说明文案",
        sourceType: "code",
        objectType: "copy",
        objectName: "来源辅助提示",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.source.desc",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位来源说明", anchorId: "section.source.desc" },
          { type: "highlight", label: "高亮来源说明", anchorId: "section.source.desc" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "每个来源 Tab 下，资源列表上方展示一条辅助说明文案，随当前来源切换而变化。",
              "平台精选课：「平台精选的同步学习课程，建议优先学习以掌握本小节核心知识点。」",
              "任课教师备课资料：「本班任课教师为该小节准备的课件资料，可结合课堂进度查看，巩固当堂所学。」",
              "课堂录像：「当前小节的课堂录像，建议课后复习学习；回看老师讲解，便于查漏补缺。」",
            ],
          },
        ],
        acceptance: [
          "切到来源时可见对应该来源的辅助说明文案。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "来源辅助说明",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-005",
        title: "课程学习状态",
        sourceType: "code+decision",
        objectType: "state",
        objectName: "课程学习状态",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.course.status",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位课程状态", anchorId: "section.course.status" },
          { type: "highlight", label: "高亮课程状态", anchorId: "section.course.status" },
        ],
        logicSections: [
          {
            title: "状态规则",
            items: [
              "课程状态保留三态：待学习、学习中、已学习。",
              "三态在课程卡片上展示，并作为课程筛选项的一一映射。",
              "【8.11需求评审后补充】已学完的逻辑和目前已经实现的逻辑保持不变。",
              "【8.11需求评审后补充】每个视频资源，在学习的时候，都需要记录用户单次浏览视频的累计时长，是否达到视频总时长的50%，如果满足，则将该视频进行计数，以便后续学习报告统计数据使用，同时一个视频，单日最多只计数1次。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "当前来源下无课程时，课程区域显示「当前类型暂无资源，可查看其他类型的资源」。",
            ],
          },
        ],
        acceptance: [
          "卡片可见三态之一。",
          "无课程时展示指定空状态文案。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "课程学习状态 / 空状态",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-006",
        title: "练习试卷区",
        sourceType: "code+decision",
        objectType: "region",
        objectName: "练习试卷标题",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.papers.title",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位练习试卷", anchorId: "section.papers.title" },
          { type: "highlight", label: "高亮练习试卷", anchorId: "section.papers.title" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "同步课右侧常显练习试卷区，含标题、辅助说明、套数、试卷列表（名称、题量/用时或得分、练习状态）。",
            ],
          },
          {
            title: "数据规则",
            items: [
              "练习试卷只挂在「当前小节 + 同步课」下，不按左侧来源拆分。",
              "切换来源 Tab 时，试卷列表保持不变。",
              "试卷来源通过配置后台获取；后续配置后台在为小节配置视频时，会支持配置配套的练习试卷。",
              "本期先做好对接接口的设计即可。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "未配置试卷时显示「暂未配置试卷」。",
            ],
          },
        ],
        acceptance: [
          "切来源时试卷列表不变。",
          "无试卷时显示「暂未配置试卷」。",
          "试卷数据来源按配置后台对接口径设计。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "练习试卷归属 / 空状态",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-008",
        title: "列表区域滚动",
        sourceType: "decision",
        objectType: "region",
        objectName: "课程列表滚动区",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.list.scroll",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位列表滚动区", anchorId: "section.list.scroll" },
          { type: "highlight", label: "高亮列表滚动区", anchorId: "section.list.scroll" },
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
              "数据过多时不分页，不使用「查看更多」式分页展开。",
            ],
          },
        ],
        acceptance: [
          "课程与试卷区域可滚动查看超出首屏内容。",
          "无分页控件。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "列表：数据过多",
          relatedFiles: ["index.html", "css/app.css"],
        },
      },      {
        id: "SECTION_COURSE-013",
        title: "练习试卷辅助说明",
        sourceType: "code",
        objectType: "copy",
        objectName: "练习试卷辅助文案",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.papers.desc",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位试卷说明", anchorId: "section.papers.desc" },
          { type: "highlight", label: "高亮试卷说明", anchorId: "section.papers.desc" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "练习试卷标题下方展示辅助说明文案。",
              "文案：「学完课程后建议练习试卷，以可巩固学习内容」。",
            ],
          },
        ],
        acceptance: [
          "试卷区标题下可见辅助说明文案。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "练习试卷辅助说明",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-007",
        title: "试卷套数",
        sourceType: "code+decision",
        objectType: "field",
        objectName: "试卷套数",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.papers.count",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位试卷套数", anchorId: "section.papers.count" },
          { type: "highlight", label: "高亮试卷套数", anchorId: "section.papers.count" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "练习试卷区展示当前小节同步课下的试卷套数，如「3 套」。",
            ],
          },
          {
            title: "统计口径",
            items: [
              "套数统计当前小节 + 同步课下的练习试卷总数。",
              "不随左侧来源 Tab 切换而改变。",
              "试卷状态筛选后，需展示筛选后的可见套数；无筛选时为全部套数。",
            ],
          },
        ],
        acceptance: [
          "套数展示在试卷区标题旁。",
          "切换来源 Tab 时套数不变化。",
          "有试卷筛选时套数等于筛选后可见试卷数。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "练习试卷",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-014",
        title: "试卷操作按钮",
        sourceType: "code+decision",
        objectType: "action",
        objectName: "试卷操作入口",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.papers.action",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位试卷操作", anchorId: "section.papers.action" },
          { type: "highlight", label: "高亮试卷操作", anchorId: "section.papers.action" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "每条试卷右侧展示操作入口，文案随练习状态变化。",
              "未练习显示「去练习」；已练习显示「查看详情」。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "点击「去练习」进入该试卷练习流程。",
              "点击「查看详情」查看已练习试卷的结果/详情。",
            ],
          },
        ],
        acceptance: [
          "未练习试卷展示「去练习」。",
          "已练习试卷展示「查看详情」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "试卷操作入口",
          relatedFiles: ["index.html"],
        },
      },
      {
        id: "SECTION_COURSE-015",
        title: "练习试卷流转说明",
        sourceType: "decision",
        objectType: "data",
        objectName: "练习试卷流转",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.papers.flow",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位练习试卷流转", anchorId: "section.papers.flow" },
          { type: "highlight", label: "高亮练习试卷流转", anchorId: "section.papers.flow" },
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
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "练习试卷流转说明",
          relatedFiles: ["index.html"],
        },
      },

      {
        id: "SECTION_COURSE-009",
        title: "筛选维度",
        sourceType: "code+decision",
        objectType: "button",
        objectName: "筛选入口",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.filter.entry",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "openPanel", label: "打开筛选抽屉", panel: "filter-drawer" },
          { type: "scrollTo", label: "定位筛选入口", anchorId: "section.filter.entry" },
          { type: "highlight", label: "高亮筛选入口", anchorId: "section.filter.entry" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "页头提供筛选入口，点击打开筛选抽屉。",
              "抽屉内展示两个筛选维度：课程状态、试卷状态。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "点击确定应用筛选并关闭抽屉。",
              "取消、点遮罩或点关闭只关闭抽屉，不改变已生效筛选。",
              "提供「清除筛选」，点击后恢复未筛选状态。",
            ],
          },
        ],
        acceptance: [
          "抽屉可见课程状态与试卷状态两个维度。",
          "取消不清除已生效筛选；清除筛选可恢复全部。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "筛选抽屉：选项结构 / 取消与清除",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "SECTION_COURSE-010",
        title: "课程筛选",
        sourceType: "decision",
        objectType: "field",
        objectName: "课程状态筛选",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.filter.course",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位课程筛选关联点", anchorId: "section.filter.course" },
          { type: "highlight", label: "高亮课程筛选关联点", anchorId: "section.filter.course" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "课程筛选维度选项为：待学习、学习中、已学习（三选一）。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "课程筛选只过滤左侧课程列表，不影响试卷列表。",
              "可与试卷筛选同时生效。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "课程侧筛选后无匹配时，课程区域显示「当前筛选状态暂无课程，可调整筛选项」。",
            ],
          },
        ],
        acceptance: [
          "课程三态可筛选且只作用于课程。",
          "无匹配时课程区显示「当前筛选状态暂无课程，可调整筛选项」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "课程筛选相关决策",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
      {
        id: "SECTION_COURSE-011",
        title: "试卷筛选",
        sourceType: "decision",
        objectType: "field",
        objectName: "试卷状态筛选",
        module: "课程中心·小节",
        pageName: "课程中心·小节页",
        route: "#section",
        anchorId: "section.filter.paper",
        anchorStatus: "implemented",
        activate: [
          { type: "navigate", label: "进入小节课程中心", to: "#section" },
          { type: "scrollTo", label: "定位试卷筛选关联点", anchorId: "section.filter.paper" },
          { type: "highlight", label: "高亮试卷筛选关联点", anchorId: "section.filter.paper" },
        ],
        logicSections: [
          {
            title: "显示说明",
            items: [
              "试卷筛选维度选项为：待练习、练习中、已练习（三选一）。",
            ],
          },
          {
            title: "操作说明",
            items: [
              "试卷筛选只过滤右侧试卷列表，不影响课程列表。",
              "可与课程筛选同时生效。",
            ],
          },
          {
            title: "异常情况处理",
            items: [
              "试卷侧筛选后无匹配时，试卷区域显示「当前筛选状态暂无练习试卷，可调整筛选项」。",
            ],
          },
        ],
        acceptance: [
          "试卷三态可筛选且只作用于试卷。",
          "无匹配时试卷区显示「当前筛选状态暂无练习试卷，可调整筛选项」。",
        ],
        source: {
          decisionFile: "docs/prd-workflow/decisions/section-course.decision.md",
          decisionObject: "试卷筛选相关决策",
          relatedFiles: ["index.html", "js/app.js"],
        },
      },
    ],
    excludedDecisions: [
      {
        objectName: "校本课",
        reason: "不属于本期范围",
        sourceDecision: "决策1：校本课先不管，不是本期范围",
      },
      {
        objectName: "返回按钮",
        reason: "本次审核明确不纳入",
        sourceDecision: "页面范围：返回不用审",
      },
    ],
  };

  global.sectionCourseRegistry = sectionCourseRegistry;
})(typeof window !== "undefined" ? window : globalThis);
