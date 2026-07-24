import type { ImageProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type ImageDisplayType = typeof QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY;

export interface ImageDisplayImage {
  src: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  mode?: ImageProps['mode'];
  alt?: string;
}

export interface ImageDisplayProps {
  type?: ImageDisplayType;
  images: ImageDisplayImage[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  preview?: boolean;
  className?: string;
  imageClassName?: string;
}
