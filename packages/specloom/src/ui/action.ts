// ============================================================
// ActionVM - Action ViewModel 操作関数
// ============================================================

import type { ActionVM } from "./types.js";

export const ActionVMHelper = {
  /** 単一アクションが許可されているか */
  isAllowed: (action: ActionVM) => action.allowed,
  /** 配列から許可されたアクションのみを抽出 */
  allowed: (actions: ActionVM[]) => actions.filter((a) => a.allowed),
  needsConfirm: (action: ActionVM) => !!action.confirm,
  confirmMsg: (action: ActionVM) => action.confirm,
  variant: (action: ActionVM) => action.ui?.variant,
  icon: (action: ActionVM) => action.ui?.icon,
};
