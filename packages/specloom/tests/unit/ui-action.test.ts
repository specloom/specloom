import { describe, it, expect } from "vitest";
import { ActionVMHelper } from "../../src/ui/action.js";
import type { ActionVM } from "../../src/ui/types.js";

describe("ActionVMHelper", () => {
  const createAction = (overrides?: Partial<ActionVM>): ActionVM => ({
    id: "edit",
    label: "編集",
    allowed: true,
    ...overrides,
  });

  it("allowed で許可されているか判定できる", () => {
    expect(ActionVMHelper.allowed(createAction({ allowed: true }))).toBe(true);
    expect(ActionVMHelper.allowed(createAction({ allowed: false }))).toBe(false);
  });

  it("needsConfirm で確認が必要か判定できる", () => {
    expect(ActionVMHelper.needsConfirm(createAction())).toBe(false);
    expect(
      ActionVMHelper.needsConfirm(createAction({ confirm: "本当に削除しますか？" }))
    ).toBe(true);
  });

  it("confirmMsg で確認メッセージを取得できる", () => {
    expect(ActionVMHelper.confirmMsg(createAction())).toBeUndefined();
    expect(
      ActionVMHelper.confirmMsg(createAction({ confirm: "本当に削除しますか？" }))
    ).toBe("本当に削除しますか？");
  });

  it("variant でUIバリアントを取得できる", () => {
    expect(ActionVMHelper.variant(createAction())).toBeUndefined();
    expect(
      ActionVMHelper.variant(createAction({ ui: { variant: "danger" } }))
    ).toBe("danger");
  });

  it("icon でアイコンを取得できる", () => {
    expect(ActionVMHelper.icon(createAction())).toBeUndefined();
    expect(
      ActionVMHelper.icon(createAction({ ui: { icon: "trash" } }))
    ).toBe("trash");
  });
});
