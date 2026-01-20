// spec.json の Post リソースに対応するサンプルデータ
export interface PostData {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published" | "archived";
  priority: "low" | "medium" | "high";
  category: "tech" | "life" | "news";
  author: { id: string; name: string };
  tags: { id: string; name: string }[];
  createdAt: string;
}

export const samplePosts: PostData[] = [
  {
    id: "1",
    title: "SvelteKitの始め方",
    body: "# SvelteKitとは\n\nSvelteKitは、Svelteベースのフルスタックフレームワークです。\n\n## 特徴\n\n- SSR対応\n- ファイルベースルーティング\n- 高速なビルド",
    status: "published",
    priority: "high",
    category: "tech",
    author: { id: "1", name: "田中太郎" },
    tags: [
      { id: "1", name: "Svelte" },
      { id: "2", name: "Web" },
    ],
    createdAt: "2024-11-15T10:30:00Z",
  },
  {
    id: "2",
    title: "TypeScript 5.0 新機能まとめ",
    body: "TypeScript 5.0の新機能を紹介します。\n\n- デコレータの改善\n- const type parameters\n- satisfies演算子の活用",
    status: "published",
    priority: "medium",
    category: "tech",
    author: { id: "2", name: "佐藤花子" },
    tags: [{ id: "3", name: "TypeScript" }],
    createdAt: "2024-10-20T14:00:00Z",
  },
  {
    id: "3",
    title: "効率的なリモートワークのコツ",
    body: "リモートワークを効率的に行うためのヒントを共有します。",
    status: "draft",
    priority: "low",
    category: "life",
    author: { id: "3", name: "鈴木一郎" },
    tags: [{ id: "4", name: "仕事術" }],
    createdAt: "2024-12-01T09:00:00Z",
  },
  {
    id: "4",
    title: "最新テクノロジーニュース",
    body: "今週の注目ニュースをまとめました。",
    status: "archived",
    priority: "low",
    category: "news",
    author: { id: "1", name: "田中太郎" },
    tags: [{ id: "5", name: "ニュース" }],
    createdAt: "2024-09-10T16:45:00Z",
  },
];

export const sampleUsers = [
  { id: "1", name: "田中太郎" },
  { id: "2", name: "佐藤花子" },
  { id: "3", name: "鈴木一郎" },
];

export const sampleTags = [
  { id: "1", name: "Svelte" },
  { id: "2", name: "Web" },
  { id: "3", name: "TypeScript" },
  { id: "4", name: "仕事術" },
  { id: "5", name: "ニュース" },
];
