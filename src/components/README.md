# 选择组件说明

本目录封装了选择题和填空题组件。

选择题组件：

- `SingleChoice`：文字单选
- `MultiChoice`：文字多选
- `ImageSingleChoice`：图片单选，每个选项独占一行，布局为上方图片、下方选项
- `ImageMultiChoice`：图片多选，每个选项独占一行，布局为上方图片、下方选项

填空题组件：

- `TextBlank`：文本填空
- `PhoneBlank`：手机号
- `EmailBlank`：邮箱
- `NumberBlank`：数值
- `DateBlank`：日期
- `MultiBlank`：多项填空

主题色使用微信绿：`#07c160`。

## 目录结构

每个组件都是独立目录，组件自己的类型、工具函数、样式都放在组件目录内，不依赖公共 `_shared`：

```text
src/components/
  SingleChoice/
    index.tsx
    type.ts
    util.ts
    style.less
  MultiChoice/
    index.tsx
    type.ts
    util.ts
    style.less
  ImageSingleChoice/
    index.tsx
    type.ts
    util.ts
    style.less
  ImageMultiChoice/
    index.tsx
    type.ts
    util.ts
    style.less
  TextBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  PhoneBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  EmailBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  NumberBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  DateBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  MultiBlank/
    index.tsx
    type.ts
    util.ts
    style.less
  index.ts
```

## 组件类型常量

组件类型常量统一写在 `src/common/constants.ts`：

```ts
import { QUESTION_COMPONENT_TYPE } from '@/common/constants';

const config = {
  type: QUESTION_COMPONENT_TYPE.TEXT_BLANK,
};
```

填空题类型：

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `QUESTION_COMPONENT_TYPE.TEXT_BLANK` | `TextBlank` | 文本填空 |
| `QUESTION_COMPONENT_TYPE.PHONE_BLANK` | `PhoneBlank` | 手机号 |
| `QUESTION_COMPONENT_TYPE.EMAIL_BLANK` | `EmailBlank` | 邮箱 |
| `QUESTION_COMPONENT_TYPE.NUMBER_BLANK` | `NumberBlank` | 数值 |
| `QUESTION_COMPONENT_TYPE.DATE_BLANK` | `DateBlank` | 日期 |
| `QUESTION_COMPONENT_TYPE.MULTI_BLANK` | `MultiBlank` | 多项填空 |

## 导入方式

推荐从 `@/components` 统一导入：

```tsx
import {
  SingleChoice,
  MultiChoice,
  ImageSingleChoice,
  ImageMultiChoice,
  TextBlank,
  PhoneBlank,
  EmailBlank,
  NumberBlank,
  DateBlank,
  MultiBlank,
} from '@/components';
```

也支持兼容命名：

```tsx
import { MultipleChoice, ImageMultipleChoice } from '@/components';
```

## 文字单选

```tsx
import React, { useState } from 'react';
import { SingleChoice } from '@/components';

const options = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b', description: '这是一段补充说明' },
  { label: '选项 C', value: 'c', disabled: true },
];

const Demo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <SingleChoice
      options={options}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

### SingleChoice Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `SingleChoiceOption<T>[]` | 选项列表 |
| `value` | `T \| null` | 当前选中值，传入后为受控模式 |
| `defaultValue` | `T \| null` | 默认选中值，非受控模式使用 |
| `disabled` | `boolean` | 是否禁用整个组件 |
| `className` | `string` | 根节点自定义类名 |
| `optionClassName` | `string` | 选项节点自定义类名 |
| `onChange` | `(value, payload) => void` | 选中变化回调 |

### SingleChoiceOption

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `React.ReactNode` | 选项内容 |
| `value` | `string \| number` | 选项值 |
| `description` | `React.ReactNode` | 补充说明 |
| `disabled` | `boolean` | 是否禁用当前选项 |

## 文字多选

```tsx
import React, { useState } from 'react';
import { MultiChoice } from '@/components';

const options = [
  { label: '沟通能力', value: 'communication' },
  { label: '项目经验', value: 'project' },
  { label: '技术深度', value: 'tech' },
];

const Demo = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MultiChoice
      options={options}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

