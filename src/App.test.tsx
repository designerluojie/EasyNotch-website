import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App shell", () => {
  it("renders the Figma hero content and navigation", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "随手可用的效率入口" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "立即体验Demo" })).toHaveLength(2);
    expect(document.querySelectorAll(".star-border-container")).toHaveLength(2);
  });
});
