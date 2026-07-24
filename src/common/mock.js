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
          placeholder: '请输入第 1 个特性',
        },
        {
          label: '特性 2',
          placeholder: '请输入第 2 个特性',
        },
        {
          label: '特性 3',
          placeholder: '请输入第 3 个特性',
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
          description: '点击图片可预览大图。',
        },
        {
          src: 'https://picsum.photos/seed/interview-chat-reference-b/800/800',
          title: '参考图片 2',
          description: '预览层支持切换和退出。',
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
          description: '点击封面进入预览。',
        },
        {
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          title: '参考视频 2',
          description: '预览层支持切换和退出。',
          },
        ],
    },
  },
];

export default data;
