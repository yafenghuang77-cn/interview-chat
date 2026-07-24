import type { ImageProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** ImageDisplay 对应的题目类型常量。 */
export type ImageDisplayType = typeof QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY;

/** 图片展示组件中单张图片的配置。 */
export interface ImageDisplayImage {
  src: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  mode?: ImageProps['mode'];
  alt?: string;
}

/** Image Display 组件提交给业务层的数据结构。 */
export interface ImageDisplaySubmitValue {
  questionId: string;
  value: ImageDisplayImage[];
}

/** Image Display 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface ImageDisplayRef {
  init: (value?: ImageDisplayImage[]) => void;
  getSubmitValue: () => ImageDisplaySubmitValue;
}

/** 图片展示组件。用于图片列表展示和原生图片预览。 */
export interface ImageDisplayProps {
  type?: ImageDisplayType;
  questionId: string;
  images: ImageDisplayImage[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  preview?: boolean;
  className?: string;
  imageClassName?: string;
}
