import React from 'react';
import { Image, View } from '@tarojs/components';
import type { ImageDisplayProps, ImageDisplayRef } from './type';
import { getImageKey, joinClassNames, previewImages } from './util';
import './style.less';

/**
 * 图片展示组件。用于图片列表展示和原生图片预览。
 */
const ImageDisplay = React.forwardRef<ImageDisplayRef, ImageDisplayProps>((props, ref) => {
  const {
    questionId,
    images,
    title,
    description,
    preview = true,
    className = '',
    imageClassName = '',
  } = props;
  const [innerImages, setInnerImages] = React.useState(images);

  React.useEffect(() => {
    setInnerImages(images);
  }, [images]);

  React.useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerImages(nextValue || []),
      getSubmitValue: () => ({
        questionId,
        value: innerImages,
      }),
    }),
    [innerImages, questionId],
  );

  return (
    <View className={joinClassNames(['image-display', className])}>
      {title && <View className="image-display__title">{title}</View>}
      {description && <View className="image-display__description">{description}</View>}
      <View className="image-display__list">
        {innerImages.map((item, index) => (
          <View key={getImageKey(item, index)} className="image-display__item">
            <Image
              className={joinClassNames([
                'image-display__image',
                preview && 'image-display__image--preview',
                imageClassName,
              ])}
              src={item.src}
              mode={item.mode || 'aspectFill'}
              ariaLabel={item.alt}
              onClick={() => {
                if (preview) {
                  previewImages(innerImages, index);
                }
              }}
            />
            {item.title && <View className="image-display__item-title">{item.title}</View>}
            {item.description && (
              <View className="image-display__item-description">{item.description}</View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
});

export default ImageDisplay;
export type {
  ImageDisplayImage,
  ImageDisplayProps,
  ImageDisplayRef,
  ImageDisplaySubmitValue,
  ImageDisplayType,
} from './type';
