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
      type: 'SingleChoice',
      questionId: 'q1',
      questionText: '您目前的居住状态是？',
      options: [
        { id: 'q2a', label: '独居' },
        { id: 'q2b', label: '与家人同住' },
        { id: 'q2c', label: '与室友合租' },
      ],
    },
  },
  {
    id: 4,
    role: '主持人',
    content: '多选题目',
    duration: createDuration(2),
    config: {
      type: 'MultiChoice',
      questionId: 'q2',
      questionText: '平时您主要通过哪些方式放松？（可多选）',
      options: [
        { id: 'q3a', label: '运动健身' },
        { id: 'q3b', label: '看剧/电影' },
        { id: 'q3c', label: '聚会社交' },
        { id: 'q3d', label: '旅行' },
      ],
    },
  },
  {
    id: 5,
    role: '主持人',
    content: '图片单选',
    duration: createDuration(1),
    config: {
      type: 'single',
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
      type: 'multiple',
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
];

export default data;
