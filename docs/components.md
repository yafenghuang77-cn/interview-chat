# 题目组件开发文档

本文档说明 `src/components` 下题目组件的目录约定、通用协议、提交数据结构和接入方式。

## 设计约定

所有题目组件遵循相同的目录结构：

```text
src/components/ComponentName/
  index.tsx
  type.ts
  util.ts
  style.less
```

约定说明：

- 一个文件夹对应一个组件。
- 每个组件都拥有独立的 `type.ts`、`util.ts`、`style.less`。
- 不抽公共业务类型，不把组件私有逻辑放到共享 util。
- 组件类型常量统一维护在 `src/common/constants.ts`。
- 选中态和聚焦态使用微信主题色 `#07c160`，打分组件图标本身不使用绿色背景、绿色填充或绿色边框。

## 通用组件协议

除 `StarIcon`、`HeartIcon` 这类纯展示图标外，所有题目组件都必须传入 `questionId`，并通过 `ref` 暴露两个方法：

```ts
interface QuestionComponentRef<TValue> {
  init: (value?: TValue) => void;
  getSubmitValue: () => {
    questionId: string;
    value: TValue;
  };
}
```

方法说明：

| 方法               | 用途                                               |
| ------------------ | -------------------------------------------------- |
| `init(value)`      | 初始化组件内部值，用于编辑状态回显                 |
| `getSubmitValue()` | 获取当前组件待提交数据，返回值包含题目 ID 和答案值 |

示例：

```tsx
import React, { useRef } from 'react';
import { SingleChoice, type SingleChoiceRef } from '@/components';

const Demo = () => {
  const questionRef = useRef<SingleChoiceRef<string>>(null);

  const initEditValue = () => {
    questionRef.current?.init('option_a');
  };

  const getValue = () => {
    return questionRef.current?.getSubmitValue();
  };

  return (
    <SingleChoice
      ref={questionRef}
      questionId="q_single"
      options={[
        { label: '选项 A', value: 'option_a' },
        { label: '选项 B', value: 'option_b' },
      ]}
    />
  );
};
```

## 组件清单

| 组件                        | 类型常量                                              | 用途           |
| --------------------------- | ----------------------------------------------------- | -------------- |
| `SingleChoice`              | `QUESTION_COMPONENT_TYPE.SINGLE_CHOICE`               | 文字单选       |
| `MultiChoice`               | `QUESTION_COMPONENT_TYPE.MULTI_CHOICE`                | 文字多选       |
| `ImageSingleChoice`         | `QUESTION_COMPONENT_TYPE.IMAGE_SINGLE_CHOICE`         | 图片单选       |
| `ImageMultiChoice`          | `QUESTION_COMPONENT_TYPE.IMAGE_MULTI_CHOICE`          | 图片多选       |
| `TextBlank`                 | `QUESTION_COMPONENT_TYPE.TEXT_BLANK`                  | 文本填空       |
| `PhoneBlank`                | `QUESTION_COMPONENT_TYPE.PHONE_BLANK`                 | 手机号填空     |
| `EmailBlank`                | `QUESTION_COMPONENT_TYPE.EMAIL_BLANK`                 | 邮箱填空       |
| `NumberBlank`               | `QUESTION_COMPONENT_TYPE.NUMBER_BLANK`                | 数值填空       |
| `DateBlank`                 | `QUESTION_COMPONENT_TYPE.DATE_BLANK`                  | 日期时间填空   |
| `MultiBlank`                | `QUESTION_COMPONENT_TYPE.MULTI_BLANK`                 | 多项填空       |
| `ImageDisplay`              | `QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY`               | 图片展示和预览 |
| `VideoDisplay`              | `QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY`               | 视频展示和预览 |
| `Rating`                    | `QUESTION_COMPONENT_TYPE.RATING`                      | 五角星打分     |
| `NpsRating`                 | `QUESTION_COMPONENT_TYPE.NPS`                         | 爱心 NPS 打分  |
| `BidirectionalRating`       | `QUESTION_COMPONENT_TYPE.BIDIRECTIONAL_RATING`        | 双向打分       |
| `MultiRating`               | `QUESTION_COMPONENT_TYPE.MULTI_RATING`                | 多项打分       |
| `MultiBidirectionalRating`  | `QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING`  | 多项双向打分   |
| `MatrixSingleChoice`        | `QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE`        | 矩阵单选       |
| `MatrixMultiChoice`         | `QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE`         | 矩阵多选       |
| `MatrixRating`              | `QUESTION_COMPONENT_TYPE.MATRIX_RATING`               | 矩阵打分       |
| `MatrixBidirectionalRating` | `QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING` | 矩阵双向打分   |
| `StarIcon`                  | 无                                                    | 公共五角星图标 |
| `HeartIcon`                 | 无                                                    | 公共爱心图标   |

