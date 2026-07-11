import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactSection } from "./ContactSection";
import { FAQSection } from "../faq/FAQSection";

describe("FAQ and contact interactions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens music FAQ initially and toggles an independent row", () => {
    render(<FAQSection />);

    expect(screen.getByRole("button", { name: /关于音乐/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const fileRow = screen.getByRole("button", { name: /关于文件暂存/ });
    fireEvent.click(fileRow);
    expect(fileRow).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /关于音乐/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("copies the email and shows a success toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ContactSection />);

    fireEvent.click(screen.getByRole("button", { name: /easynotch@163.com/ }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("easynotch@163.com"));
    expect(await screen.findByRole("status")).toHaveTextContent("邮箱复制成功");
  });

  it("uses the textarea fallback when clipboard permission is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ContactSection />);

    fireEvent.click(screen.getByRole("button", { name: /easynotch@163.com/ }));

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith("copy"));
    expect(await screen.findByRole("status")).toHaveTextContent("邮箱复制成功");
  });
});
