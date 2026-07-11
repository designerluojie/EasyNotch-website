import { MODULE_TARGETS } from "../../types/modules";
import type { ModuleId, ModuleSize } from "../../types/modules";

export type NotchShellState = {
  active: ModuleId;
  pending: ModuleId | null;
  targetSize: ModuleSize;
};

export function createNotchState(active: ModuleId = "music"): NotchShellState {
  return {
    active,
    pending: null,
    targetSize: MODULE_TARGETS[active],
  };
}

export function switchModule(
  _state: NotchShellState,
  next: ModuleId,
): NotchShellState {
  return {
    active: next,
    pending: null,
    targetSize: MODULE_TARGETS[next],
  };
}
