import React, { forwardRef, useImperativeHandle } from 'react';
import { Swiper, SwiperItem, Text, Video, View, Image, type SwiperProps } from '@tarojs/components';
import type { VideoDisplayProps, VideoDisplayRef, VideoDisplayVideo } from './type';
import {
  createFirstFramePoster,
  FIRST_FRAME_TIME,
  getVideoPoster,
  getVideoPreviewOptions,
  joinClassNames,
  normalizeVideos,
  previewVideos,
} from './util';
import './style.less';

const VideoDisplay = forwardRef<VideoDisplayRef, VideoDisplayProps>((props, ref) => {
  const { questionId, videos, src, title, description, poster, className = '' } = props;
  const [innerVideos, setInnerVideos] = React.useState<VideoDisplayVideo[] | null>(null);
  const videoList = innerVideos || normalizeVideos(videos, src, poster, title, description);
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null);
  const [firstFramePosters, setFirstFramePosters] = React.useState<Record<string, string>>({});

  const openPreview = async (index: number) => {
    const openedNativePreview = await previewVideos(videoList, index, firstFramePosters);

    if (!openedNativePreview) {
      const { current } = getVideoPreviewOptions(videoList, index, firstFramePosters);
      setPreviewIndex(current);
    }
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerVideos(nextValue || []),
      getSubmitValue: () => ({
        questionId,
        value: videoList,
      }),
    }),
    [questionId, videoList],
  );

  const handlePreviewChange: SwiperProps['onChange'] = event => {
    setPreviewIndex(event.detail.current);
  };

  React.useEffect(() => {
    let canceled = false;

    videoList.forEach(item => {
      if (!item.src || getVideoPoster(item.poster) || firstFramePosters[item.src]) {
        return;
      }

      void createFirstFramePoster(item.src).then(nextPoster => {
        if (canceled || !nextPoster) {
          return;
        }

        setFirstFramePosters(currentPosters => {
          if (currentPosters[item.src]) {
            return currentPosters;
          }

          return {
            ...currentPosters,
            [item.src]: nextPoster,
          };
        });
      });
    });

    return () => {
      canceled = true;
    };
  }, [firstFramePosters, videoList]);

  return (
    <View className={joinClassNames(['video-display', className])}>
      {title && <View className="video-display__title">{title}</View>}
      {description && <View className="video-display__description">{description}</View>}
      <View className="video-display__list">
        {videoList.map((item, index) => (
          <View key={`${item.src}-${index}`} className="video-display__frame">
            <View
              className="video-display__cover"
              onClick={() => {
                void openPreview(index);
              }}
            >
              {getVideoPoster(item.poster) || firstFramePosters[item.src] ? (
                <Image
                  className="video-display__cover-image"
                  src={getVideoPoster(item.poster) || firstFramePosters[item.src]}
                  mode="aspectFill"
                />
              ) : (
                <Video
                  className="video-display__cover-video"
                  src={item.src}
                  controls
                  autoplay={false}
                  muted
                  objectFit="cover"
                  initialTime={FIRST_FRAME_TIME}
                  showProgress={false}
                  showCenterPlayBtn={false}
                  showPlayBtn={false}
                  showFullscreenBtn={false}
                  showBottomProgress={false}
                  enableProgressGesture={false}
                  enablePlayGesture={false}
                  nativeProps={{
                    preload: 'metadata',
                    playsInline: true,
                    webkitPlaysinline: true,
                  }}
                  onClick={event => {
                    event.stopPropagation();
                    void openPreview(index);
                  }}
                />
              )}
              <View className="video-display__play">
                <Text>播放</Text>
              </View>
            </View>
            {item.title && <View className="video-display__item-title">{item.title}</View>}
            {item.description && (
              <View className="video-display__item-description">{item.description}</View>
            )}
          </View>
        ))}
      </View>
      {previewIndex !== null && (
        <View className="video-display__preview">
          <View className="video-display__preview-close" onClick={closePreview}>
            <Text>×</Text>
          </View>
          <Swiper
            className="video-display__preview-swiper"
            current={previewIndex}
            indicatorDots={videoList.length > 1}
            indicatorColor="rgba(255, 255, 255, 0.36)"
            indicatorActiveColor="#ffffff"
            onChange={handlePreviewChange}
          >
            {videoList.map((item, index) => (
              <SwiperItem
                key={`${item.src}-preview-${index}`}
                className="video-display__preview-item"
              >
                <View className="video-display__preview-media">
                  <Video
                    className="video-display__preview-video"
                    src={item.src}
                    poster={getVideoPoster(item.poster)}
                    controls
                    autoplay={index === previewIndex}
                    muted={false}
                    objectFit="contain"
                  />
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      )}
    </View>
  );
});

export default VideoDisplay;
export type {
  VideoDisplayProps,
  VideoDisplayRef,
  VideoDisplaySubmitValue,
  VideoDisplayType,
  VideoDisplayVideo,
} from './type';
