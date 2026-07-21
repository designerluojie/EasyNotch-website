/**
 * Umami 埋点的薄封装。
 *
 * 与 macOS App 共用同一个 website：App 只发自定义事件、从不发 pageview，
 * 因此 Umami 概览页的访客/浏览量是纯官网数据，行为类别里则按事件名区分两边。
 *
 * 追踪脚本在 index.html 里以 defer 加载，可能尚未就绪或被网络拦截，
 * 因此这里始终做存在性判断——埋点失败绝不能影响下载本身。
 */

type UmamiTracker = {
  track: (eventName: string, eventData?: Record<string, string>) => void;
};

function getTracker(): UmamiTracker | null {
  const tracker = (window as unknown as { umami?: UmamiTracker }).umami;
  return tracker && typeof tracker.track === "function" ? tracker : null;
}

export function trackEvent(
  eventName: string,
  eventData?: Record<string, string>,
): void {
  try {
    getTracker()?.track(eventName, eventData);
  } catch {
    // 静默失败：统计出问题不该波及页面功能
  }
}

/** 点击下载按钮。`available` 区分真实下载与「暂未开放」的空点击。 */
export function trackDownloadClick(available: boolean): void {
  trackEvent("download_clicked", {
    available: String(available),
  });
}
