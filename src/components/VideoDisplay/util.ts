import Taro from '@tarojs/taro';
import type React from 'react';
import type { VideoDisplayVideo } from './type';

export const FIRST_FRAME_TIME = 0.1;
const FIRST_FRAME_TIMEOUT = 5000;

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getVideoPoster = (poster?: string): string | undefined => poster || undefined;

export const normalizeVideos = (
  videos: VideoDisplayVideo[] | undefined,
  src: string | undefined,
  poster: string | undefined,
  title: React.ReactNode,
  description: React.ReactNode,
): VideoDisplayVideo[] => {
  if (videos && videos.length > 0) {
    return videos;
  }

  return src
    ? [
        {
          src,
          poster,
          title,
          description,
        },
      ]
    : [];
};

export const getVideoPreviewOptions = (
  videos: VideoDisplayVideo[],
  currentIndex: number,
  posterMap: Record<string, string> = {},
): {
  sources: Array<{ url: string; type: 'video'; poster?: string }>;
  current: number;
} => {
  const previewVideos = videos.filter(item => item.src);
  const currentVideo = videos[currentIndex];
  const current = previewVideos.findIndex(item => item === currentVideo);

  return {
    sources: previewVideos.map(item => ({
      url: item.src,
      type: 'video' as const,
      poster: getVideoPoster(item.poster) || posterMap[item.src],
    })),
    current: current >= 0 ? current : 0,
  };
};

export const previewVideos = (
  videos: VideoDisplayVideo[],
  currentIndex: number,
  posterMap: Record<string, string> = {},
): Promise<boolean> => {
  const { sources, current } = getVideoPreviewOptions(videos, currentIndex, posterMap);
  const previewMedia = Taro.previewMedia as typeof Taro.previewMedia | undefined;

  if (sources.length === 0 || !previewMedia) {
    return Promise.resolve(false);
  }

  return previewMedia({
    sources,
    current,
  })
    .then(() => true)
    .catch(() => false);
};

export const createFirstFramePoster = (src: string): Promise<string | null> => {
  if (typeof document === 'undefined' || !src) {
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let settled = false;

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);

      window.clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
    };

    const finish = (poster: string | null) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve(poster);
    };

    const drawFrame = () => {
      const { videoWidth, videoHeight } = video;

      if (!context || videoWidth <= 0 || videoHeight <= 0) {
        finish(null);
        return;
      }

      try {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        finish(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        finish(null);
      }
    };

    function handleLoadedMetadata() {
      const duration = Number.isFinite(video.duration) ? video.duration : FIRST_FRAME_TIME;
      const targetTime = Math.min(FIRST_FRAME_TIME, Math.max(0, duration));

      try {
        video.currentTime = targetTime;
      } catch {
        drawFrame();
      }
    }

    function handleLoadedData() {
      if (video.currentTime === 0) {
        drawFrame();
      }
    }

    function handleSeeked() {
      drawFrame();
    }

    function handleError() {
      finish(null);
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);

    const timer = window.setTimeout(() => finish(null), FIRST_FRAME_TIMEOUT);
    video.src = src;
    video.load();
  });
};
