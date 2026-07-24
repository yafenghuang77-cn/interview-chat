import Taro from '@tarojs/taro';
import type { ImageDisplayImage } from './type';

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getImageKey = (image: ImageDisplayImage, index: number): string =>
  `${image.src}-${index}`;

export const getImagePreviewOptions = (
  images: ImageDisplayImage[],
  currentIndex: number,
): { urls: string[]; current: string | number } => {
  const previewImages = images.filter(item => item.src);
  const currentImage = images[currentIndex];
  const current = previewImages.findIndex(item => item === currentImage);
  const previewIndex = current >= 0 ? current : 0;
  const currentUrl = previewImages[previewIndex]?.src || '';
  const hasDuplicatedUrl =
    currentUrl !== '' && previewImages.filter(item => item.src === currentUrl).length > 1;

  return {
    urls: previewImages.map(item => item.src),
    current: hasDuplicatedUrl ? previewIndex : currentUrl,
  };
};

export const previewImages = (images: ImageDisplayImage[], currentIndex: number): void => {
  const { urls, current } = getImagePreviewOptions(images, currentIndex);

  if (urls.length === 0) {
    return;
  }

  Taro.previewImage({
    urls,
    current,
  });
};
