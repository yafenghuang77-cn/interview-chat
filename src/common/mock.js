import { QUESTION_COMPONENT_TYPE } from './constants';

const now = Date.now();
const minute = 60 * 1000;

const createDuration = minutes => [now, now + minutes * minute];

const data = [
  {
    id: 1,
    role: '主持人',
    content:
      '大家好，欢迎各位参加我们这个线上分享会！我们今天的主题分享会大约会占用您60分钟。我是主持人Mina，今天的分享会大约会占用您60分钟，欢迎大家踊跃发言~',
    config: null,
  },
  {
    id: 2,
    role: '主持人',
    content:
      '首先，简单地做个自我介绍，也让我更好地了解一下你~请用3个关键词来简单介绍一下你自己的生活状态。',
    config: null,
  },
  {
    id: 3,
    role: '主持人',
    content: '单选题',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.SINGLE_CHOICE,
      questionId: 'q1',
      questionText: '您目前的居住状态是？',
      options: [
        { id: 'q1a', label: '独居' },
        { id: 'q1b', label: '与家人同住' },
        { id: 'q1c', label: '与室友合租' },
      ],
    },
  },
  {
    id: 4,
    role: '主持人',
    content: '多选题目',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.MULTI_CHOICE,
      questionId: 'q2',
      questionText: '平时您主要通过哪些方式放松？（可多选）',
      options: [
        { id: 'q2a', label: '运动健身' },
        { id: 'q2b', label: '看剧/电影' },
        { id: 'q2c', label: '聚会社交' },
        { id: 'q2d', label: '旅行' },
      ],
    },
  },
  {
    id: 5,
    role: '主持人',
    content: '图片单选',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.IMAGE_SINGLE_CHOICE,
      questionId: 'q3',
      questionText: '下面哪张图最符合你此刻的心情？（图片单选）',
      options: [
        {
          id: 'q4a',
          label: '元气满满',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
        {
          id: 'q4b',
          label: '平静放松',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
      ],
    },
  },
  {
    id: 6,
    role: '主持人',
    content: '图片多选',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.IMAGE_MULTI_CHOICE,
      questionId: 'q4',
      questionText: '你喜欢哪些口味？（图片多选）',
      options: [
        {
          id: 'q5a',
          label: '香辣',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
        {
          id: 'q5b',
          label: '原味',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
        {
          id: 'q5c',
          label: '甜口',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
        {
          id: 'q5d',
          label: '酸爽',
          image: 'https://ges.yumchina.com/image/941a1d9f92344092a588ab15bd9023de1698661096037.png',
        },
      ],
    },
  },
  {
    id: 7,
    role: '主持人',
    content: '文本填空',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.TEXT_BLANK,
      questionId: 'q5',
      questionText: '请用一句话描述你最近印象最深的一次消费体验。',
      placeholder: '请输入文本',
      rows: 2,
    },
  },
  {
    id: 8,
    role: '主持人',
    content: '手机号',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.PHONE_BLANK,
      questionId: 'q6',
      questionText: '请输入便于后续联系的手机号。',
      placeholder: '请输入手机号',
      maxlength: 11,
      required: true,
      requiredMessage: '手机号不能为空',
      errorMessage: '请输入 11 位有效手机号',
    },
  },
  {
    id: 9,
    role: '主持人',
    content: '邮箱',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.EMAIL_BLANK,
      questionId: 'q7',
      questionText: '请输入常用邮箱。',
      placeholder: '请输入邮箱',
      maxlength: 120,
      required: true,
      requiredMessage: '邮箱不能为空',
      errorMessage: '请输入正确的邮箱格式',
    },
  },
  {
    id: 10,
    role: '主持人',
    content: '数值',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.NUMBER_BLANK,
      questionId: 'q8',
      questionText: '你每周大约会花多少小时了解新产品？',
      placeholder: '请输入数值',
      maxlength: 4,
      required: true,
      min: 0,
      max: 168,
      requiredMessage: '数值不能为空',
      errorMessage: '请输入有效数字',
      minMessage: '数值不能小于 0',
      maxMessage: '一周最多 168 小时',
    },
  },
  {
    id: 11,
    role: '主持人',
    content: '日期',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.DATE_BLANK,
      questionId: 'q9',
      questionText: '请选择你方便参加回访的日期时间。',
      placeholder: '请选择日期时间',
      mode: 'datetime',
    },
  },
  {
    id: 12,
    role: '主持人',
    content: '多项填空',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.MULTI_BLANK,
      questionId: 'q10',
      questionText: '请列出你最关注的 3 个产品特性。',
      placeholder: '请输入',
      defaultValue: ['', '', ''],
      items: [
        {
          label: '特性 1',
          // placeholder: '请输入第 1 个特性',
        },
        {
          label: '特性 2',
          // placeholder: '请输入第 2 个特性',
        },
        {
          label: '特性 3',
          // placeholder: '请输入第 3 个特性',
        },
      ],
    },
  },
  {
    id: 13,
    role: '主持人',
    content: '图片展示',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY,
      questionId: 'q11',
      questionText: '下面是本次讨论会用到的参考图片。',
      images: [
        {
          src: 'https://picsum.photos/seed/interview-chat-reference-a/800/800',
          title: '参考图片',
          // description: '点击图片可预览大图。',
        },
        {
          src: 'https://picsum.photos/seed/interview-chat-reference-b/800/800',
          title: '参考图片 2',
          // description: '预览层支持切换和退出。',
        },
      ],
      preview: true,
    },
  },
  {
    id: 14,
    role: '主持人',
    content: '视频展示',
    duration: createDuration(1),
    config: {
      type: QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY,
      questionId: 'q12',
      questionText: '请先观看这些参考视频。',
      description: '未配置 poster 时，视频默认显示首帧作为封面。',
      videos: [
        {
          src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          title: '参考视频 1',
          // description: '点击封面进入预览。',
        },
        {
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          title: '参考视频 2',
          // description: '预览层支持切换和退出。',
        },
      ],
    },
  },
  {
    id: 15,
    role: '主持人',
    content: '餐饮体验满意度矩阵单选',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE,
      questionId: 'q13',
      questionText: '结合最近一次到店或外卖消费体验，请评价下面各环节的满意程度。',
      rows: [
        {
          id: 'ordering_process',
          label: '下单流程是否顺畅',
          // description: '包含菜单浏览、规格选择、支付等步骤',
        },
        {
          id: 'meal_temperature',
          label: '餐品到手时的温度',
          // description: '堂食可理解为上桌时的温度',
        },
        {
          id: 'taste_stability',
          label: '口味稳定性',
          // description: '是否符合你对该品牌或该菜品的预期',
        },
        {
          id: 'staff_response',
          label: '门店或客服响应速度',
          // description: '包含咨询、改餐、售后等沟通体验',
        },
        {
          id: 'package_cleanliness',
          label: '包装完整度与整洁度',
          // description: '堂食可理解为餐具和桌面整洁度',
        },
      ],
      columns: [
        { id: 'very_unsatisfied', label: '非常不满意' },
        { id: 'unsatisfied', label: '不满意' },
        { id: 'neutral', label: '一般' },
        { id: 'satisfied', label: '满意' },
        { id: 'very_satisfied', label: '非常满意' },
      ],
    },
  },
  {
    id: 16,
    role: '主持人',
    content: '不同用餐场景关注因素矩阵多选',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE,
      questionId: 'q14',
      questionText: '在下面这些用餐场景中，你通常会重点关注哪些因素？（每行可多选）',
      rows: [
        {
          id: 'weekday_lunch',
          label: '工作日午餐',
          // description: '时间有限，希望快速解决一餐',
        },
        {
          id: 'late_night_snack',
          label: '加班或夜宵',
          // description: '更在意方便、热乎和满足感',
        },
        {
          id: 'family_weekend',
          label: '周末家庭聚餐',
          // description: '会兼顾家人喜好和分享体验',
        },
        {
          id: 'travel_meal',
          label: '出行路上临时用餐',
          // description: '在商圈、车站、景区等场景快速决策',
        },
      ],
      columns: [
        { id: 'price_value', label: '价格划算' },
        { id: 'serving_speed', label: '出餐或配送速度' },
        { id: 'taste_reliability', label: '口味稳定不踩雷' },
        { id: 'nutrition_balance', label: '营养搭配更均衡' },
        { id: 'brand_trust', label: '品牌让人放心' },
        { id: 'easy_to_share', label: '适合多人分享' },
      ],
    },
  },
  {
    id: 17,
    role: '主持人',
    content: '产品体验五分制矩阵打分',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.MATRIX_RATING,
      questionId: 'q15',
      questionText: '请按 1-5 分评价你对该品牌近期产品体验的感受，分数越高代表越认可。',
      columns: [
        { id: 'score_1', value: 1, label: '1分' },
        { id: 'score_2', value: 2, label: '2分' },
        { id: 'score_3', value: 3, label: '3分' },
        { id: 'score_4', value: 4, label: '4分' },
        { id: 'score_5', value: 5, label: '5分' },
      ],
      rows: [
        {
          id: 'ingredient_freshness',
          label: '食材新鲜度',
          // description: '入口感受、颜色状态、气味等综合判断',
        },
        {
          id: 'flavor_memory',
          label: '口味记忆点',
          // description: '是否有让你愿意再次想起的特色',
        },
        {
          id: 'portion_satisfaction',
          label: '份量满足感',
          // description: '是否符合价格和用餐场景预期',
        },
        {
          id: 'packaging_convenience',
          label: '包装便利性',
          // description: '是否方便携带、打开、食用和收纳',
        },
        {
          id: 'recommendation_willingness',
          label: '推荐给朋友的意愿',
          // description: '综合考虑价格、口味、体验后的推荐可能性',
        },
      ],
    },
  },
  {
    id: 18,
    role: '主持人',
    content: '品牌感知双向矩阵打分',
    duration: createDuration(2),
    config: {
      type: QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING,
      questionId: 'q16',
      questionText:
        '下面每一项都有两种相反感受，请选择你认为更贴近该品牌的一侧，并用星级表示偏向强度。',
      leftLabel: '偏左',
      rightLabel: '偏右',
      columns: [
        { id: 'level_1', value: 1, label: '1星' },
        { id: 'level_2', value: 2, label: '2星' },
        { id: 'level_3', value: 3, label: '3星' },
        { id: 'level_4', value: 4, label: '4星' },
        { id: 'level_5', value: 5, label: '5星' },
      ],
      rows: [
        {
          id: 'price_position',
          label: '价格感知',
          leftLabel: '实惠亲民',
          rightLabel: '品质溢价',
        },
        {
          id: 'brand_style',
          label: '品牌气质',
          leftLabel: '经典稳妥',
          rightLabel: '年轻有新意',
        },
        {
          id: 'flavor_style',
          label: '口味表达',
          leftLabel: '清淡耐吃',
          rightLabel: '浓郁有冲击力',
        },
        {
          id: 'consumption_mood',
          label: '消费氛围',
          leftLabel: '日常随手买',
          rightLabel: '有仪式感',
        },
        {
          id: 'social_attribute',
          label: '适用关系',
          leftLabel: '适合一个人快速解决',
          rightLabel: '适合和别人一起分享',
        },
      ],
    },
  },
];

export default data;
