# Music Playback Loop Design

## Goal

Add a visual-only playback animation to the second-screen music Notch showcase. The module remains non-interactive: it starts automatically when rendered and does not respond to mouse input.

## Confirmed behavior

- Initial current time is `0:35`.
- Total time remains `4:12`.
- Initial progress remains the existing visual starting point, approximately `25%`.
- The progress bar moves continuously and linearly from the initial percentage toward `100%` over 60 seconds.
- The current-time label advances by exactly one second once per second.
- After the 60-second cycle completes, progress and current time return to the initial state and repeat.
- The current-time display formats seconds as `m:ss`, including a leading zero for seconds below 10.
- Existing Notch scaling, layout, assets, and static visual styling remain unchanged.

## Design

The music playback block owns a small playback state containing elapsed cycle seconds. React renders the current-time label from that state. The progress fill uses a CSS linear animation for continuous movement; JavaScript only advances the displayed time and resets the animation cycle through the same 60-second lifecycle. The timer is created in an effect and cleaned up on unmount so navigating away does not leave an active interval.

The implementation should keep playback constants close to the showcase component:

- `INITIAL_ELAPSED_SECONDS = 35`
- `CYCLE_SECONDS = 60`
- `INITIAL_PROGRESS_PERCENT = 25`
- `TOTAL_SECONDS = 252` for the static `4:12` label

The progress fill should expose a class or custom property for the animation rather than receiving a new inline width every second. This avoids visible stepping and keeps movement consistent across browsers.

## Data flow

1. Component mounts with elapsed cycle time `0`.
2. The rendered label is `INITIAL_ELAPSED_SECONDS + elapsed cycle seconds`.
3. A one-second interval increments elapsed cycle time.
4. When elapsed reaches `CYCLE_SECONDS`, it wraps to `0`.
5. The progress fill continuously animates from `INITIAL_PROGRESS_PERCENT` to `100%` over the same 60-second cycle and loops.
6. Component unmount clears the interval.

## Testing

- Unit test the time formatter for `0:35`, a normal increment, a minute boundary, and leading-zero seconds.
- Unit test the cycle update behavior so the state returns to the initial elapsed value after 60 ticks.
- Keep the existing showcase rendering assertions, including the current-time and progress elements.
- Run the full unit test suite, production build, and E2E checks.

## Scope exclusions

- No click, hover, pause, seek, or tab-switch interactions.
- No real audio playback.
- No changes to the first screen or other second-screen tabs.
