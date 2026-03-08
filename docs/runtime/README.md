# Runtime Guide

`specloom` runtime の主導線です。

## Current Surface

- loader:
  `parseSpec`, `validateSpec`
- state:
  `createFormState`, `createInputState`, `createListState`
- validation:
  `resolveFieldState`, `validateField`, `validateForm`
- view model:
  `createListVM`, `createShowVM`, `createFormVM`, `createInputVM`
- options:
  `createOptionsResolver`
- ui metadata:
  `createUiResolver`
- action:
  `buildActionRequest`
- filter:
  `evaluateFilter`, `filterRecords`, `applyNamedFilter`
- format:
  `formatValue`, `formatColumnValue`, `formatTemplate`
- serialize:
  `serializeForm`, `serializeResource`, `serializeInput`

## Pages

- [State](/Volumes/SSD/projects/specloom/docs/runtime/state.md)
- [Validation](/Volumes/SSD/projects/specloom/docs/runtime/validation.md)
- [Options](/Volumes/SSD/projects/specloom/docs/runtime/options.md)
- [UI Resolver](/Volumes/SSD/projects/specloom/docs/runtime/ui.md)

## Notes

- ViewModel は表示用です。状態更新は `State` helper を使います。
- UI component は同梱しません。
- backend 側でも validation / filter / action helper を再利用できます。
