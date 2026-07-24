import React from 'react';
import { Text, View } from '@tarojs/components';
import {
  DateBlank,
  EmailBlank,
  ImageDisplay,
  ImageMultiChoice,
  ImageSingleChoice,
  MatrixBidirectionalRating,
  MatrixMultiChoice,
  MatrixRating,
  MatrixSingleChoice,
  MultiBlank,
  MultiChoice,
  NumberBlank,
  PhoneBlank,
  SingleChoice,
  TextBlank,
  VideoDisplay,
} from '@/components';
import { QUESTION_COMPONENT_TYPE, type QuestionComponentType } from '@/common/constants';
import './AnswerAreaList.less';

type ChoiceOptionConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
  image?: string;
  imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
  imageAlt?: string;
};

type MatrixRowConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
};

type MatrixColumnConfig = {
  id?: string | number;
  value?: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

type AnswerConfig = {
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
  leftLabel?: string;
  rightLabel?: string;
};

interface AnswerAreaListProps {
  options: AnswerConfig;
}

const AnswerAreaList: React.FC<AnswerAreaListProps> = props => {
  const { options } = props;

  const normalizeChoiceOptions = () =>
    (options.options || []).map((item, index) => ({
      ...item,
      value: item.value ?? item.id ?? index,
    }));

  const getDefaultTextValue = (): string =>
    typeof options.defaultValue === 'string' ? options.defaultValue : '';

  const getDefaultChoiceValue = (): string | number | null =>
    typeof options.defaultValue === 'string' ||
    typeof options.defaultValue === 'number'
      ? options.defaultValue
      : null;

  const getDefaultChoiceValues = (): Array<string | number> =>
    Array.isArray(options.defaultValue) ? options.defaultValue : [];

  const getDefaultMultiBlankValue = (): string[] | undefined =>
    Array.isArray(options.defaultValue)
      ? options.defaultValue.map(item => String(item))
      : undefined;

  const getTextBlankRows = (): number | undefined =>
    typeof options.rows === 'number' ? options.rows : undefined;

  const normalizeMatrixRows = () =>
    (Array.isArray(options.rows) ? options.rows : []).map((item, index) => ({
      ...item,
      value: item.value ?? item.id ?? index,
    }));

  const normalizeMatrixColumns = () =>
    (options.columns || []).map((item, index) => ({
      ...item,
      value: item.value ?? item.id ?? index,
    }));

  const normalizeMatrixRatingColumns = () =>
    (options.columns || []).map((item, index) => ({
      ...item,
      value: Number(item.value ?? item.id ?? index + 1) || index + 1,
    }));

  const renderItem = (type: string) => {
    switch (type) {
      case QUESTION_COMPONENT_TYPE.SINGLE_CHOICE:
        return (
          <SingleChoice
            options={normalizeChoiceOptions()}
            defaultValue={getDefaultChoiceValue()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_CHOICE:
        return (
          <MultiChoice
            options={normalizeChoiceOptions()}
            defaultValue={getDefaultChoiceValues()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_SINGLE_CHOICE:
        return (
          <ImageSingleChoice
            options={normalizeChoiceOptions().map(item => ({
              ...item,
              image: item.image || '',
            }))}
            defaultValue={getDefaultChoiceValue()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_MULTI_CHOICE:
        return (
          <ImageMultiChoice
            options={normalizeChoiceOptions().map(item => ({
              ...item,
              image: item.image || '',
            }))}
            defaultValue={getDefaultChoiceValues()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.TEXT_BLANK:
        return (
          <TextBlank
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={options.disabled}
            maxlength={options.maxlength}
            rows={getTextBlankRows()}
            autoHeight={options.autoHeight}
          />
        );

      case QUESTION_COMPONENT_TYPE.PHONE_BLANK:
        return (
          <PhoneBlank
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={options.disabled}
            required={options.required}
            maxlength={options.maxlength}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
          />
        );

      case QUESTION_COMPONENT_TYPE.EMAIL_BLANK:
        return (
          <EmailBlank
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={options.disabled}
            required={options.required}
            maxlength={options.maxlength}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
          />
        );

      case QUESTION_COMPONENT_TYPE.NUMBER_BLANK:
        return (
          <NumberBlank
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={options.disabled}
            required={options.required}
            maxlength={options.maxlength}
            min={options.min}
            max={options.max}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
            minMessage={options.minMessage}
            maxMessage={options.maxMessage}
          />
        );

      case QUESTION_COMPONENT_TYPE.DATE_BLANK:
        return (
          <DateBlank
            placeholder={options.placeholder}
            defaultValue={getDefaultChoiceValue()?.toString() || null}
            mode={options.mode}
            disabled={options.disabled}
            start={options.start}
            end={options.end}
            fields={options.fields}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_BLANK:
        return (
          <MultiBlank
            items={options.items || []}
            placeholder={options.placeholder}
            defaultValue={getDefaultMultiBlankValue()}
            disabled={options.disabled}
            maxlength={options.maxlength}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY:
        return (
          <ImageDisplay
            images={options.images || []}
            preview={options.preview}
          />
        );

      case QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY:
        return options.src || (options.videos && options.videos.length > 0) ? (
          <VideoDisplay
            videos={options.videos}
            src={options.src}
            poster={options.poster}
            description={options.description}
          />
        ) : null;

      case QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE:
        return (
          <MatrixSingleChoice
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixColumns()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE:
        return (
          <MatrixMultiChoice
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixColumns()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_RATING:
        return (
          <MatrixRating
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            disabled={options.disabled}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING:
        return (
          <MatrixBidirectionalRating
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            leftLabel={options.leftLabel}
            rightLabel={options.rightLabel}
            disabled={options.disabled}
          />
        );
    }
    return null;
  };

  return (
    <View className="answer-area-list">
      <Text className="answer-area-list__title">答题区</Text>
      {/* <View className="answer-area-list__divider" /> */}
      <Text className="answer-area-list__label">{options.questionText}</Text>
      <View>{renderItem(options.type)}</View>
    </View>
  );
};

export default AnswerAreaList;
