import { fireEvent, render, screen } from "@testing-library/react";
import { MODULE_LABELS } from "./moduleData";
import { switchModule } from "./notchState";
import { ModuleTabs } from "./ModuleTabs";

describe("notch module shell", () => {
  it("immediately targets the latest selected module", () => {
    const state = switchModule(
      { active: "music", pending: null, targetSize: { width: 290, height: 60 } },
      "aiChat",
    );

    expect(state.active).toBe("aiChat");
    expect(state.targetSize).toEqual({ width: 290, height: 200 });
    expect(state.pending).toBeNull();
  });

  it("marks the selected module and calls the selection handler", () => {
    const onSelect = vi.fn();
    render(<ModuleTabs activeModule="music" onSelectModule={onSelect} />);

    expect(screen.getByRole("tab", { name: MODULE_LABELS.music })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("tab", { name: MODULE_LABELS.aiChat }));
    expect(onSelect).toHaveBeenCalledWith("aiChat");
  });
});
