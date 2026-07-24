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
