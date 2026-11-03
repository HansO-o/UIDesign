# Selection components

A small, controlled selection component pair. `SingleSelectList` is a radio list; `SegmentedSelector` has equal-width options, tap/click and a draggable indicator. Drag previews continuously and commits the nearest enabled option on release. Disabled options cannot be selected. Both require a unique `value` for each option and a group `label`.

```tsx
const [value, setValue] = useState('week');
<SegmentedSelector label="Time range" value={value} onValueChange={setValue}
  options={[{value:'day', label:'Day'}, {value:'week', label:'Week'}, {value:'month', label:'Month'}]} />
```

Import `src/index.web.tsx` for React DOM and include its `styles.css`. Import `src/index.native.tsx` for React Native (or use React Native's platform file resolution with a package entry pointing to `src/index`). Both depend on React; the native variant additionally depends on React Native. They are source files, not a prebuilt npm package. No gesture library is required. The native drag uses PanResponder on the JavaScript thread, so it is not equivalent to a UI-thread gesture under heavy JS load; for that guarantee, integrate Reanimated and Gesture Handler and test on target devices. Web uses Pointer Events and native radios; keyboard users get native radio navigation and a visible focus ring. Native radios expose roles, checked and disabled states to accessibility services. Each segment also supports ordinary tapping and screen-reader activation.

The web component assumes left-to-right layout. The native control uses horizontal gesture deltas and requires device-specific RTL, screen-reader and scroll-conflict validation. A selected value should match an enabled option, and the parent must update `value` in response to `onValueChange`. Empty options render nothing. Styling is intentionally minimal and can be customized. Neither platform implementation has been tested in a running host app in this workspace.

## Verification

`node tests/math.test.mjs` checks selection math on Node 22.18+ (native TypeScript stripping). Both platform entry points were also transpiled with esbuild with React and React Native externalized. This is a syntax/bundle check, not a type check or interactive browser/device test.
