import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type VideoDisplayType = typeof QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY;

export interface VideoDisplayVideo {
  src: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  poster?: string;
}

export interface VideoDisplayProps {
  type?: VideoDisplayType;
  videos?: VideoDisplayVideo[];
  src?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  poster?: string;
  className?: string;
}
