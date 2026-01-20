import { describe, it, expect } from "vitest";
import { ActionVMHelper } from "../../src/vm/action.js";
import type { ActionVM } from "../../src/vm/types.js";

describe("ActionVMHelper", () => {
  const createAction = (overrides?: Partial<ActionVM>): ActionVM => ({
    id: "edit",
    label: "編集",
    allowed: true,
    ...overrides,
  });

  it("isAllowed で単一アクションが許可されているか判定できる", () => {
    expect(ActionVMHelper.isAllowed(createAction({ allowed: true }))).toBe(
      true,
    );
    expect(ActionVMHelper.isAllowed(createAction({ allowed: false }))).toBe(
      false,
    );
  });

  it("allowed で配列から許可されたアクションのみを抽出できる", () => {
    const actions = [
      createAction({ id: "edit", allowed: true }),
      createAction({ id: "delete", allowed: false }),
      createAction({ id: "view", allowed: true }),
    ];
    const result = ActionVMHelper.allowed(actions);
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id)).toEqual(["edit", "view"]);
  });

  it("needsConfirm で確認が必要か判定できる", () => {
    expect(ActionVMHelper.needsConfirm(createAction())).toBe(false);
    expect(
      ActionVMHelper.needsConfirm(
        createAction({ confirm: "本当に削除しますか？" }),
      ),
    ).toBe(true);
  });

  it("confirmMsg で確認メッセージを取得できる", () => {
    expect(ActionVMHelper.confirmMsg(createAction())).toBeUndefined();
    expect(
      ActionVMHelper.confirmMsg(
        createAction({ confirm: "本当に削除しますか？" }),
      ),
    ).toBe("本当に削除しますか？");
  });

  it("variant でUIバリアントを取得できる", () => {
    expect(ActionVMHelper.variant(createAction())).toBeUndefined();
    expect(
      ActionVMHelper.variant(createAction({ ui: { variant: "danger" } })),
    ).toBe("danger");
  });

  it("icon でアイコンを取得できる", () => {
    expect(ActionVMHelper.icon(createAction())).toBeUndefined();
    expect(ActionVMHelper.icon(createAction({ ui: { icon: "trash" } }))).toBe(
      "trash",
    );
  });
});
