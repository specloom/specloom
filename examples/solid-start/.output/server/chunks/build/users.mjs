import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { E as Eh, I as Ih, P as Ph } from './Show-CkBOW0P5.mjs';
import 'solid-js/store';

const L = [{ id: "1", name: "\u7530\u4E2D\u592A\u90CE", email: "tanaka@example.com", role: "admin", active: true, createdAt: "2024-01-15" }, { id: "2", name: "\u4F50\u85E4\u82B1\u5B50", email: "sato@example.com", role: "editor", active: true, createdAt: "2024-02-20" }, { id: "3", name: "\u9234\u6728\u4E00\u90CE", email: "suzuki@example.com", role: "viewer", active: false, createdAt: "2024-03-10" }, { id: "4", name: "\u9AD8\u6A4B\u7F8E\u54B2", email: "takahashi@example.com", role: "editor", active: true, createdAt: "2024-04-05" }, { id: "5", name: "\u5C71\u7530\u5065\u592A", email: "yamada@example.com", role: "viewer", active: true, createdAt: "2024-05-12" }], d = [{ value: "admin", label: "\u7BA1\u7406\u8005" }, { value: "editor", label: "\u7DE8\u96C6\u8005" }, { value: "viewer", label: "\u95B2\u89A7\u8005" }], $ = { type: "list", resource: "users", label: "\u30E6\u30FC\u30B6\u30FC\u4E00\u89A7", fields: [{ name: "name", label: "\u540D\u524D", kind: "text", sortable: true }, { name: "email", label: "\u30E1\u30FC\u30EB", kind: "email", sortable: true }, { name: "role", label: "\u6A29\u9650", kind: "enum", sortable: true, options: d }, { name: "active", label: "\u6709\u52B9", kind: "boolean" }, { name: "createdAt", label: "\u767B\u9332\u65E5", kind: "date", sortable: true }], rows: L.map((a) => ({ id: a.id, values: a, actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true, ui: { variant: "secondary" } }, { id: "delete", label: "\u524A\u9664", allowed: true, confirm: "\u672C\u5F53\u306B\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }] })), headerActions: [{ id: "create", label: "\u65B0\u898F\u4F5C\u6210", allowed: true, ui: { variant: "primary" } }], bulkActions: [{ id: "bulk-delete", label: "\u4E00\u62EC\u524A\u9664", allowed: true, confirm: "\u9078\u629E\u3057\u305F\u30E6\u30FC\u30B6\u30FC\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }, { id: "bulk-export", label: "\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8", allowed: true }], filters: { named: [] }, selection: { mode: "multi", selected: [] }, search: { fields: ["name", "email"], query: "" }, defaultSort: { field: "createdAt", order: "desc" }, clickAction: "show" }, q = { type: "show", resource: "users", label: "\u30E6\u30FC\u30B6\u30FC\u8A73\u7D30", id: "1", fields: [{ name: "name", label: "\u540D\u524D", kind: "text", value: "\u7530\u4E2D\u592A\u90CE" }, { name: "email", label: "\u30E1\u30FC\u30EB", kind: "email", value: "tanaka@example.com" }, { name: "role", label: "\u6A29\u9650", kind: "enum", value: "admin", options: d }, { name: "active", label: "\u6709\u52B9", kind: "boolean", value: true }, { name: "createdAt", label: "\u767B\u9332\u65E5", kind: "date", value: "2024-01-15" }], actions: [{ id: "edit", label: "\u7DE8\u96C6", allowed: true, ui: { variant: "primary" } }, { id: "delete", label: "\u524A\u9664", allowed: true, confirm: "\u672C\u5F53\u306B\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F", ui: { variant: "danger" } }], groups: [{ id: "basic", label: "\u57FA\u672C\u60C5\u5831", fields: ["name", "email"] }, { id: "settings", label: "\u8A2D\u5B9A", fields: ["role", "active", "createdAt"] }] }, C = { type: "form", resource: "users", label: "\u30E6\u30FC\u30B6\u30FC\u7DE8\u96C6", mode: "edit", id: "1", fields: [{ name: "name", label: "\u540D\u524D", kind: "text", value: "\u7530\u4E2D\u592A\u90CE", required: true, readonly: false, errors: [], placeholder: "\u540D\u524D\u3092\u5165\u529B" }, { name: "email", label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", kind: "email", value: "tanaka@example.com", required: true, readonly: false, errors: [], placeholder: "email@example.com" }, { name: "role", label: "\u6A29\u9650", kind: "enum", value: "admin", required: true, readonly: false, errors: [], options: d }, { name: "active", label: "\u6709\u52B9", kind: "boolean", value: true, required: false, readonly: false, errors: [], hint: "\u7121\u52B9\u306B\u3059\u308B\u3068\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059" }], actions: [{ id: "cancel", label: "\u30AD\u30E3\u30F3\u30BB\u30EB", allowed: true }], isValid: true, isDirty: false, groups: [{ id: "basic", label: "\u57FA\u672C\u60C5\u5831", fields: ["name", "email"] }, { id: "settings", label: "\u8A2D\u5B9A", fields: ["role", "active"] }] };
var D = ["<div", ' class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-gray-900">\u30E6\u30FC\u30B6\u30FC\u7BA1\u7406</h1><p class="mt-1 text-sm text-gray-500">\u30E6\u30FC\u30B6\u30FC\u30A2\u30AB\u30A6\u30F3\u30C8\u306E\u7BA1\u7406\u3092\u884C\u3044\u307E\u3059</p></div><!--$-->', '<!--/--></div><div class="bg-white shadow rounded-lg overflow-hidden"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], u = ["<button", ' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">\u2190 \u4E00\u89A7\u306B\u623B\u308B</button>'];
function K() {
  const [a, i] = createSignal("list"), [b, c] = createSignal($), [f] = createSignal(q), [v, h] = createSignal(C), p = (e) => {
    c((l) => {
      const t = l.selection.selected.includes(e) ? l.selection.selected.filter((o) => o !== e) : [...l.selection.selected, e];
      return { ...l, selection: { ...l.selection, selected: t } };
    });
  }, w = () => {
    c((e) => {
      const l = e.selection.selected.length === e.rows.length;
      return { ...e, selection: { ...e.selection, selected: l ? [] : e.rows.map((t) => t.id) } };
    });
  }, g = (e, l) => {
    console.log("List action:", e, l), (e === "create" || e === "edit") && i("form");
  }, k = (e) => {
    console.log("Show action:", e), e === "edit" && i("form");
  }, y = (e) => {
    e === "cancel" && i("list");
  }, x = (e, l) => {
    h((t) => ({ ...t, isDirty: true, fields: t.fields.map((o) => o.name === e ? { ...o, value: l } : o) }));
  }, A = () => {
    console.log("Form submitted"), i("list");
  };
  return ssr(D, ssrHydrationKey(), a() !== "list" && u[0] + ssrHydrationKey() + u[1], a() === "list" && escape(createComponent(Eh, { get vm() {
    return b();
  }, onAction: g, onSelect: p, onSelectAll: w, onRowClick: () => i("show") })), a() === "show" && escape(createComponent(Ih, { get vm() {
    return f();
  }, onAction: k })), a() === "form" && escape(createComponent(Ph, { get vm() {
    return v();
  }, onChange: x, onSubmit: A, onAction: y })));
}

export { K as default };
//# sourceMappingURL=users.mjs.map