### MultiChoice Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `MultiChoiceOption<T>[]` | 选项列表 |
| `value` | `T[]` | 当前选中值数组，传入后为受控模式 |
| `defaultValue` | `T[]` | 默认选中值数组，非受控模式使用 |
| `disabled` | `boolean` | 是否禁用整个组件 |
| `className` | `string` | 根节点自定义类名 |
| `optionClassName` | `string` | 选项节点自定义类名 |
| `onChange` | `(value, payload) => void` | 选中变化回调 |

## 图片单选

图片组件垂直排列，每个选项独占一行。选项上方靠左展示正方形小图，下方展示单选控件、标题和描述。

```tsx
import React, { useState } from 'react';
import { ImageSingleChoice } from '@/components';

const options = [
  {
    label: '方案 A',
    value: 'a',
    image: 'https://example.com/a.png',
    imageAlt: '方案 A 图片',
  },
  {
    label: '方案 B',
    value: 'b',
    image: 'https://example.com/b.png',
    description: '图片会显示在选项上方',
  },
];

const Demo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <ImageSingleChoice
      options={options}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

### ImageSingleChoice Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `ImageSingleChoiceOption<T>[]` | 图片选项列表 |
| `value` | `T \| null` | 当前选中值，传入后为受控模式 |
| `defaultValue` | `T \| null` | 默认选中值，非受控模式使用 |
| `disabled` | `boolean` | 是否禁用整个组件 |
| `className` | `string` | 根节点自定义类名 |
| `optionClassName` | `string` | 选项节点自定义类名 |
| `onChange` | `(value, payload) => void` | 选中变化回调 |

### ImageSingleChoiceOption

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `React.ReactNode` | 选项内容 |
| `value` | `string \| number` | 选项值 |
| `image` | `string` | 图片地址 |
| `description` | `React.ReactNode` | 补充说明 |
| `disabled` | `boolean` | 是否禁用当前选项 |
| `imageMode` | `ImageProps['mode']` | Taro Image 的展示模式，默认 `aspectFill` |
| `imageAlt` | `string` | 图片无障碍描述 |

## 图片多选

```tsx
import React, { useState } from 'react';
import { ImageMultiChoice } from '@/components';

const options = [
  {
    label: '图片 A',
    value: 'a',
    image: 'https://example.com/a.png',
  },
  {
    label: '图片 B',
    value: 'b',
    image: 'https://example.com/b.png',
  },
];

const Demo = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <ImageMultiChoice
      options={options}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

### ImageMultiChoice Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `ImageMultiChoiceOption<T>[]` | 图片选项列表 |
| `value` | `T[]` | 当前选中值数组，传入后为受控模式 |
| `defaultValue` | `T[]` | 默认选中值数组，非受控模式使用 |
| `disabled` | `boolean` | 是否禁用整个组件 |
| `className` | `string` | 根节点自定义类名 |
| `optionClassName` | `string` | 选项节点自定义类名 |
| `onChange` | `(value, payload) => void` | 选中变化回调 |

### ImageMultiChoiceOption

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `React.ReactNode` | 选项内容 |
| `value` | `string \| number` | 选项值 |
| `image` | `string` | 图片地址 |
| `description` | `React.ReactNode` | 补充说明 |
| `disabled` | `boolean` | 是否禁用当前选项 |
| `imageMode` | `ImageProps['mode']` | Taro Image 的展示模式，默认 `aspectFill` |
| `imageAlt` | `string` | 图片无障碍描述 |

## onChange payload

四个组件的 `onChange` 第二个参数都包含：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `option` | 当前选项类型 | 本次点击的选项 |
| `checked` | `boolean` | 本次点击后该选项是否选中 |

## 填空题组件

文本、手机号、邮箱、数值这 4 个组件的使用方式一致，区别是默认 placeholder、键盘类型和基础输入处理不同。

