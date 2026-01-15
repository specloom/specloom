import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { E as Eh, I as Ih, P as Ph } from './Show-CkBOW0P52.mjs';
import 'solid-js/store';

const q = [{ id: "1", name: "\u30CE\u30FC\u30C8PC", sku: "PC-001", price: 128e3, stock: 50, category: "electronics", published: true, url: "https://example.com/pc" }, { id: "2", name: "\u30EF\u30A4\u30E4\u30EC\u30B9\u30DE\u30A6\u30B9", sku: "MS-002", price: 3980, stock: 200, category: "accessories", published: true, url: "https://example.com/mouse" }, { id: "3", name: "\u30E2\u30CB\u30BF\u30FC 27\u30A4\u30F3\u30C1", sku: "MN-003", price: 45e3, stock: 30, category: "electronics", published: true, url: "https://example.com/monitor" }, { id: "4", name: "\u30AD\u30FC\u30DC\u30FC\u30C9", sku: "KB-004", price: 12800, stock: 0, category: "accessories", published: false, url: "" }, { id: "5", name: "USB\u30CF\u30D6", sku: "HB-005", price: 2500, stock: 150, category: "accessories", published: true, url: "https://example.com/hub" }, { id: "6", name: "\u5916\u4ED8\u3051SSD 1TB", sku: "SD-006", price: 15800, stock: 80, category: "storage", published: true, url: "https://example.com/ssd" }], c = [{ value: "electronics", label: "\u96FB\u5B50\u6A5F\u5668" }, { value: "accessories", label: "\u30A2\u30AF\u30BB\u30B5\u30EA\u30FC" }, { value: "storage", label: "\u30B9\u30C8\u30EC\u30FC\u30B8" }], F = { type: "list", resource: "products", label: "\u5546\u54C1\u4E00\u89A7", fields: [{ name: "name", label: "\u5546\u54C1\u540D", kind: "text", sortable: true }, { name: "sku", label: "SKU", kind: "text" }, { name: "price", label: "\u4FA1\u683C", kind: "currency", sortable: true }, { name: "stock", label: "\u5728\u5EAB", kind: "number", sortable: true }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", sortable: true, options: c }, { name: "published", label: "\u516C\u958B", kind: "boolean" }], rows: q.map((t) => ({ id: t.id, values: t, actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true }, { id: "duplicate", label: "\u8907\u88FD", allowed: true }, { id: "delete", label: "\u524A\u9664", allowed: t.stock === 0, confirm: "\u672C\u5F53\u306B\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }] })), headerActions: [{ id: "create", label: "\u65B0\u898F\u4F5C\u6210", allowed: true, ui: { variant: "primary" } }, { id: "import", label: "\u30A4\u30F3\u30DD\u30FC\u30C8", allowed: true }], bulkActions: [{ id: "bulk-publish", label: "\u4E00\u62EC\u516C\u958B", allowed: true }, { id: "bulk-unpublish", label: "\u4E00\u62EC\u975E\u516C\u958B", allowed: true }], filters: { named: [] }, selection: { mode: "multi", selected: [] }, search: { fields: ["name", "sku"], query: "" }, defaultSort: { field: "name", order: "asc" }, clickAction: "show" }, L = { type: "show", resource: "products", label: "\u5546\u54C1\u8A73\u7D30", id: "1", fields: [{ name: "name", label: "\u5546\u54C1\u540D", kind: "text", value: "\u30CE\u30FC\u30C8PC" }, { name: "sku", label: "SKU", kind: "text", value: "PC-001" }, { name: "price", label: "\u4FA1\u683C", kind: "currency", value: 128e3 }, { name: "stock", label: "\u5728\u5EAB\u6570", kind: "number", value: 50 }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", value: "electronics", options: c }, { name: "published", label: "\u516C\u958B\u72B6\u614B", kind: "boolean", value: true }, { name: "url", label: "\u5546\u54C1URL", kind: "url", value: "https://example.com/pc" }], actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true, ui: { variant: "primary" } }, { id: "duplicate", label: "\u8907\u88FD", allowed: true }], groups: [{ id: "basic", label: "\u57FA\u672C\u60C5\u5831", fields: ["name", "sku", "category"] }, { id: "pricing", label: "\u4FA1\u683C\u30FB\u5728\u5EAB", fields: ["price", "stock"] }, { id: "publish", label: "\u516C\u958B\u8A2D\u5B9A", fields: ["published", "url"] }] }, P = { type: "form", resource: "products", label: "\u5546\u54C1\u7DE8\u96C6", mode: "edit", id: "1", fields: [{ name: "name", label: "\u5546\u54C1\u540D", kind: "text", value: "\u30CE\u30FC\u30C8PC", required: true, readonly: false, errors: [], placeholder: "\u5546\u54C1\u540D\u3092\u5165\u529B" }, { name: "sku", label: "SKU", kind: "text", value: "PC-001", required: true, readonly: true, errors: [], hint: "SKU\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093" }, { name: "price", label: "\u4FA1\u683C", kind: "number", value: 128e3, required: true, readonly: false, errors: [], validation: { min: 0 } }, { name: "stock", label: "\u5728\u5EAB\u6570", kind: "number", value: 50, required: true, readonly: false, errors: [], validation: { min: 0 } }, { name: "category", label: "\u30AB\u30C6\u30B4\u30EA", kind: "enum", value: "electronics", required: true, readonly: false, errors: [], options: c }, { name: "published", label: "\u516C\u958B", kind: "boolean", value: true, required: false, readonly: false, errors: [] }, { name: "url", label: "\u5546\u54C1URL", kind: "url", value: "https://example.com/pc", required: false, readonly: false, errors: [], placeholder: "https://" }], actions: [{ id: "cancel", label: "\u30AD\u30E3\u30F3\u30BB\u30EB", allowed: true }], isValid: true, isDirty: false, groups: [{ id: "basic", label: "\u57FA\u672C\u60C5\u5831", fields: ["name", "sku", "category"] }, { id: "pricing", label: "\u4FA1\u683C\u30FB\u5728\u5EAB", fields: ["price", "stock"] }, { id: "publish", label: "\u516C\u958B\u8A2D\u5B9A", fields: ["published", "url"] }] };
var U = ["<div", ' class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-gray-900">\u5546\u54C1\u7BA1\u7406</h1><p class="mt-1 text-sm text-gray-500">\u5546\u54C1\u60C5\u5831\u306E\u7BA1\u7406\u3092\u884C\u3044\u307E\u3059</p></div><!--$-->', '<!--/--></div><div class="bg-white shadow rounded-lg overflow-hidden"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], m = ["<button", ' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">\u2190 \u4E00\u89A7\u306B\u623B\u308B</button>'];
function R() {
  const [t, a] = createSignal("list"), [b, d] = createSignal(F), [p] = createSignal(L), [h, k] = createSignal(P), f = (e) => {
    d((l) => {
      const s = l.selection.selected.includes(e) ? l.selection.selected.filter((r) => r !== e) : [...l.selection.selected, e];
      return { ...l, selection: { ...l.selection, selected: s } };
    });
  }, g = () => {
    d((e) => {
      const l = e.selection.selected.length === e.rows.length;
      return { ...e, selection: { ...e.selection, selected: l ? [] : e.rows.map((s) => s.id) } };
    });
  }, y = (e, l) => {
    console.log("List action:", e, l), (e === "create" || e === "edit") && a("form");
  }, w = (e) => {
    console.log("Show action:", e), e === "edit" && a("form");
  }, v = (e) => {
    e === "cancel" && a("list");
  }, x = (e, l) => {
    k((s) => ({ ...s, isDirty: true, fields: s.fields.map((r) => r.name === e ? { ...r, value: l } : r) }));
  }, S = () => {
    console.log("Form submitted"), a("list");
  };
  return ssr(U, ssrHydrationKey(), t() !== "list" && m[0] + ssrHydrationKey() + m[1], t() === "list" && escape(createComponent(Eh, { get vm() {
    return b();
  }, onAction: y, onSelect: f, onSelectAll: g, onRowClick: () => a("show") })), t() === "show" && escape(createComponent(Ih, { get vm() {
    return p();
  }, onAction: w })), t() === "form" && escape(createComponent(Ph, { get vm() {
    return h();
  }, onChange: x, onSubmit: S, onAction: v })));
}

export { R as default };
//# sourceMappingURL=products2.mjs.map
