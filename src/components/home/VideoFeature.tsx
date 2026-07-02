"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * VideoFeature
 *
 * 自动播放策略：
 * - 使用 IntersectionObserver 监测视频区域进入视口（threshold 0.35）
 * - 进入视口时自动加载 iframe 并静音自动播放（autoplay=1&mute=1&loop=1&playlist=<id>）
 * - 未进入视口前只渲染缩略图 + 中央播放按钮，不加载 iframe（省流量）
 * - 用户主动点击播放按钮时切换为有声播放（后备：IO 触发的 autoplay 在部分浏览器/低电量模式可能被拦）
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  // 静音自动播放（loop 必须配 playlist 才能循环单视频）
  const embedUrlMuted = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
  // 用户主动点击：有声播放
  const embedUrlWithSound = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 进入视口（静音自动播放）或用户点击（有声播放）
  const shouldPlay = inView || userStarted;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {shouldPlay ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={userStarted ? embedUrlWithSound : embedUrlMuted}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setUserStarted(true)}
            className="absolute top-0 left-0 h-full w-full cursor-pointer group"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "1";
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
            <span className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                <Play className="ml-1 h-7 w-7 fill-white text-white md:h-9 md:w-9" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
