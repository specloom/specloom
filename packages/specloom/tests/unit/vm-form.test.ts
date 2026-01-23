import { describe, it, expect } from "vitest";
import { FormVM } from "../../src/vm/form.js";
import type { FormViewModel } from "../../src/vm/types.js";

const createFormVMData = (
  overrides?: Partial<FormViewModel>,
): FormViewModel => ({
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

// ヘルパー: FormVM インスタンスを作成
const createFormVM = (overrides?: Partial<FormViewModel>): FormVM =>
  new FormVM(createFormVMData(overrides));

describe("FormVM (OOP Style)", () => {
  describe("Static Factory", () => {
    it("FormVM.from で作成できる", () => {
      const data = createFormVMData();
      const vm = FormVM.from(data);
      expect(vm).toBeInstanceOf(FormVM);
      expect(vm.data).toBe(data);
    });
  });

  describe("フィールド操作", () => {
    it("fields で全フィールドを取得できる", () => {
      const vm = createFormVM();
      expect(vm.fields).toHaveLength(4);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createFormVM();
      const field = vm.field("title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("visibleFields で表示フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const visible = vm.visibleFields;
      expect(visible).toHaveLength(3);
      expect(visible.map((f) => f.name)).not.toContain("createdAt");
    });

    it("requiredFields で必須フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const required = vm.requiredFields;
      expect(required).toHaveLength(2);
      expect(required.map((f) => f.name)).toContain("title");
      expect(required.map((f) => f.name)).toContain("status");
    });

    it("readonlyFields で読み取り専用フィールドのみ取得できる", () => {
      const vm = createFormVM();
      const readonly = vm.readonlyFields;
      expect(readonly).toHaveLength(1);
      expect(readonly[0].name).toBe("createdAt");
    });
  });

  describe("値操作", () => {
    it("value で特定フィールドの値を取得できる", () => {
      const vm = createFormVM();
      expect(vm.value("title")).toBe("テスト記事");
      expect(vm.value("status")).toBe("draft");
    });

    it("values で全値をオブジェクトで取得できる", () => {
      const vm = createFormVM();
      const values = vm.values;
      expect(values.title).toBe("テスト記事");
      expect(values.content).toBe("本文です");
      expect(values.status).toBe("draft");
    });
  });

  describe("バリデーション状態", () => {
    it("isValid でフォームが有効か判定できる", () => {
      const vm = createFormVM();
      expect(vm.isValid).toBe(false);

      const vmValid = createFormVM({ isValid: true });
      expect(vmValid.isValid).toBe(true);
    });

    it("isDirty でフォームに変更があるか判定できる", () => {
      const vm = createFormVM();
      expect(vm.isDirty).toBe(true);

      const vmClean = createFormVM({ isDirty: false });
      expect(vmClean.isDirty).toBe(false);
    });

    it("errors でエラーのあるフィールド一覧を取得できる", () => {
      const vm = createFormVM();
      const errors = vm.errors;
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("status");
      expect(errors[0].errors).toContain("ステータスを選択してください");
    });

    it("fieldErrors で特定フィールドのエラーを取得できる", () => {
      const vm = createFormVM();
      expect(vm.fieldErrors("status")).toContain(
        "ステータスを選択してください",
      );
      expect(vm.fieldErrors("title")).toHaveLength(0);
    });

    it("hasError でフィールドにエラーがあるか判定できる", () => {
      const vm = createFormVM();
      expect(vm.hasError("status")).toBe(true);
      expect(vm.hasError("title")).toBe(false);
    });

    it("hasErrors でいずれかのフィールドにエラーがあるか判定できる", () => {
      const vm = createFormVM();
      expect(vm.hasErrors).toBe(true);

      const vmNoErrors = createFormVM({
        fields: [
          {
            name: "title",
            label: "タイトル",
            kind: "text",
            value: "test",
            required: false,
            readonly: false,
            errors: [],
          },
        ],
      });
      expect(vmNoErrors.hasErrors).toBe(false);
    });

    it("fieldsWithErrors でエラーのあるフィールドを取得できる", () => {
      const vm = createFormVM();
      const withErrors = vm.fieldsWithErrors;
      expect(withErrors).toHaveLength(1);
      expect(withErrors[0].name).toBe("status");
    });
  });

  describe("UI補助情報", () => {
    it("hint でヒントを取得できる", () => {
      const vm = createFormVM();
      expect(vm.hint("title")).toBe("100文字以内");
      expect(vm.hint("content")).toBeUndefined();
    });

    it("placeholder でプレースホルダーを取得できる", () => {
      const vm = createFormVM();
      expect(vm.placeholder("title")).toBe("タイトルを入力");
      expect(vm.placeholder("content")).toBeUndefined();
    });

    it("isVisible でフィールドが表示されるか判定できる", () => {
      const vm = createFormVM();
      expect(vm.isVisible("title")).toBe(true);
      expect(vm.isVisible("createdAt")).toBe(false);
    });

    it("isRequired でフィールドが必須か判定できる", () => {
      const vm = createFormVM();
      expect(vm.isRequired("title")).toBe(true);
      expect(vm.isRequired("content")).toBe(false);
    });

    it("isReadonly でフィールドが読み取り専用か判定できる", () => {
      const vm = createFormVM();
      expect(vm.isReadonly("createdAt")).toBe(true);
      expect(vm.isReadonly("title")).toBe(false);
    });
  });

  describe("グループ操作", () => {
    it("groups でグループ一覧を取得できる", () => {
      const vm = createFormVM();
      expect(vm.groups).toHaveLength(2);
    });

    it("groups でグループがない場合は空配列", () => {
      const vm = createFormVM({ groups: undefined });
      expect(vm.groups).toHaveLength(0);
    });

    it("fieldsInGroup でグループ内のフィールドを取得できる", () => {
      const vm = createFormVM();
      const basicFields = vm.fieldsInGroup("basic");
      expect(basicFields).toHaveLength(2);
      expect(basicFields.map((f) => f.name)).toContain("title");
      expect(basicFields.map((f) => f.name)).toContain("content");
    });

    it("fieldsInGroup で存在しないグループは空配列", () => {
      const vm = createFormVM();
      expect(vm.fieldsInGroup("nonexistent")).toHaveLength(0);
    });
  });

  describe("アクション操作", () => {
    it("actions でアクション一覧を取得できる", () => {
      const vm = createFormVM();
      expect(vm.actions).toHaveLength(2);
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const vm = createFormVM({
        actions: [
          { id: "save", label: "保存", allowed: true },
          { id: "delete", label: "削除", allowed: false },
        ],
      });
      const allowed = vm.allowedActions;
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("save");
    });

    it("canSubmit で送信可能か判定できる", () => {
      const vm = createFormVM({ isValid: true, isSubmitting: false });
      expect(vm.canSubmit).toBe(true);

      const vmInvalid = createFormVM({ isValid: false });
      expect(vmInvalid.canSubmit).toBe(false);

      const vmSubmitting = createFormVM({ isValid: true, isSubmitting: true });
      expect(vmSubmitting.canSubmit).toBe(false);
    });
  });

  describe("状態操作", () => {
    it("isLoading で読み込み中か判定できる", () => {
      const vm = createFormVM();
      expect(vm.isLoading).toBe(false);

      const vmLoading = createFormVM({ isLoading: true });
      expect(vmLoading.isLoading).toBe(true);
    });

    it("isSubmitting で送信中か判定できる", () => {
      const vm = createFormVM();
      expect(vm.isSubmitting).toBe(false);

      const vmSubmitting = createFormVM({ isSubmitting: true });
      expect(vmSubmitting.isSubmitting).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createFormVM();
      expect(vm.error).toBeUndefined();

      const vmError = createFormVM({ error: "保存に失敗しました" });
      expect(vmError.error).toBe("保存に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createFormVM();
      expect(vm.label).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createFormVM();
      expect(vm.resource).toBe("Post");
    });

    it("mode でcreate/editを取得できる", () => {
      const vm = createFormVM();
      expect(vm.mode).toBe("edit");

      const vmCreate = createFormVM({ mode: "create" });
      expect(vmCreate.mode).toBe("create");
    });

    it("id でレコードIDを取得できる", () => {
      const vm = createFormVM();
      expect(vm.id).toBe("1");

      const vmCreate = createFormVM({ mode: "create", id: undefined });
      expect(vmCreate.id).toBeUndefined();
    });
  });

  describe("状態更新（イミュータブル）", () => {
    describe("値の更新", () => {
      it("setValue でフィールド値を更新できる", () => {
        const vm = createFormVM({ isDirty: false });
        const updated = vm.setValue("title", "新しいタイトル");

        expect(updated.value("title")).toBe("新しいタイトル");
        expect(updated.isDirty).toBe(true);
        expect(vm.value("title")).toBe("テスト記事"); // 元は変わらない
        expect(updated).not.toBe(vm); // 別インスタンス
      });

      it("setValues で複数フィールドを一括更新できる", () => {
        const vm = createFormVM({ isDirty: false });
        const updated = vm.setValues({
          title: "新タイトル",
          content: "新本文",
        });

        expect(updated.value("title")).toBe("新タイトル");
        expect(updated.value("content")).toBe("新本文");
        expect(updated.isDirty).toBe(true);
      });
    });

    describe("エラーの更新", () => {
      it("setFieldErrors でフィールドエラーを設定できる", () => {
        const vm = createFormVM({ isValid: true });
        const updated = vm.setFieldErrors("title", ["必須です", "短すぎます"]);

        expect(updated.fieldErrors("title")).toEqual([
          "必須です",
          "短すぎます",
        ]);
        expect(updated.isValid).toBe(false);
      });

      it("clearErrors で全エラーをクリアできる", () => {
        const vm = createFormVM();
        expect(vm.hasErrors).toBe(true);

        const updated = vm.clearErrors();
        expect(updated.hasErrors).toBe(false);
        expect(updated.isValid).toBe(true);
      });

      it("setAllErrors で全エラーを一括設定できる", () => {
        const vm = createFormVM();
        const updated = vm.setAllErrors({
          title: ["タイトルエラー"],
          content: ["本文エラー1", "本文エラー2"],
        });

        expect(updated.fieldErrors("title")).toEqual(["タイトルエラー"]);
        expect(updated.fieldErrors("content")).toEqual([
          "本文エラー1",
          "本文エラー2",
        ]);
        expect(updated.fieldErrors("status")).toEqual([]); // クリアされる
      });
    });

    describe("バリデーション", () => {
      it("validate でフォーム全体をバリデーションできる", () => {
        const vm = createFormVM({
          fields: [
            {
              name: "email",
              label: "メール",
              kind: "email",
              value: "",
              required: true,
              readonly: false,
              errors: [],
            },
          ],
          isValid: true,
        });

        const validated = vm.validate();
        expect(validated.hasError("email")).toBe(true);
        expect(validated.isValid).toBe(false);
      });

      it("validateField で単一フィールドをバリデーションできる", () => {
        const vm = createFormVM({
          fields: [
            {
              name: "title",
              label: "タイトル",
              kind: "text",
              value: "",
              required: true,
              readonly: false,
              errors: [],
            },
            {
              name: "content",
              label: "本文",
              kind: "text",
              value: "",
              required: true,
              readonly: false,
              errors: [],
            },
          ],
          isValid: true,
        });

        const validated = vm.validateField("title");
        expect(validated.hasError("title")).toBe(true);
        expect(validated.hasError("content")).toBe(false); // バリデーションされない
      });
    });

    describe("状態フラグ", () => {
      it("setSubmitting で送信中状態を設定できる", () => {
        const vm = createFormVM();
        const submitting = vm.setSubmitting(true);
        expect(submitting.isSubmitting).toBe(true);

        const done = submitting.setSubmitting(false);
        expect(done.isSubmitting).toBe(false);
      });

      it("setLoading でローディング状態を設定できる", () => {
        const vm = createFormVM();
        const loading = vm.setLoading(true);
        expect(loading.isLoading).toBe(true);
      });

      it("setError でエラーを設定できる", () => {
        const vm = createFormVM();
        const withError = vm.setError("保存に失敗しました");
        expect(withError.error).toBe("保存に失敗しました");

        const cleared = withError.setError(undefined);
        expect(cleared.error).toBeUndefined();
      });
    });

    describe("リセット", () => {
      it("reset でフォームをリセットできる", () => {
        const vm = createFormVM({ isDirty: true, isValid: false });
        const reset = vm.reset();

        expect(reset.isDirty).toBe(false);
        expect(reset.isValid).toBe(true);
        expect(reset.fieldErrors("status")).toEqual([]);
      });

      it("reset で初期値を指定できる", () => {
        const vm = createFormVM();
        const reset = vm.reset({ title: "初期タイトル" });

        expect(reset.value("title")).toBe("初期タイトル");
      });

      it("markClean でdirty状態をクリアできる", () => {
        const vm = createFormVM({ isDirty: true });
        const clean = vm.markClean();

        expect(clean.isDirty).toBe(false);
      });
    });

    describe("メソッドチェーン", () => {
      it("複数の操作をチェーンできる", () => {
        const vm = createFormVM({ isDirty: false });

        const updated = vm
          .setValue("title", "新タイトル")
          .setValue("content", "新本文")
          .setSubmitting(true);

        expect(updated.value("title")).toBe("新タイトル");
        expect(updated.value("content")).toBe("新本文");
        expect(updated.isSubmitting).toBe(true);
        expect(updated.isDirty).toBe(true);

        // 元は変わらない
        expect(vm.value("title")).toBe("テスト記事");
        expect(vm.isSubmitting).toBe(false);
      });
    });
  });
});
