const now = Date.now();
const minute = 60 * 1000;

const createDuration = minutes => [now, now + minutes * minute];

const data = [
  {
    id: 1,
    role: '主持人',
    content:
      '大家好，欢迎各位参加我们这个线上分享会！我们今天的主题分享会大约会占用您60分钟。我是主持人Mina，今天的分享会大约会占用您60分钟，欢迎大家踊跃发言~',
    duration: createDuration(1),
    config: null,
  },
  {
    id: 2,
    role: '主持人',
    content:
      '首先，简单地做个自我介绍，也让我更好地了解一下你~请用3个关键词来简单介绍一下你自己的生活状态。',
    duration: createDuration(3),
    // config: {
    //   type: '',
    // },
  },
  {
    id: 3,
    role: '主持人',
    content: '请耐心等待一下，还有一些用户正在答题，全部答完后将开始下一题。',
    duration: createDuration(2),
  },
  {
    id: 4,
    role: '主持人',
    content: '接下来，我们继续您最近光顾过以下哪些品牌',
    duration: createDuration(5),
  },
  { id: 5, role: '主持人', content: '单选题', duration: createDuration(1) },
  { id: 6, role: '主持人', content: '多选题目', duration: createDuration(2) },
  { id: 7, role: '主持人', content: '图片单选', duration: createDuration(1) },
  { id: 8, role: '主持人', content: '题目多选', duration: createDuration(2) },
];

export default data;
