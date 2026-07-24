# 选择组件说明

本目录封装了 4 个选择类组件：

- `SingleChoice`：文字单选
- `MultiChoice`：文字多选
- `ImageSingleChoice`：图片单选，每个选项独占一行，布局为上方图片、下方选项
- `ImageMultiChoice`：图片多选，每个选项独占一行，布局为上方图片、下方选项

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
  index.ts
```

## 导入方式

推荐从 `@/components` 统一导入：

```tsx
import {
  SingleChoice,
  MultiChoice,
  ImageSingleChoice,
  ImageMultiChoice,
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

## 样式定制

组件默认样式已经包含微信绿选中态。需要局部覆盖时，可以通过 `className` 和 `optionClassName` 添加自定义类名：

```tsx
<SingleChoice
  className="answer-choice"
  optionClassName="answer-choice__item"
  options={options}
/>
```
