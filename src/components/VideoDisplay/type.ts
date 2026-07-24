import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type VideoDisplayType = typeof QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY;

export interface VideoDisplayVideo {
  src: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  poster?: string;
}

export interface VideoDisplaySubmitValue {
  questionId: string;
  value: VideoDisplayVideo[];
}

export interface VideoDisplayRef {
  init: (value?: VideoDisplayVideo[]) => void;
  getSubmitValue: () => VideoDisplaySubmitValue;
}

export interface VideoDisplayProps {
  type?: VideoDisplayType;
  questionId: string;
  videos?: VideoDisplayVideo[];
  src?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  poster?: string;
  className?: string;
}
