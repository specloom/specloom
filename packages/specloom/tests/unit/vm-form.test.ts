import { describe, it, expect } from "vitest";
import { FormVM } from "../../src/vm/form.js";
import type { FormViewModel } from "../../src/vm/types.js";

const createFormVM = (overrides?: Partial<FormViewModel>): FormViewModel => ({
  type: "form",
  resource: "Post",
  label: "投稿",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "テスト記事",
      required: true,
      readonly: false,
      errors: [],
      hint: "100文字以内",
      placeholder: "タイトルを入力",
      visible: true,
    },
    {
      name: "content",
      label: "本文",
      kind: "textarea",
      value: "本文です",
      required: false,
      readonly: false,
      errors: [],
      visible: true,
    },
    {
      name: "status",
      label: "ステータス",
      kind: "enum",
      value: "draft",
      required: true,
      readonly: false,
      errors: ["ステータスを選択してください"],
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開" },
      ],
      visible: true,
    },
    {
      name: "createdAt",
      label: "作成日",
      kind: "datetime",
      value: "2024-01-01",
      required: false,
      readonly: true,
      errors: [],
      visible: false,
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: true },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: false,
  isDirty: true,
  groups: [
    { id: "basic", label: "基本情報", fields: ["title", "content"] },
    { id: "meta", label: "メタ情報", fields: ["status", "createdAt"] },
  ],
  ...overrides,
});

describe("FormVM", () => {
  describe("フィールド操作", () => {
    it("fields で全フィールドを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.fields(vm)).toHaveLength(4);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createFormVM();
      const field = FormVM.field(vm, "title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("visibleFields で表示フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const visible = FormVM.visibleFields(vm);
      expect(visible).toHaveLength(3);
      expect(visible.map((f) => f.name)).not.toContain("createdAt");
    });

    it("requiredFields で必須フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const required = FormVM.requiredFields(vm);
      expect(required).toHaveLength(2);
      expect(required.map((f) => f.name)).toContain("title");
      expect(required.map((f) => f.name)).toContain("status");
    });

    it("readonlyFields で読み取り専用フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const readonly = FormVM.readonlyFields(vm);
      expect(readonly).toHaveLength(1);
      expect(readonly[0].name).toBe("createdAt");
    });
  });

  describe("値操作", () => {
    it("value で特定フィールドの値を取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.value(vm, "title")).toBe("テスト記事");
      expect(FormVM.value(vm, "status")).toBe("draft");
    });

    it("values で全値をオブジェクトで取得できる", () => {
      const vm = createFormVM();
      const values = FormVM.values(vm);
      expect(values.title).toBe("テスト記事");
      expect(values.content).toBe("本文です");
      expect(values.status).toBe("draft");
    });
  });

  describe("バリデーション状態", () => {
    it("valid でフォームが有効か判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.valid(vm)).toBe(false);

      const vmValid = createFormVM({ isValid: true });
      expect(FormVM.valid(vmValid)).toBe(true);
    });

    it("dirty でフォームに変更があるか判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.dirty(vm)).toBe(true);

      const vmClean = createFormVM({ isDirty: false });
      expect(FormVM.dirty(vmClean)).toBe(false);
    });

    it("errors でエラーのあるフィールド一覧を取得できる", () => {
      const vm = createFormVM();
      const errors = FormVM.errors(vm);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("status");
      expect(errors[0].errors).toContain("ステータスを選択してください");
    });

    it("fieldErrors で特定フィールドのエラーを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.fieldErrors(vm, "status")).toContain("ステータスを選択してください");
      expect(FormVM.fieldErrors(vm, "title")).toHaveLength(0);
    });

    it("hasError でフィールドにエラーがあるか判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.hasError(vm, "status")).toBe(true);
      expect(FormVM.hasError(vm, "title")).toBe(false);
    });
  });

  describe("UI補助情報", () => {
    it("hint でヒントを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.hint(vm, "title")).toBe("100文字以内");
      expect(FormVM.hint(vm, "content")).toBeUndefined();
    });

    it("placeholder でプレースホルダーを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.placeholder(vm, "title")).toBe("タイトルを入力");
      expect(FormVM.placeholder(vm, "content")).toBeUndefined();
    });

    it("visible でフィールドが表示されるか判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.visible(vm, "title")).toBe(true);
      expect(FormVM.visible(vm, "createdAt")).toBe(false);
    });

    it("required でフィールドが必須か判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.required(vm, "title")).toBe(true);
      expect(FormVM.required(vm, "content")).toBe(false);
    });

    it("readonly でフィールドが読み取り専用か判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.readonly(vm, "createdAt")).toBe(true);
      expect(FormVM.readonly(vm, "title")).toBe(false);
    });
  });

  describe("グループ操作", () => {
    it("groups でグループ一覧を取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.groups(vm)).toHaveLength(2);
    });

    it("groups でグループがない場合は空配列", () => {
      const vm = createFormVM({ groups: undefined });
      expect(FormVM.groups(vm)).toHaveLength(0);
    });

    it("fieldsInGroup でグループ内のフィールドを取得できる", () => {
      const vm = createFormVM();
      const basicFields = FormVM.fieldsInGroup(vm, "basic");
      expect(basicFields).toHaveLength(2);
      expect(basicFields.map((f) => f.name)).toContain("title");
      expect(basicFields.map((f) => f.name)).toContain("content");
    });

    it("fieldsInGroup で存在しないグループは空配列", () => {
      const vm = createFormVM();
      expect(FormVM.fieldsInGroup(vm, "nonexistent")).toHaveLength(0);
    });
  });

  describe("アクション操作", () => {
    it("actions でアクション一覧を取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.actions(vm)).toHaveLength(2);
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const vm = createFormVM({
        actions: [
          { id: "save", label: "保存", allowed: true },
          { id: "delete", label: "削除", allowed: false },
        ],
      });
      const allowed = FormVM.allowedActions(vm);
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("save");
    });

    it("canSubmit で送信可能か判定できる", () => {
      const vm = createFormVM({ isValid: true, isSubmitting: false });
      expect(FormVM.canSubmit(vm)).toBe(true);

      const vmInvalid = createFormVM({ isValid: false });
      expect(FormVM.canSubmit(vmInvalid)).toBe(false);

      const vmSubmitting = createFormVM({ isValid: true, isSubmitting: true });
      expect(FormVM.canSubmit(vmSubmitting)).toBe(false);
    });
  });

  describe("状態操作", () => {
    it("loading で読み込み中か判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.loading(vm)).toBe(false);

      const vmLoading = createFormVM({ isLoading: true });
      expect(FormVM.loading(vmLoading)).toBe(true);
    });

    it("submitting で送信中か判定できる", () => {
      const vm = createFormVM();
      expect(FormVM.submitting(vm)).toBe(false);

      const vmSubmitting = createFormVM({ isSubmitting: true });
      expect(FormVM.submitting(vmSubmitting)).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.error(vm)).toBeUndefined();

      const vmError = createFormVM({ error: "保存に失敗しました" });
      expect(FormVM.error(vmError)).toBe("保存に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.label(vm)).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.resource(vm)).toBe("Post");
    });

    it("mode でcreate/editを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.mode(vm)).toBe("edit");

      const vmCreate = createFormVM({ mode: "create" });
      expect(FormVM.mode(vmCreate)).toBe("create");
    });

    it("id でレコードIDを取得できる", () => {
      const vm = createFormVM();
      expect(FormVM.id(vm)).toBe("1");

      const vmCreate = createFormVM({ mode: "create", id: undefined });
      expect(FormVM.id(vmCreate)).toBeUndefined();
    });
  });
});
