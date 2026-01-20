import { describe, it, expect, beforeEach } from "vitest";
import { ShowVM } from "../../src/vm/show.js";
import type { ShowViewModel } from "../../src/vm/types.js";
import { i18n } from "../../src/i18n/index.js";

beforeEach(() => {
  i18n.setLocale("ja");
});

const createShowVM = (overrides?: Partial<ShowViewModel>): ShowViewModel => ({
  type: "show",
  resource: "Post",
  label: "投稿",
  id: "1",
  fields: [
    { name: "id", label: "ID", kind: "text", value: "1" },
    { name: "title", label: "タイトル", kind: "text", value: "テスト記事" },
    {
      name: "status",
      label: "ステータス",
      kind: "enum",
      value: "published",
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開" },
      ],
    },
    {
      name: "author",
      label: "著者",
      kind: "relation",
      value: { id: "u1", name: "田中" },
      relation: { resource: "User", labelField: "name" },
    },
    {
      name: "viewCount",
      label: "閲覧数",
      kind: "number",
      value: 1234,
    },
    {
      name: "isPublic",
      label: "公開",
      kind: "boolean",
      value: true,
    },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true },
    {
      id: "delete",
      label: "削除",
      allowed: false,
      confirm: "本当に削除しますか？",
    },
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["title", "status"] },
    {
      id: "meta",
      label: "メタ情報",
      fields: ["author", "viewCount", "isPublic"],
    },
  ],
  ...overrides,
});

describe("ShowVM", () => {
  describe("フィールド操作", () => {
    it("fields で全フィールドを取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.fields(vm)).toHaveLength(6);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createShowVM();
      const field = ShowVM.field(vm, "title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("field で存在しないフィールドは undefined", () => {
      const vm = createShowVM();
      expect(ShowVM.field(vm, "nonexistent")).toBeUndefined();
    });
  });

  describe("値操作", () => {
    it("value で特定フィールドの値を取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.value(vm, "title")).toBe("テスト記事");
      expect(ShowVM.value(vm, "viewCount")).toBe(1234);
    });

    it("value で存在しないフィールドは undefined", () => {
      const vm = createShowVM();
      expect(ShowVM.value(vm, "nonexistent")).toBeUndefined();
    });

    it("formatValue でテキストをフォーマットできる", () => {
      const vm = createShowVM();
      const titleField = ShowVM.field(vm, "title")!;
      expect(ShowVM.formatValue(titleField, "テスト")).toBe("テスト");
    });

    it("formatValue で enum をラベルに変換できる", () => {
      const vm = createShowVM();
      const statusField = ShowVM.field(vm, "status")!;
      expect(ShowVM.formatValue(statusField, "draft")).toBe("下書き");
      expect(ShowVM.formatValue(statusField, "published")).toBe("公開");
    });

    it("formatValue で relation をラベルに変換できる", () => {
      const vm = createShowVM();
      const authorField = ShowVM.field(vm, "author")!;
      expect(ShowVM.formatValue(authorField, { id: "u1", name: "田中" })).toBe(
        "田中",
      );
    });

    it("formatValue で boolean をラベルに変換できる", () => {
      const vm = createShowVM();
      const isPublicField = ShowVM.field(vm, "isPublic")!;
      // デフォルト日本語
      expect(ShowVM.formatValue(isPublicField, true)).toBe("はい");
      expect(ShowVM.formatValue(isPublicField, false)).toBe("いいえ");
    });

    it("formatValue で null/undefined は - を返す", () => {
      const vm = createShowVM();
      const titleField = ShowVM.field(vm, "title")!;
      expect(ShowVM.formatValue(titleField, null)).toBe("-");
      expect(ShowVM.formatValue(titleField, undefined)).toBe("-");
    });
  });

  describe("グループ操作", () => {
    it("groups でグループ一覧を取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.groups(vm)).toHaveLength(2);
    });

    it("groups でグループがない場合は空配列", () => {
      const vm = createShowVM({ groups: undefined });
      expect(ShowVM.groups(vm)).toHaveLength(0);
    });

    it("fieldsInGroup でグループ内のフィールドを取得できる", () => {
      const vm = createShowVM();
      const basicFields = ShowVM.fieldsInGroup(vm, "basic");
      expect(basicFields).toHaveLength(2);
      expect(basicFields.map((f) => f.name)).toContain("title");
      expect(basicFields.map((f) => f.name)).toContain("status");
    });

    it("fieldsInGroup で存在しないグループは空配列", () => {
      const vm = createShowVM();
      expect(ShowVM.fieldsInGroup(vm, "nonexistent")).toHaveLength(0);
    });
  });

  describe("アクション操作", () => {
    it("actions でアクション一覧を取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.actions(vm)).toHaveLength(2);
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const vm = createShowVM();
      const allowed = ShowVM.allowedActions(vm);
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("edit");
    });
  });

  describe("状態操作", () => {
    it("loading で読み込み中か判定できる", () => {
      const vm = createShowVM();
      expect(ShowVM.loading(vm)).toBe(false);

      const vmLoading = createShowVM({ isLoading: true });
      expect(ShowVM.loading(vmLoading)).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.error(vm)).toBeUndefined();

      const vmError = createShowVM({ error: "データ取得に失敗しました" });
      expect(ShowVM.error(vmError)).toBe("データ取得に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.label(vm)).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.resource(vm)).toBe("Post");
    });

    it("id でレコードIDを取得できる", () => {
      const vm = createShowVM();
      expect(ShowVM.id(vm)).toBe("1");
    });
  });
});