## 提交值结构

每个组件的 `getSubmitValue()` 都返回 `{ questionId, value }`。

| 组件                        | value 结构                                                    |
| --------------------------- | ------------------------------------------------------------- |
| `SingleChoice`              | `string \| number \| null`                                    |
| `MultiChoice`               | `Array<string \| number>`                                     |
| `ImageSingleChoice`         | `string \| number \| null`                                    |
| `ImageMultiChoice`          | `Array<string \| number>`                                     |
| `TextBlank`                 | `string`                                                      |
| `PhoneBlank`                | `string`                                                      |
| `EmailBlank`                | `string`                                                      |
| `NumberBlank`               | `string`                                                      |
| `DateBlank`                 | `string \| null`，格式为 `YYYY-MM-DD HH:mm:ss` 或日期字符串   |
| `MultiBlank`                | `string[]`                                                    |
| `ImageDisplay`              | `ImageDisplayImage[]`                                         |
| `VideoDisplay`              | `VideoDisplayVideo[]`                                         |
| `Rating`                    | `number \| null`                                              |
| `NpsRating`                 | `number \| null`                                              |
| `BidirectionalRating`       | `{ leftScore?: number; rightScore?: number } \| null`         |
| `MultiRating`               | `{ [rowValue]: number }`                                      |
| `MultiBidirectionalRating`  | `{ [rowValue]: { leftScore?: number; rightScore?: number } }` |
| `MatrixSingleChoice`        | `{ [rowValue]: columnValue }`                                 |
| `MatrixMultiChoice`         | `{ [rowValue]: columnValue[] }`                               |
| `MatrixRating`              | `{ [rowValue]: number }`                                      |
| `MatrixBidirectionalRating` | `{ [rowValue]: { leftScore?: number; rightScore?: number } }` |

## 页面接入

预览页通过 `AnswerAreaList` 根据配置中的 `type` 分发到具体组件：

```tsx
<AnswerAreaList options={item.config} />
```

配置最少需要包含：

```ts
{
  type: QUESTION_COMPONENT_TYPE.SINGLE_CHOICE,
  questionId: 'q1',
  questionText: '题目标题',
  options: [
    { id: 'a', label: '选项 A' },
    { id: 'b', label: '选项 B' },
  ],
}
```

`AnswerAreaList` 会把 `questionId` 继续传给实际题目组件。

## 填空组件说明

`TextBlank` 支持 `rows` 配置默认展示行数，输入框聚焦时使用微信主题色。

`PhoneBlank`、`EmailBlank`、`NumberBlank` 会在输入时校验格式：

| 组件          | 默认校验                        |
| ------------- | ------------------------------- |
| `PhoneBlank`  | 中国大陆 11 位手机号            |
| `EmailBlank`  | 常规邮箱格式                    |
| `NumberBlank` | 合法数字，可配置 `min` 和 `max` |

`MultiBlank` 是固定填空项，一个文案对应一个输入框，不支持在组件内新增或删除填空项。

`DateBlank` 支持年月日时分秒选择，选择和回显都包含时分秒；不限制当天之前的时间。

## 媒体组件说明

`ImageDisplay` 使用 `Taro.previewImage` 做图片预览，点击第 N 张图片会从第 N 张开始预览。

`VideoDisplay` 支持多个视频：

- 列表态只显示视频封面入口。
- 点击后优先使用原生 `Taro.previewMedia`。
- 不支持原生预览时降级为全屏 `Swiper + Video` 预览层。
- 支持关闭退出和手滑切换。
- 不传 `poster` 时，H5 会尝试抽取视频第一帧作为封面。
- 移动端视频首帧封面受小程序合法域名、视频跨域和平台策略影响，业务稳定展示建议传 `poster`。

## 打分组件说明

`Rating`、`MultiRating`、`MatrixRating` 使用 `StarIcon`。

`NpsRating` 使用 `HeartIcon`，例如选中 3 分时会点亮 3 个爱心。

双向打分类组件会分别保存左右两个方向的分值，选择一侧不会清空另一侧。

## 矩阵组件说明

矩阵类组件支持横向滑动，单元格宽度由内容自然决定。

矩阵打分和矩阵双向打分的横向标题必须通过 `columns` 配置传入；如果没有配置，组件不会自动根据 `maxScore` 生成分值列。

## 导出

推荐统一从 `@/components` 导入组件和类型：

```tsx
import { Rating, type RatingRef, type RatingSubmitValue } from '@/components';
```

每个组件目录自身也会导出对应的 Props、Ref、SubmitValue 和业务类型，便于按需引用。
