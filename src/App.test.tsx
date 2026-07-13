import { act, fireEvent, render, screen } from "@testing-library/react";
import { App } from "./App";
import { vi } from "vitest";

describe("App shell", () => {
  it("renders the Figma hero content and navigation", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "随手可用的效率入口" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "立即体验Demo" })).toHaveLength(2);
    expect(document.querySelectorAll(".border-glow-card")).toHaveLength(1);
    expect(document.querySelectorAll(".star-border-container")).toHaveLength(1);
  });

  it("renders the second-screen music showcase as the only implemented module", () => {
    render(<App />);

    expect(
      screen.getByRole("region", { name: "Notch 功能展示" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("second-screen-mockup")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "MacBook Pro" })).toBeInTheDocument();
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-width", "435");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-height", "90");
    expect(screen.getByTestId("notch-shell")).toHaveClass("showcase-notch--laptop-scaled");
    expect(screen.getByTestId("notch-shell")).toHaveClass("showcase-notch--screen-aligned");
    expect(screen.getByTestId("notch-content")).toBeInTheDocument();
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-top-inset", "9");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-top-control-x", "5.85");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-top-control-y", "5.0625");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-bottom-radius", "27");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-tab-left", "16.5");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-settings-right", "16.5");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute("data-fill", "#000");
    expect(screen.getByTestId("notch-shell")).toHaveAttribute(
      "data-shadow",
      "0 12px 40px rgba(0, 0, 0, 0.25)",
    );
    expect(screen.getByTestId("notch-shape")).toHaveAttribute(
      "viewBox",
      "0 0 435 90",
    );
    expect(screen.getByRole("tab", { name: "音乐" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("淘金小镇")).toBeInTheDocument();
    expect(screen.getByText("周杰伦")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "歌曲封面" })).toHaveClass(
      "showcase-notch__cover--rounded",
    );
    expect(screen.getByRole("button", { name: "设置" })).toHaveClass(
      "showcase-notch__settings--centered",
    );
    expect(screen.getByRole("button", { name: "暂停" })).toHaveClass(
      "showcase-notch__pause--compact",
    );
  });

  it("advances the music playback label once per second and resets after one minute", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:35");

      act(() => vi.advanceTimersByTime(1_000));
      expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:36");

      act(() => vi.advanceTimersByTime(59_000));
      expect(screen.getByTestId("music-current-time")).toHaveTextContent("0:35");
    } finally {
      vi.useRealTimers();
    }
  });

  it("switches the showcase panel between static feature states", async () => {
    render(<App />);

    const settings = screen.getByRole("button", { name: "设置" });
    const panel = screen.getByTestId("showcase-notch-panel");

    expect(screen.getByRole("tab", { name: "音乐" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(panel).toHaveAttribute("data-active-tab", "music");
    expect(panel).toHaveAttribute("data-panel-height", "90");

    fireEvent.click(screen.getByRole("tab", { name: "AI Chat" }));

    expect(panel).toHaveAttribute("data-active-tab", "ai");
    expect(panel).toHaveAttribute("data-panel-height", "300");
    expect(screen.getByText("请输入")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "设置" })).toBe(settings);

    fireEvent.click(screen.getByRole("tab", { name: "剪贴板" }));

    expect(panel).toHaveAttribute("data-active-tab", "clipboard");
    expect(panel).toHaveAttribute("data-panel-height", "135");
    expect(screen.getByText("luojie@163.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "番茄钟" }));

    expect(panel).toHaveAttribute("data-active-tab", "tomato");
    expect(panel).toHaveAttribute("data-panel-height", "222");
    expect(screen.getByText("今日已累计专注 24 分钟")).toBeInTheDocument();
  });
});