```tsx
import React, { useState } from 'react';
import { PhoneBlank } from '@/components';
import { QUESTION_COMPONENT_TYPE } from '@/common/constants';

const Demo = () => {
  const [value, setValue] = useState('');

  return (
    <PhoneBlank
      type={QUESTION_COMPONENT_TYPE.PHONE_BLANK}
      label="手机号"
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

### TextBlank / PhoneBlank / EmailBlank / NumberBlank Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `type` | 对应组件类型常量 | 组件类型 |
| `value` | `string` | 当前输入值，传入后为受控模式 |
| `defaultValue` | `string` | 默认输入值，非受控模式使用 |
| `label` | `React.ReactNode` | 输入框上方标题 |
| `placeholder` | `string` | 占位文案 |
| `disabled` | `boolean` | 是否禁用 |
| `required` | `boolean` | 是否必填，默认非必填 |
| `maxlength` | `number` | 最大输入长度 |
| `requiredMessage` | `string` | 必填校验提示 |
| `errorMessage` | `string` | 格式校验提示 |
| `className` | `string` | 根节点自定义类名 |
| `inputClassName` | `string` | 输入框自定义类名 |
| `validate` | `(value) => string` | 自定义校验，返回错误文案表示不通过 |
| `onChange` | `(value, payload) => void` | 输入变化回调 |

`TextBlank` 使用多行输入，额外支持 `rows`、`autoHeight`、`confirmType`。`rows` 用于配置默认展示几行。

`PhoneBlank` 默认校验 11 位中国大陆手机号；`EmailBlank` 默认校验常规邮箱格式；`NumberBlank` 默认校验合法数字。

`NumberBlank` 额外支持 `inputType`、`min`、`max`、`minMessage`、`maxMessage`，`inputType` 可选 `number` 或 `digit`。

### DateBlank

```tsx
import React, { useState } from 'react';
import { DateBlank } from '@/components';

const Demo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DateBlank
      label="日期"
      value={value}
      mode="datetime"
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `QUESTION_COMPONENT_TYPE.DATE_BLANK` | 组件类型 |
| `mode` | `date \| datetime` | 选择模式，默认 `datetime` |
| `value` | `string \| null` | 当前日期，传入后为受控模式 |
| `defaultValue` | `string \| null` | 默认日期，非受控模式使用 |
| `label` | `React.ReactNode` | 输入框上方标题 |
| `placeholder` | `string` | 未选择时文案 |
| `disabled` | `boolean` | 是否禁用 |
| `start` | `string` | 日期模式下的可选开始日期，不传则不限制 |
| `end` | `string` | 日期模式下的可选结束日期，不传则不限制 |
| `fields` | `year \| month \| day` | 日期模式下的选择粒度，默认 `day` |
| `yearRange` | `number[]` | 日期时间模式下的年份范围，默认当前年前后 50 年 |
| `className` | `string` | 根节点自定义类名 |
| `fieldClassName` | `string` | 日期字段自定义类名 |
| `onChange` | `(value, payload) => void` | 日期变化回调 |

`datetime` 模式选择时展示 `年/月/日/时/分/秒` 六列，回显格式为 `YYYY年MM月DD日 HH时mm分ss秒`；`onChange` 返回值仍为 `YYYY-MM-DD HH:mm:ss`。

### MultiBlank

```tsx
import React, { useState } from 'react';
import { MultiBlank } from '@/components';

const Demo = () => {
  const [value, setValue] = useState<string[]>(['']);

  return (
    <MultiBlank
      label="多项填空"
      items={[
        { label: '姓名', placeholder: '请输入姓名' },
        { label: '公司', placeholder: '请输入公司' },
      ]}
      value={value}
      onChange={nextValue => setValue(nextValue)}
    />
  );
};
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `QUESTION_COMPONENT_TYPE.MULTI_BLANK` | 组件类型 |
| `items` | `MultiBlankItem[]` | 固定填空项列表，每项包含文案和输入框配置 |
| `value` | `string[]` | 当前输入值数组，传入后为受控模式 |
| `defaultValue` | `string[]` | 默认输入值数组，非受控模式使用 |
| `label` | `React.ReactNode` | 输入框上方标题 |
| `placeholder` | `string` | 默认占位文案 |
| `disabled` | `boolean` | 是否禁用 |
| `maxlength` | `number` | 单项最大输入长度 |
| `className` | `string` | 根节点自定义类名 |
| `itemClassName` | `string` | 每一项自定义类名 |
| `inputClassName` | `string` | 输入框自定义类名 |
| `onChange` | `(value, payload) => void` | 输入变化回调 |

## 样式定制

组件默认样式已经包含微信绿选中态。需要局部覆盖时，可以通过 `className` 和 `optionClassName` 添加自定义类名：

```tsx
<SingleChoice
  className="answer-choice"
  optionClassName="answer-choice__item"
  options={options}
/>
```
