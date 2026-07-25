import type { QuestionComponentType } from '@/common/constants';

export type CountdownTime = string | number | Date;
export type CountdownDuration = [CountdownTime, CountdownTime];

export type ChoiceOptionConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
  image?: string;
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
  imageAlt?: string;
};

export type MatrixRowConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
};

export type MatrixColumnConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type AnswerConfig = {
  type: QuestionComponentType;
  questionId: string;
  questionText: string;
  description?: string;
  options?: ChoiceOptionConfig[];
  placeholder?: string;
  defaultValue?: string | number | Array<string | number> | null;
  disabled?: boolean;
  required?: boolean;
  maxlength?: number;
  min?: number;
  max?: number;
  requiredMessage?: string;
  errorMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  rows?: number | MatrixRowConfig[];
  autoHeight?: boolean;
  mode?: 'date' | 'datetime';
  items?: Array<{
    label: string;
    placeholder?: string;
    disabled?: boolean;
  }>;
  start?: string;
  end?: string;
  fields?: 'year' | 'month' | 'day';
  images?: Array<{
    src: string;
    title?: string;
    description?: string;
    mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
    alt?: string;
  }>;
  preview?: boolean;
  src?: string;
  poster?: string;
  videos?: Array<{
    src: string;
    title?: string;
    description?: string;
    poster?: string;
  }>;
  columns?: MatrixColumnConfig[];
  lowLabel?: string;
  highLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
};

export type InterviewItem = {
  id: number;
  role?: string;
  content?: string;
  duration?: CountdownDuration;
  config: AnswerConfig | null;
};

export type InterviewAnswerSubmitValue = {
  questionId: string;
  value: unknown;
};
