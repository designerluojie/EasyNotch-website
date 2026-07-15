import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    expect(document.querySelectorAll(".spotlight-card")).toHaveLength(1);
  });

  it("renders the FAQ section with expandable feature answers", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "功能问题解答" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "关于音乐" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Notch 可以把音乐控制放在 Mac 顶部入口里/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "关于文件暂存" }));
    expect(screen.getByRole("button", { name: "关于音乐" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "关于文件暂存" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/你可以把文件、多个文件或文件夹临时拖进 Notch/)).toBeInTheDocument();
  });

  it("renders the contact section and copies the developer email", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<App />);

    const email = screen.getByRole("button", { name: /easynotch@163.com/ });
    expect(email).toBeInTheDocument();
    fireEvent.click(email);

    expect(writeText).toHaveBeenCalledWith("easynotch@163.com");
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("复制成功");
    });
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
    expect(screen.getByTestId("clipboard-grid")).toHaveClass("showcase-notch__clipboard-grid--swipe-hint");

    fireEvent.click(screen.getByRole("tab", { name: "番茄钟" }));

    expect(panel).toHaveAttribute("data-active-tab", "tomato");
    expect(panel).toHaveAttribute("data-panel-height", "222");
    expect(screen.getByText("今日已累计专注 25 分钟")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "更多..." }));
    expect(panel).toHaveAttribute("data-active-tab", "more");
    expect(panel).toHaveAttribute("data-panel-height", "90");
    expect(screen.getByText("更多功能开发中")).toBeInTheDocument();
    expect(screen.queryByText("周杰伦-太阳之子")).not.toBeInTheDocument();
  });

  it("matches the tomato timer geometry from the showcase design", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "番茄钟" }));

    const content = screen.getByTestId("tomato-content");
    const timer = screen.getByTestId("tomato-timer");
    const pause = screen.getByRole("button", { name: "暂停" });
    const stop = screen.getByRole("button", { name: "停止专注" });

    expect(getComputedStyle(content).borderRadius).toBe("21px");
    expect(getComputedStyle(timer).width).toBe("90px");
    expect(getComputedStyle(timer).height).toBe("90px");
    expect(getComputedStyle(pause).width).toBe("51px");
    expect(getComputedStyle(pause).height).toBe("19.5px");
    expect(getComputedStyle(stop).width).toBe("66px");
    expect(getComputedStyle(stop).height).toBe("23.25px");
    const ring = screen.getByTestId("tomato-ring");
    expect(ring.tagName).toBe("svg");
    expect(ring.querySelector("circle")).toHaveClass("showcase-notch__tomato-ring-track");
    expect(ring.querySelector(".showcase-notch__tomato-ring-progress")).toHaveAttribute("pathLength", "1");
  });

  it("runs the tomato timer for one minute and then resets", () => {
    vi.useFakeTimers();

    try {
      render(<App />);
      fireEvent.click(screen.getByRole("tab", { name: "番茄钟" }));

      expect(screen.getByTestId("tomato-time")).toHaveTextContent("25:00");
      act(() => vi.advanceTimersByTime(1_000));
      expect(screen.getByTestId("tomato-time")).toHaveTextContent("24:59");
      act(() => vi.advanceTimersByTime(59_000));
      expect(screen.getByTestId("tomato-time")).toHaveTextContent("25:00");
    } finally {
      vi.useRealTimers();
    }
  });

  it("matches the AI Chat content structure from the showcase design", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      fireEvent.click(screen.getByRole("tab", { name: "AI Chat" }));
      act(() => vi.advanceTimersByTime(10_000));

      const ai = screen.getByTestId("showcase-ai-content");
      expect(ai).toHaveClass("showcase-notch__ai");
      const conversation = screen.getByTestId("ai-conversation");
      expect(conversation).toBeInTheDocument();
      expect(getComputedStyle(conversation).top).toBe("0px");
      expect(getComputedStyle(conversation).bottom).toBe("auto");
      expect(getComputedStyle(screen.getByTestId("ai-user-row")).marginTop).toBe("6px");
      const userBubble = screen.getByTestId("ai-user-bubble");
      expect(userBubble).toHaveTextContent("淘金小镇讲述的是哪里的故事");
      expect(getComputedStyle(userBubble).top).toBe("1.5px");
      expect(screen.getByTestId("ai-answer-text")).toHaveTextContent(
        "“淘金小镇”并不是一个严格指代某一个具体地点的专有名称",
      );
      expect(screen.getByRole("list", { name: "核心来源" })).toHaveTextContent(
        "大量移民（包括中国劳工）涌入",
      );
      expect(screen.getByTestId("ai-scroll-indicator")).toHaveClass(
        "showcase-notch__ai-scroll-indicator--fade-in",
      );
      expect(screen.getByTestId("ai-input-box")).toBeInTheDocument();
      expect(getComputedStyle(screen.getByTestId("ai-answer-text").querySelector("p")!).marginBottom).toBe("7px");
      expect(screen.getByText("DeepSeek-V4-Flash")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "发送" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("types the AI answer progressively after switching to AI Chat", () => {
    vi.useFakeTimers();

    try {
      render(<App />);
      fireEvent.click(screen.getByRole("tab", { name: "AI Chat" }));

      const answer = screen.getByTestId("ai-answer-text");
      expect(answer).toHaveTextContent("");
      expect(screen.queryByTestId("ai-scroll-indicator")).not.toBeInTheDocument();

      act(() => vi.advanceTimersByTime(900));
      expect(answer.textContent).toBe("");

      act(() => vi.advanceTimersByTime(180));
      expect(answer.textContent?.length).toBeGreaterThan(0);
      expect(answer.textContent).not.toContain("后来被广泛用于文化叙事和隐喻表达");

      act(() => vi.advanceTimersByTime(10_000));
      expect(answer).toHaveTextContent("后来被广泛用于文化叙事和隐喻表达");
      expect(screen.getByTestId("ai-scroll-indicator")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("matches the clipboard card layout from the showcase design", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "剪贴板" }));

    const grid = screen.getByTestId("clipboard-grid");
    const cards = screen.getAllByTestId("clipboard-card");
    expect(cards).toHaveLength(6);
    expect(getComputedStyle(grid).gap).toBe("3px");
    expect(getComputedStyle(cards[0]).width).toBe("72px");
    expect(getComputedStyle(cards[0]).height).toBe("82.5px");
    expect(getComputedStyle(cards[0]).boxSizing).toBe("border-box");
    expect(screen.getByText("感谢您的关注，期待与您进一步沟通。")).toBeInTheDocument();
    expect(getComputedStyle(screen.getByText(/希望这封邮件能找到你/)).webkitLineClamp).toBe("5");
    expect(getComputedStyle(screen.getByTestId("clipboard-grid").querySelector(".showcase-notch__clipboard-content--image img")!).width).toBe("52.5px");
  });

  it("does not animate the notch height for a same-height music-to-file switch", () => {
    render(<App />);

    const shell = screen.getByTestId("notch-shell");
    fireEvent.click(screen.getByRole("tab", { name: "文件暂存" }));

    expect(shell).toHaveAttribute("data-active-tab", "file");
    expect(shell).toHaveAttribute("data-height", "90");
    expect(shell).toHaveAttribute("data-visual-height", "90");
    expect(screen.getByTestId("file-swipe-hint")).toHaveClass("showcase-notch__file-grid--swipe-hint");
  });

  it("moves the simulated top tab indicator with the selected feature", () => {
    render(<App />);

    const topTabs = screen.getByTestId("notch-top-tabs");
    const indicator = screen.getByTestId("notch-top-tab-indicator");

    expect(topTabs).toHaveAttribute("data-active-top-tab", "music");
    expect(indicator).toHaveStyle({ transform: "translateX(0px)" });

    fireEvent.click(screen.getByRole("tab", { name: "文件暂存" }));
    expect(topTabs).toHaveAttribute("data-active-top-tab", "file");
    expect(indicator).toHaveStyle({ transform: "translateX(41px)" });

    fireEvent.click(screen.getByRole("tab", { name: "AI Chat" }));
    expect(topTabs).toHaveAttribute("data-active-top-tab", "more");
    expect(indicator).toHaveStyle({ transform: "translateX(82px)" });
  });
});
