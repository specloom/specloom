import { describe, it, expect, beforeEach } from "vitest";
import { ShowVM } from "../../src/vm/show.js";
import type { ShowViewModel } from "../../src/vm/types.js";
import { i18n } from "../../src/i18n/index.js";

beforeEach(() => {
  i18n.setLocale("ja");
});

const createShowVMData = (
  overrides?: Partial<ShowViewModel>,
): ShowViewModel => ({
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

// ヘルパー: ShowVM インスタンスを作成
const createShowVM = (overrides?: Partial<ShowViewModel>): ShowVM =>
  new ShowVM(createShowVMData(overrides));

describe("ShowVM (OOP Style)", () => {
  describe("Static Factory", () => {
    it("ShowVM.from で作成できる", () => {
      const data = createShowVMData();
      const vm = ShowVM.from(data);
      expect(vm).toBeInstanceOf(ShowVM);
      expect(vm.data).toBe(data);
    });
  });

  describe("フィールド操作", () => {
    it("fields で全フィールドを取得できる", () => {
      const vm = createShowVM();
      expect(vm.fields).toHaveLength(6);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createShowVM();
      const field = vm.field("title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("field で存在しないフィールドは undefined", () => {
      const vm = createShowVM();
      expect(vm.field("nonexistent")).toBeUndefined();
    });
  });

  describe("値操作", () => {
    it("value で特定フィールドの値を取得できる", () => {
      const vm = createShowVM();
      expect(vm.value("title")).toBe("テスト記事");
      expect(vm.value("viewCount")).toBe(1234);
    });

    it("value で存在しないフィールドは undefined", () => {
      const vm = createShowVM();
      expect(vm.value("nonexistent")).toBeUndefined();
    });

    it("formatValue でテキストをフォーマットできる", () => {
      const vm = createShowVM();
      const titleField = vm.field("title")!;
      expect(vm.formatValue(titleField, "テスト")).toBe("テスト");
    });

    it("formatValue で enum をラベルに変換できる", () => {
      const vm = createShowVM();
      const statusField = vm.field("status")!;
      expect(vm.formatValue(statusField, "draft")).toBe("下書き");
      expect(vm.formatValue(statusField, "published")).toBe("公開");
    });

    it("formatValue で relation をラベルに変換できる", () => {
      const vm = createShowVM();
      const authorField = vm.field("author")!;
      expect(vm.formatValue(authorField, { id: "u1", name: "田中" })).toBe(
        "田中",
      );
    });

    it("formatValue で boolean をラベルに変換できる", () => {
      const vm = createShowVM();
      const isPublicField = vm.field("isPublic")!;
      // デフォルト日本語
      expect(vm.formatValue(isPublicField, true)).toBe("はい");
      expect(vm.formatValue(isPublicField, false)).toBe("いいえ");
    });

    it("formatValue で null/undefined は - を返す", () => {
      const vm = createShowVM();
      const titleField = vm.field("title")!;
      expect(vm.formatValue(titleField, null)).toBe("-");
      expect(vm.formatValue(titleField, undefined)).toBe("-");
    });
  });

  describe("グループ操作", () => {
    it("groups でグループ一覧を取得できる", () => {
      const vm = createShowVM();
      expect(vm.groups).toHaveLength(2);
    });

    it("groups でグループがない場合は空配列", () => {
      const vm = createShowVM({ groups: undefined });
      expect(vm.groups).toHaveLength(0);
    });

    it("fieldsInGroup でグループ内のフィールドを取得できる", () => {
      const vm = createShowVM();
      const basicFields = vm.fieldsInGroup("basic");
      expect(basicFields).toHaveLength(2);
      expect(basicFields.map((f) => f.name)).toContain("title");
      expect(basicFields.map((f) => f.name)).toContain("status");
    });

    it("fieldsInGroup で存在しないグループは空配列", () => {
      const vm = createShowVM();
      expect(vm.fieldsInGroup("nonexistent")).toHaveLength(0);
    });
  });

  describe("アクション操作", () => {
    it("actions でアクション一覧を取得できる", () => {
      const vm = createShowVM();
      expect(vm.actions).toHaveLength(2);
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const vm = createShowVM();
      const allowed = vm.allowedActions;
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("edit");
    });
  });

  describe("状態操作", () => {
    it("isLoading で読み込み中か判定できる", () => {
      const vm = createShowVM();
      expect(vm.isLoading).toBe(false);

      const vmLoading = createShowVM({ isLoading: true });
      expect(vmLoading.isLoading).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createShowVM();
      expect(vm.error).toBeUndefined();

      const vmError = createShowVM({ error: "データ取得に失敗しました" });
      expect(vmError.error).toBe("データ取得に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createShowVM();
      expect(vm.label).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createShowVM();
      expect(vm.resource).toBe("Post");
    });

    it("id でレコードIDを取得できる", () => {
      const vm = createShowVM();
      expect(vm.id).toBe("1");
    });
  });

  describe("状態更新（イミュータブル）", () => {
    it("setLoading でローディング状態を設定できる", () => {
      const vm = createShowVM();
      const loading = vm.setLoading(true);
      expect(loading.isLoading).toBe(true);
      expect(loading).not.toBe(vm); // 別インスタンス

      const done = loading.setLoading(false);
      expect(done.isLoading).toBe(false);
    });

    it("setError でエラーを設定できる", () => {
      const vm = createShowVM();
      const withError = vm.setError("取得に失敗しました");
      expect(withError.error).toBe("取得に失敗しました");
      expect(vm.error).toBeUndefined(); // 元は変わらない

      const cleared = withError.setError(undefined);
      expect(cleared.error).toBeUndefined();
    });

    it("setData でフィールドデータを更新できる", () => {
      const vm = createShowVM();
      const updated = vm.setData({
        title: "更新されたタイトル",
        viewCount: 5000,
      });

      expect(updated.value("title")).toBe("更新されたタイトル");
      expect(updated.value("viewCount")).toBe(5000);
      expect(updated.value("status")).toBe("published"); // 変更なし
      expect(vm.value("title")).toBe("テスト記事"); // 元は変わらない
    });

    it("setFieldValue で単一フィールド値を更新できる", () => {
      const vm = createShowVM();
      const updated = vm.setFieldValue("title", "新しいタイトル");

      expect(updated.value("title")).toBe("新しいタイトル");
      expect(vm.value("title")).toBe("テスト記事"); // 元は変わらない
    });

    it("setId でIDを更新できる", () => {
      const vm = createShowVM();
      const updated = vm.setId("2");

      expect(updated.id).toBe("2");
      expect(vm.id).toBe("1"); // 元は変わらない
    });

    it("メソッドチェーンができる", () => {
      const vm = createShowVM();
      const updated = vm
        .setLoading(true)
        .setFieldValue("title", "新タイトル")
        .setId("99");

      expect(updated.isLoading).toBe(true);
      expect(updated.value("title")).toBe("新タイトル");
      expect(updated.id).toBe("99");
    });
  });
});
