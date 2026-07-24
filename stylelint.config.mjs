/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-less',
  ],
  rules: {
    // 选择器命名：强制使用 kebab-case（蚂蚁金服规范）
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: '类名请使用 BEM 风格的 kebab-case，例如 .block__element--modifier' },
    ],

    // 禁止使用颜色名称，必须使用 hex/rgb（蚂蚁金服设计规范）
    'color-named': 'never',

    // 禁止 !important（除非必要）
    'declaration-no-important': true,

    // Less 变量命名：使用 kebab-case
    'custom-property-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      { message: 'CSS 变量请使用 kebab-case 命名' },
    ],

    // 属性书写顺序（可选，蚂蚁推荐）
    'declaration-block-no-duplicate-properties': true,

    // 允许 Less 的 at-rule（@mixin、@include 等）
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['mixin', 'include', 'extend', 'each', 'for', 'while', 'function', 'return', 'if', 'else'],
    }],
  },
};
