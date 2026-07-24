import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** VideoDisplay 对应的题目类型常量。 */
export type VideoDisplayType = typeof QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY;

/** 视频展示组件中单个视频的配置。 */
export interface VideoDisplayVideo {
  src: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  poster?: string;
}

/** Video Display 组件提交给业务层的数据结构。 */
export interface VideoDisplaySubmitValue {
  questionId: string;
  value: VideoDisplayVideo[];
}

/** Video Display 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface VideoDisplayRef {
  init: (value?: VideoDisplayVideo[]) => void;
  getSubmitValue: () => VideoDisplaySubmitValue;
}

/** 视频展示组件。用于视频列表展示和预览，未配置封面时尝试使用首帧作为封面。 */
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
