// ============================================================
// ActionVM - Action ViewModel 操作関数
// ============================================================

import type { ActionVM } from "./types.js";

export const ActionVMHelper = {
  allowed: (action: ActionVM) => action.allowed,
  needsConfirm: (action: ActionVM) => !!action.confirm,
  confirmMsg: (action: ActionVM) => action.confirm,
  variant: (action: ActionVM) => action.ui?.variant,
  icon: (action: ActionVM) => action.ui?.icon,
};
