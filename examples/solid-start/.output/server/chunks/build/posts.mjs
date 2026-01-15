import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { E as Eh, I as Ih, P as Ph } from './Show-CkBOW0P5.mjs';
import 'solid-js/store';

const L = [{ id: "1", title: "SolidJS\u306E\u59CB\u3081\u65B9", slug: "getting-started-solidjs", author: "\u7530\u4E2D\u592A\u90CE", category: "tech", published: true, publishedAt: "2024-11-15", views: 1250 }, { id: "2", title: "TypeScript 5.0 \u65B0\u6A5F\u80FD\u307E\u3068\u3081", slug: "typescript-5-features", author: "\u4F50\u85E4\u82B1\u5B50", category: "tech", published: true, publishedAt: "2024-10-20", views: 3420 }, { id: "3", title: "\u52B9\u7387\u7684\u306A\u30B3\u30FC\u30C9\u30EC\u30D3\u30E5\u30FC\u306E\u65B9\u6CD5", slug: "effective-code-review", author: "\u9234\u6728\u4E00\u90CE", category: "process", published: false, publishedAt: null, views: 0 }, { id: "4", title: "\u30C1\u30FC\u30E0\u30D3\u30EB\u30C7\u30A3\u30F3\u30B0\u306E\u30B3\u30C4", slug: "team-building-tips", author: "\u9AD8\u6A4B\u7F8E\u54B2", category: "management", published: true, publishedAt: "2024-12-01", views: 890 }], d = [{ value: "tech", label: "\u6280\u8853" }, { value: "process", label: "\u30D7\u30ED\u30BB\u30B9" }, { value: "management", label: "\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8" }, { value: "news", label: "\u30CB\u30E5\u30FC\u30B9" }], q = { type: "list", resource: "posts", label: "\u8A18\u4E8B\u4E00\u89A7", fields: [{ name: "title", label: "\u30BF\u30A4\u30C8\u30EB", kind: "text", sortable: true }, { name: "author", label: "\u8457\u8005", kind: "text", sortable: true }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", sortable: true, options: d }, { name: "published", label: "\u516C\u958B", kind: "boolean" }, { name: "publishedAt", label: "\u516C\u958B\u65E5", kind: "date", sortable: true }, { name: "views", label: "\u95B2\u89A7\u6570", kind: "number", sortable: true }], rows: L.map((l) => ({ id: l.id, values: l, actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true }, { id: "preview", label: "\u30D7\u30EC\u30D3\u30E5\u30FC", allowed: true }, { id: "publish", label: "\u516C\u958B", allowed: !l.published }, { id: "unpublish", label: "\u975E\u516C\u958B", allowed: l.published, confirm: "\u975E\u516C\u958B\u306B\u3057\u307E\u3059\u304B\uFF1F" }] })), headerActions: [{ id: "create", label: "\u65B0\u898F\u4F5C\u6210", allowed: true, ui: { variant: "primary" } }], bulkActions: [{ id: "bulk-publish", label: "\u4E00\u62EC\u516C\u958B", allowed: true }, { id: "bulk-delete", label: "\u4E00\u62EC\u524A\u9664", allowed: true, confirm: "\u9078\u629E\u3057\u305F\u8A18\u4E8B\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }], filters: { named: [] }, selection: { mode: "multi", selected: [] }, search: { fields: ["title", "author"], query: "" }, defaultSort: { field: "publishedAt", order: "desc" }, clickAction: "show" }, $ = { type: "show", resource: "posts", label: "\u8A18\u4E8B\u8A73\u7D30", id: "1", fields: [{ name: "title", label: "\u30BF\u30A4\u30C8\u30EB", kind: "text", value: "SolidJS\u306E\u59CB\u3081\u65B9" }, { name: "slug", label: "\u30B9\u30E9\u30C3\u30B0", kind: "text", value: "getting-started-solidjs" }, { name: "author", label: "\u8457\u8005", kind: "text", value: "\u7530\u4E2D\u592A\u90CE" }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", value: "tech", options: d }, { name: "published", label: "\u516C\u958B\u72B6\u614B", kind: "boolean", value: true }, { name: "publishedAt", label: "\u516C\u958B\u65E5", kind: "date", value: "2024-11-15" }, { name: "views", label: "\u95B2\u89A7\u6570", kind: "number", value: 1250 }], actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true, ui: { variant: "primary" } }, { id: "preview", label: "\u30D7\u30EC\u30D3\u30E5\u30FC", allowed: true }] }, C = { type: "form", resource: "posts", label: "\u8A18\u4E8B\u7DE8\u96C6", mode: "edit", id: "1", fields: [{ name: "title", label: "\u30BF\u30A4\u30C8\u30EB", kind: "text", value: "SolidJS\u306E\u59CB\u3081\u65B9", required: true, readonly: false, errors: [], placeholder: "\u8A18\u4E8B\u30BF\u30A4\u30C8\u30EB" }, { name: "slug", label: "\u30B9\u30E9\u30C3\u30B0", kind: "text", value: "getting-started-solidjs", required: true, readonly: false, errors: [], hint: "URL\u306B\u4F7F\u7528\u3055\u308C\u307E\u3059\uFF08\u82F1\u6570\u5B57\u3068\u30CF\u30A4\u30D5\u30F3\u306E\u307F\uFF09" }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", value: "tech", required: true, readonly: false, errors: [], options: d }, { name: "content", label: "\u672C\u6587", kind: "textarea", value: `# SolidJS\u3068\u306F

SolidJS\u306F...`, required: true, readonly: false, errors: [], placeholder: "Markdown\u5F62\u5F0F\u3067\u5165\u529B" }, { name: "published", label: "\u516C\u958B\u3059\u308B", kind: "boolean", value: true, required: false, readonly: false, errors: [] }], actions: [{ id: "preview", label: "\u30D7\u30EC\u30D3\u30E5\u30FC", allowed: true }, { id: "cancel", label: "\u30AD\u30E3\u30F3\u30BB\u30EB", allowed: true }], isValid: true, isDirty: false };
var J = ["<div", ' class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-gray-900">\u6295\u7A3F\u7BA1\u7406</h1><p class="mt-1 text-sm text-gray-500">\u30D6\u30ED\u30B0\u8A18\u4E8B\u306E\u4F5C\u6210\u30FB\u7DE8\u96C6\u3092\u884C\u3044\u307E\u3059</p></div><!--$-->', '<!--/--></div><div class="bg-white shadow rounded-lg overflow-hidden"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], b = ["<button", ' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">\u2190 \u4E00\u89A7\u306B\u623B\u308B</button>'];
function _() {
  const [l, s] = createSignal("list"), [m, u] = createSignal(q), [h] = createSignal($), [p, g] = createSignal(C), w = (e) => {
    u((t) => {
      const i = t.selection.selected.includes(e) ? t.selection.selected.filter((a) => a !== e) : [...t.selection.selected, e];
      return { ...t, selection: { ...t.selection, selected: i } };
    });
  }, f = () => {
    u((e) => {
      const t = e.selection.selected.length === e.rows.length;
      return { ...e, selection: { ...e.selection, selected: t ? [] : e.rows.map((i) => i.id) } };
    });
  }, v = (e, t) => {
    console.log("List action:", e, t), (e === "create" || e === "edit") && s("form");
  }, y = (e) => {
    console.log("Show action:", e), e === "edit" && s("form");
  }, S = (e) => {
    e === "cancel" && s("list");
  }, k = (e, t) => {
    g((i) => ({ ...i, isDirty: true, fields: i.fields.map((a) => a.name === e ? { ...a, value: t } : a) }));
  }, x = () => {
    console.log("Form submitted"), s("list");
  };
  return ssr(J, ssrHydrationKey(), l() !== "list" && b[0] + ssrHydrationKey() + b[1], l() === "list" && escape(createComponent(Eh, { get vm() {
    return m();
  }, onAction: v, onSelect: w, onSelectAll: f, onRowClick: () => s("show") })), l() === "show" && escape(createComponent(Ih, { get vm() {
    return h();
  }, onAction: y })), l() === "form" && escape(createComponent(Ph, { get vm() {
    return p();
  }, onChange: k, onSubmit: x, onAction: S })));
}

export { _ as default };
//# sourceMappingURL=posts.mjs.map
