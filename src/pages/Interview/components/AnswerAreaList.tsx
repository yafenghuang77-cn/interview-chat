import React, { useEffect, useImperativeHandle } from 'react';
import { Text, View } from '@tarojs/components';
import {
  BidirectionalRating,
  DateBlank,
  EmailBlank,
  ImageDisplay,
  ImageMultiChoice,
  ImageSingleChoice,
  MatrixBidirectionalRating,
  MatrixMultiChoice,
  MatrixRating,
  MatrixSingleChoice,
  MultiBidirectionalRating,
  MultiBlank,
  MultiChoice,
  MultiRating,
  NpsRating,
  NumberBlank,
  PhoneBlank,
  Rating,
  SingleChoice,
  TextBlank,
  VideoDisplay,
} from '@/components';
import { QUESTION_COMPONENT_TYPE } from '@/common/constants';
import type { AnswerConfig, InterviewAnswerSubmitValue } from '../types';
import './AnswerAreaList.less';

export type AnswerAreaListRef = {
  getSubmitValue: () => InterviewAnswerSubmitValue | null;
  isComplete: () => boolean;
};

type AnswerComponentRef = {
  getSubmitValue: () => InterviewAnswerSubmitValue;
};

interface AnswerAreaListProps {
  options: AnswerConfig;
  disabled?: boolean;
  onCompleteChange?: (complete: boolean) => void;
}

