/**
 * 题目组件类型常量。
 *
 * 页面渲染题目时统一使用这里的常量判断组件类型，避免在 mock、
 * 接口数据适配和组件分发逻辑中散落字符串。
 */
export const QUESTION_COMPONENT_TYPE = {
  /** 文字单选题 */
  SINGLE_CHOICE: 'SingleChoice',
  /** 文字多选题 */
  MULTI_CHOICE: 'MultiChoice',
  /** 图片单选题 */
  IMAGE_SINGLE_CHOICE: 'ImageSingleChoice',
  /** 图片多选题 */
  IMAGE_MULTI_CHOICE: 'ImageMultiChoice',
  /** 文本填空题 */
  TEXT_BLANK: 'TextBlank',
  /** 手机号填空题 */
  PHONE_BLANK: 'PhoneBlank',
  /** 邮箱填空题 */
  EMAIL_BLANK: 'EmailBlank',
  /** 数值填空题 */
  NUMBER_BLANK: 'NumberBlank',
  /** 日期填空题 */
  DATE_BLANK: 'DateBlank',
  /** 多项填空题 */
  MULTI_BLANK: 'MultiBlank',
  /** 图片展示 */
  IMAGE_DISPLAY: 'ImageDisplay',
  /** 视频展示 */
  VIDEO_DISPLAY: 'VideoDisplay',
  /** 打分题 */
  RATING: 'Rating',
  /** NPS 推荐度题 */
  NPS: 'NpsRating',
  /** 双向打分题 */
  BIDIRECTIONAL_RATING: 'BidirectionalRating',
  /** 多项打分题 */
  MULTI_RATING: 'MultiRating',
  /** 多项双向打分题 */
  MULTI_BIDIRECTIONAL_RATING: 'MultiBidirectionalRating',
  /** 矩阵单选题 */
  MATRIX_SINGLE_CHOICE: 'MatrixSingleChoice',
  /** 矩阵多选题 */
  MATRIX_MULTI_CHOICE: 'MatrixMultiChoice',
  /** 矩阵打分题 */
  MATRIX_RATING: 'MatrixRating',
  /** 矩阵双向打分题 */
  MATRIX_BIDIRECTIONAL_RATING: 'MatrixBidirectionalRating',
} as const;

/** 所有题目组件类型的联合类型。 */
export type QuestionComponentType =
  (typeof QUESTION_COMPONENT_TYPE)[keyof typeof QUESTION_COMPONENT_TYPE];

/** 填空题组件在配置面板或题型列表中的展示数据。 */
export const BLANK_QUESTION_COMPONENTS = [
  {
    type: QUESTION_COMPONENT_TYPE.TEXT_BLANK,
    label: '文本填空',
  },
  {
    type: QUESTION_COMPONENT_TYPE.PHONE_BLANK,
    label: '手机号',
  },
  {
    type: QUESTION_COMPONENT_TYPE.EMAIL_BLANK,
    label: '邮箱',
  },
  {
    type: QUESTION_COMPONENT_TYPE.NUMBER_BLANK,
    label: '数值',
  },
  {
    type: QUESTION_COMPONENT_TYPE.DATE_BLANK,
    label: '日期',
  },
  {
    type: QUESTION_COMPONENT_TYPE.MULTI_BLANK,
    label: '多项填空',
  },
] as const;

/** 打分题组件在配置面板或题型列表中的展示数据。 */
export const RATING_QUESTION_COMPONENTS = [
  {
    type: QUESTION_COMPONENT_TYPE.RATING,
    label: '打分题',
  },
  {
    type: QUESTION_COMPONENT_TYPE.NPS,
    label: 'NPS',
  },
  {
    type: QUESTION_COMPONENT_TYPE.BIDIRECTIONAL_RATING,
    label: '双向打分',
  },
  {
    type: QUESTION_COMPONENT_TYPE.MULTI_RATING,
    label: '多项打分',
  },
  {
    type: QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING,
    label: '多项双向打分',
  },
] as const;
