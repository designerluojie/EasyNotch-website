import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App shell", () => {
  it("renders the page root", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
