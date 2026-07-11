export const SITE_COPY = {
  productName: "EasyNotch",
  heroTitle: "随手可用的效率入口",
  heroDescription: [
    "常驻在Mac顶部的轻量工具箱，快速展开，用完即收起。",
    "让你的Macbook刘海，真正有用起来。",
  ],
  contactEmail: "easynotch@163.com",
  githubUrl: import.meta.env.VITE_GITHUB_URL || "https://github.com",
} as const;

export function getDownloadUrl(): string | null {
  const value = import.meta.env.VITE_DOWNLOAD_URL;
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}
