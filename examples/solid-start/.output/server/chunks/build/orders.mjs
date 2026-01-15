import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { E as Eh, I as Ih, P as Ph } from './Show-CkBOW0P5.mjs';
import 'solid-js/store';

const V = [{ id: "ORD-001", customer: "\u7530\u4E2D\u592A\u90CE", email: "tanaka@example.com", total: 156e3, status: "completed", createdAt: "2024-12-01T10:30:00" }, { id: "ORD-002", customer: "\u4F50\u85E4\u82B1\u5B50", email: "sato@example.com", total: 3980, status: "shipped", createdAt: "2024-12-05T14:20:00" }, { id: "ORD-003", customer: "\u9234\u6728\u4E00\u90CE", email: "suzuki@example.com", total: 45e3, status: "processing", createdAt: "2024-12-10T09:15:00" }, { id: "ORD-004", customer: "\u9AD8\u6A4B\u7F8E\u54B2", email: "takahashi@example.com", total: 18300, status: "pending", createdAt: "2024-12-12T16:45:00" }, { id: "ORD-005", customer: "\u5C71\u7530\u5065\u592A", email: "yamada@example.com", total: 128e3, status: "cancelled", createdAt: "2024-12-08T11:00:00" }], n = [{ value: "pending", label: "\u4FDD\u7559\u4E2D" }, { value: "processing", label: "\u51E6\u7406\u4E2D" }, { value: "shipped", label: "\u767A\u9001\u6E08\u307F" }, { value: "completed", label: "\u5B8C\u4E86" }, { value: "cancelled", label: "\u30AD\u30E3\u30F3\u30BB\u30EB" }], R = { type: "list", resource: "orders", label: "\u6CE8\u6587\u4E00\u89A7", fields: [{ name: "id", label: "\u6CE8\u6587ID", kind: "text", sortable: true }, { name: "customer", label: "\u9867\u5BA2\u540D", kind: "text", sortable: true }, { name: "email", label: "\u30E1\u30FC\u30EB", kind: "email" }, { name: "total", label: "\u5408\u8A08\u91D1\u984D", kind: "currency", sortable: true }, { name: "status", label: "\u30B9\u30C6\u30FC\u30BF\u30B9", kind: "enum", sortable: true, options: n }, { name: "createdAt", label: "\u6CE8\u6587\u65E5\u6642", kind: "datetime", sortable: true }], rows: V.map((t) => ({ id: t.id, values: t, actions: [{ id: "view", label: "\u8A73\u7D30", allowed: true }, { id: "cancel", label: "\u30AD\u30E3\u30F3\u30BB\u30EB", allowed: t.status === "pending" || t.status === "processing", confirm: "\u6CE8\u6587\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }] })), headerActions: [{ id: "export", label: "\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8", allowed: true }], bulkActions: [], filters: { named: [] }, selection: { mode: "single", selected: [] }, search: { fields: ["id", "customer", "email"], query: "" }, defaultSort: { field: "createdAt", order: "desc" }, clickAction: "show" }, F = { type: "show", resource: "orders", label: "\u6CE8\u6587\u8A73\u7D30", id: "ORD-001", fields: [{ name: "id", label: "\u6CE8\u6587ID", kind: "text", value: "ORD-001" }, { name: "customer", label: "\u9867\u5BA2\u540D", kind: "text", value: "\u7530\u4E2D\u592A\u90CE" }, { name: "email", label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", kind: "email", value: "tanaka@example.com" }, { name: "total", label: "\u5408\u8A08\u91D1\u984D", kind: "currency", value: 156e3 }, { name: "status", label: "\u30B9\u30C6\u30FC\u30BF\u30B9", kind: "enum", value: "completed", options: n }, { name: "createdAt", label: "\u6CE8\u6587\u65E5\u6642", kind: "datetime", value: "2024-12-01T10:30:00" }], actions: [{ id: "print", label: "\u5370\u5237", allowed: true }, { id: "refund", label: "\u8FD4\u91D1", allowed: true, confirm: "\u8FD4\u91D1\u51E6\u7406\u3092\u884C\u3044\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }], groups: [{ id: "order", label: "\u6CE8\u6587\u60C5\u5831", fields: ["id", "status", "createdAt"] }, { id: "customer", label: "\u9867\u5BA2\u60C5\u5831", fields: ["customer", "email"] }, { id: "payment", label: "\u652F\u6255\u3044", fields: ["total"] }] }, M = { type: "form", resource: "orders", label: "\u6CE8\u6587\u30B9\u30C6\u30FC\u30BF\u30B9\u66F4\u65B0", mode: "edit", id: "ORD-003", fields: [{ name: "id", label: "\u6CE8\u6587ID", kind: "text", value: "ORD-003", required: true, readonly: true, errors: [] }, { name: "status", label: "\u30B9\u30C6\u30FC\u30BF\u30B9", kind: "enum", value: "processing", required: true, readonly: false, errors: [], options: n }, { name: "note", label: "\u5099\u8003", kind: "textarea", value: "", required: false, readonly: false, errors: [], placeholder: "\u5185\u90E8\u30E1\u30E2\u3092\u5165\u529B" }], actions: [{ id: "cancel", label: "\u30AD\u30E3\u30F3\u30BB\u30EB", allowed: true }], isValid: true, isDirty: false };
var L = ["<div", ' class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-gray-900">\u6CE8\u6587\u7BA1\u7406</h1><p class="mt-1 text-sm text-gray-500">\u6CE8\u6587\u306E\u4E00\u89A7\u3068\u8A73\u7D30\u3092\u7BA1\u7406\u3057\u307E\u3059</p></div><!--$-->', '<!--/--></div><div class="bg-white shadow rounded-lg overflow-hidden"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], m = ["<button", ' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">\u2190 \u4E00\u89A7\u306B\u623B\u308B</button>'];
function _() {
  const [t, l] = createSignal("list"), [u, b] = createSignal(R), [p] = createSignal(F), [f, h] = createSignal(M), v = (e) => {
    b((a) => ({ ...a, selection: { ...a.selection, selected: [e] } }));
  }, g = (e, a) => {
    console.log("List action:", e, a), e === "view" && l("show");
  }, w = (e) => {
    console.log("Show action:", e), e === "edit" && l("form");
  }, x = (e) => {
    e === "cancel" && l("list");
  }, y = (e, a) => {
    h((d) => ({ ...d, isDirty: true, fields: d.fields.map((o) => o.name === e ? { ...o, value: a } : o) }));
  }, k = () => {
    console.log("Form submitted"), l("list");
  };
  return ssr(L, ssrHydrationKey(), t() !== "list" && m[0] + ssrHydrationKey() + m[1], t() === "list" && escape(createComponent(Eh, { get vm() {
    return u();
  }, onAction: g, onSelect: v, onRowClick: () => l("show") })), t() === "show" && escape(createComponent(Ih, { get vm() {
    return p();
  }, onAction: w })), t() === "form" && escape(createComponent(Ph, { get vm() {
    return f();
  }, onChange: y, onSubmit: k, onAction: x })));
}

export { _ as default };
//# sourceMappingURL=orders.mjs.map