const AnswerAreaList = React.forwardRef<AnswerAreaListRef, AnswerAreaListProps>((props, ref) => {
  const { options, disabled = false, onCompleteChange } = props;
  const answerDisabled = disabled || Boolean(options.disabled);
  const answerRef = React.useRef<AnswerComponentRef | null>(null);
  const setAnswerRef = React.useCallback((nextRef: AnswerComponentRef | null) => {
    answerRef.current = nextRef;
  }, []);

  const getRowCount = React.useCallback(
    (): number => (Array.isArray(options.rows) ? options.rows.length : 0),
    [options.rows],
  );

  const hasValue = (value: unknown): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    if (Array.isArray(value)) {
      return value.length > 0 && value.every(item => hasValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.values(value).some(item => hasValue(item));
    }

    return value !== null && value !== undefined;
  };

  const isEveryRowAnswered = React.useCallback(
    (value: unknown): boolean => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
      }

      const rowCount = getRowCount();

      return rowCount > 0 && Object.values(value).filter(item => hasValue(item)).length >= rowCount;
    },
    [getRowCount],
  );

  const isAnswerValueComplete = React.useCallback(
    (value: unknown): boolean => {
      switch (options.type) {
        case QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY:
        case QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY:
          return true;

        case QUESTION_COMPONENT_TYPE.MULTI_RATING:
        case QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING:
        case QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE:
        case QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE:
        case QUESTION_COMPONENT_TYPE.MATRIX_RATING:
        case QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING:
          return isEveryRowAnswered(value);

        default:
          return hasValue(value);
      }
    },
    [isEveryRowAnswered, options.type],
  );

  const isAnswerComplete = React.useCallback((): boolean => {
    const submitValue = answerRef.current?.getSubmitValue();

    return isAnswerValueComplete(submitValue?.value);
  }, [isAnswerValueComplete]);

  const emitValueCompleteChange = React.useCallback(
    (value: unknown, valid = true) => {
      onCompleteChange?.(valid && isAnswerValueComplete(value));
    },
    [isAnswerValueComplete, onCompleteChange],
  );

  const emitCurrentCompleteChange = React.useCallback(() => {
    onCompleteChange?.(isAnswerComplete());
  }, [isAnswerComplete, onCompleteChange]);

  useEffect(() => {
    emitCurrentCompleteChange();
  }, [emitCurrentCompleteChange]);

  useImperativeHandle(
    ref,
    () => ({
      getSubmitValue: () => answerRef.current?.getSubmitValue() || null,
      isComplete: isAnswerComplete,
    }),
    [isAnswerComplete],
  );

  const normalizeChoiceOptions = () =>
    (options.options || []).map((item, index) => ({
      ...item,
      value: item.value ?? item.id ?? index,
    }));

  const getDefaultTextValue = (): string =>
    typeof options.defaultValue === 'string' ? options.defaultValue : '';

  const getDefaultChoiceValue = (): string | number | null =>
    typeof options.defaultValue === 'string' || typeof options.defaultValue === 'number'
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

  const normalizeNumericOptionValue = (
    value: string | number | undefined,
    fallback: number,
  ): number => {
    const nextValue = Number(value);

    return Number.isFinite(nextValue) ? nextValue : fallback;
  };

  const normalizeRatingOptions = (fallbackStart = 1) => {
    const ratingOptions =
      options.columns && options.columns.length > 0 ? options.columns : options.options || [];

    return ratingOptions.map((item, index) => ({
      ...item,
      value: normalizeNumericOptionValue(item.value ?? item.id, index + fallbackStart),
    }));
  };

  const renderItem = (type: string) => {
    switch (type) {
      case QUESTION_COMPONENT_TYPE.SINGLE_CHOICE:
        return (
          <SingleChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeChoiceOptions()}
            defaultValue={getDefaultChoiceValue()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_CHOICE:
        return (
          <MultiChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeChoiceOptions()}
            defaultValue={getDefaultChoiceValues()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_SINGLE_CHOICE:
        return (
          <ImageSingleChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeChoiceOptions().map(item => ({
              ...item,
              image: item.image || '',
            }))}
            defaultValue={getDefaultChoiceValue()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_MULTI_CHOICE:
        return (
          <ImageMultiChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeChoiceOptions().map(item => ({
              ...item,
              image: item.image || '',
            }))}
            defaultValue={getDefaultChoiceValues()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.TEXT_BLANK:
        return (
          <TextBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={answerDisabled}
            maxlength={options.maxlength}
            rows={getTextBlankRows()}
            autoHeight={options.autoHeight}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.PHONE_BLANK:
        return (
          <PhoneBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={answerDisabled}
            required={options.required}
            maxlength={options.maxlength}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
            onChange={(value, payload) => emitValueCompleteChange(value, payload.valid)}
          />
        );

      case QUESTION_COMPONENT_TYPE.EMAIL_BLANK:
        return (
          <EmailBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={answerDisabled}
            required={options.required}
            maxlength={options.maxlength}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
            onChange={(value, payload) => emitValueCompleteChange(value, payload.valid)}
          />
        );

      case QUESTION_COMPONENT_TYPE.NUMBER_BLANK:
        return (
          <NumberBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            placeholder={options.placeholder}
            defaultValue={getDefaultTextValue()}
            disabled={answerDisabled}
            required={options.required}
            maxlength={options.maxlength}
            min={options.min}
            max={options.max}
            requiredMessage={options.requiredMessage}
            errorMessage={options.errorMessage}
            minMessage={options.minMessage}
            maxMessage={options.maxMessage}
            onChange={(value, payload) => emitValueCompleteChange(value, payload.valid)}
          />
        );

      case QUESTION_COMPONENT_TYPE.DATE_BLANK:
        return (
          <DateBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            placeholder={options.placeholder}
            defaultValue={getDefaultChoiceValue()?.toString() || null}
            mode={options.mode}
            disabled={answerDisabled}
            start={options.start}
            end={options.end}
            fields={options.fields}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_BLANK:
        return (
          <MultiBlank
            ref={setAnswerRef}
            questionId={options.questionId}
            items={options.items || []}
            placeholder={options.placeholder}
            defaultValue={getDefaultMultiBlankValue()}
            disabled={answerDisabled}
            maxlength={options.maxlength}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY:
        return (
          <ImageDisplay
            ref={setAnswerRef}
            questionId={options.questionId}
            images={options.images || []}
            preview={options.preview}
          />
        );

      case QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY:
        return options.src || (options.videos && options.videos.length > 0) ? (
          <VideoDisplay
            ref={setAnswerRef}
            questionId={options.questionId}
            videos={options.videos}
            src={options.src}
            poster={options.poster}
            description={options.description}
          />
        ) : null;

      case QUESTION_COMPONENT_TYPE.RATING:
        return (
          <Rating
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeRatingOptions()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.NPS:
        return (
          <NpsRating
            ref={setAnswerRef}
            questionId={options.questionId}
            options={normalizeRatingOptions(0)}
            lowLabel={options.lowLabel}
            highLabel={options.highLabel}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.BIDIRECTIONAL_RATING:
        return (
          <BidirectionalRating
            ref={setAnswerRef}
            questionId={options.questionId}
            columns={normalizeMatrixRatingColumns()}
            leftLabel={options.leftLabel}
            rightLabel={options.rightLabel}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_RATING:
        return (
          <MultiRating
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING:
        return (
          <MultiBidirectionalRating
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            leftLabel={options.leftLabel}
            rightLabel={options.rightLabel}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE:
        return (
          <MatrixSingleChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixColumns()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE:
        return (
          <MatrixMultiChoice
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixColumns()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_RATING:
        return (
          <MatrixRating
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
          />
        );

      case QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING:
        return (
          <MatrixBidirectionalRating
            ref={setAnswerRef}
            questionId={options.questionId}
            rows={normalizeMatrixRows()}
            columns={normalizeMatrixRatingColumns()}
            leftLabel={options.leftLabel}
            rightLabel={options.rightLabel}
            disabled={answerDisabled}
            onChange={value => emitValueCompleteChange(value)}
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
});

AnswerAreaList.displayName = 'AnswerAreaList';

export default AnswerAreaList;
