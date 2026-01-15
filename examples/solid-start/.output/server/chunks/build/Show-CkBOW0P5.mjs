import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent, mergeProps, Portal, Index, Dynamic } from 'solid-js/web';
import { Show, For, createSignal, Switch, Match, createContext, splitProps, useContext, createEffect, createUniqueId, createMemo, Index as Index$1, mergeProps as mergeProps$1, untrack, onMount, onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

const Jo = { format: { booleanTrue: "\u306F\u3044", booleanFalse: "\u3044\u3044\u3048", empty: "-" }, validation: { required: (e) => `${e}\u306F\u5FC5\u9808\u3067\u3059`, minLength: (e) => `${e}\u6587\u5B57\u4EE5\u4E0A\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044`, maxLength: (e) => `${e}\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044`, min: (e) => `${e}\u4EE5\u4E0A\u306E\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044`, max: (e) => `${e}\u4EE5\u4E0B\u306E\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044`, minItems: (e) => `${e}\u4EF6\u4EE5\u4E0A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044`, maxItems: (e) => `${e}\u4EF6\u4EE5\u5185\u3067\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044`, email: "\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", url: "\u6709\u52B9\u306AURL\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", tel: "\u6709\u52B9\u306A\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", pattern: "\u5165\u529B\u5F62\u5F0F\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093" }, intlLocale: "ja-JP", defaultCurrency: "JPY" }, Qo = { format: { booleanTrue: "Yes", booleanFalse: "No", empty: "-" }, validation: { required: (e) => `${e} is required`, minLength: (e) => `Must be at least ${e} characters`, maxLength: (e) => `Must be at most ${e} characters`, min: (e) => `Must be at least ${e}`, max: (e) => `Must be at most ${e}`, minItems: (e) => `Select at least ${e} items`, maxItems: (e) => `Select at most ${e} items`, email: "Please enter a valid email address", url: "Please enter a valid URL", tel: "Please enter a valid phone number", pattern: "Invalid format" }, intlLocale: "en-US", defaultCurrency: "USD" }, es = { ja: Jo, en: Qo };
function ts(e = "ja") {
  let n = e;
  return { getLocale: () => n, setLocale: (t) => {
    n = t;
  }, t: (t) => es[t != null ? t : n], resolveLocale: (t) => t.startsWith("ja") ? "ja" : "en" };
}
const De = ts("ja"), J = { date: (e, n) => {
  var _a2, _b;
  if (e == null) return "";
  try {
    const t = e instanceof Date ? e : new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const r = De.t();
    return t.toLocaleDateString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { dateStyle: (_b = n == null ? void 0 : n.dateStyle) != null ? _b : "medium" });
  } catch {
    return String(e);
  }
}, time: (e, n) => {
  var _a2, _b;
  if (e == null) return "";
  try {
    const t = e instanceof Date ? e : new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const r = De.t();
    return t.toLocaleTimeString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { timeStyle: (_b = n == null ? void 0 : n.timeStyle) != null ? _b : "short" });
  } catch {
    return String(e);
  }
}, datetime: (e, n) => {
  var _a2, _b, _c2;
  if (e == null) return "";
  try {
    const t = e instanceof Date ? e : new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const r = De.t();
    return t.toLocaleString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { dateStyle: (_b = n == null ? void 0 : n.dateStyle) != null ? _b : "medium", timeStyle: (_c2 = n == null ? void 0 : n.timeStyle) != null ? _c2 : "short" });
  } catch {
    return String(e);
  }
}, number: (e, n) => {
  var _a2;
  if (e == null) return "";
  const t = typeof e == "string" ? parseFloat(e) : e;
  if (isNaN(t)) return String(e);
  const r = De.t();
  return t.toLocaleString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { maximumFractionDigits: n == null ? void 0 : n.maximumFractionDigits, minimumFractionDigits: n == null ? void 0 : n.minimumFractionDigits });
}, currency: (e, n) => {
  var _a2, _b;
  if (e == null) return "";
  const t = typeof e == "string" ? parseFloat(e) : e;
  if (isNaN(t)) return String(e);
  const r = De.t();
  return t.toLocaleString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { style: "currency", currency: (_b = n == null ? void 0 : n.currency) != null ? _b : r.defaultCurrency });
}, percent: (e, n) => {
  var _a2, _b;
  if (e == null) return "";
  const t = typeof e == "string" ? parseFloat(e) : e;
  if (isNaN(t)) return String(e);
  const r = De.t();
  return t.toLocaleString((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : r.intlLocale, { style: "percent", maximumFractionDigits: (_b = n == null ? void 0 : n.maximumFractionDigits) != null ? _b : 0 });
}, boolean: (e, n) => {
  var _a2, _b;
  if (e == null) return "";
  const t = De.t();
  return e ? (_a2 = n == null ? void 0 : n.true) != null ? _a2 : t.format.booleanTrue : (_b = n == null ? void 0 : n.false) != null ? _b : t.format.booleanFalse;
}, list: (e, n) => e == null || e.length === 0 ? "" : e.map(String).join(n != null ? n : ", "), truncate: (e, n, t) => e == null ? "" : e.length <= n ? e : e.slice(0, n) + (t != null ? t : "..."), fileSize: (e) => {
  if (e == null) return "";
  if (e === 0) return "0 B";
  const n = ["B", "KB", "MB", "GB", "TB"], t = Math.floor(Math.log(e) / Math.log(1024));
  return `${(e / Math.pow(1024, t)).toFixed(t > 0 ? 1 : 0)} ${n[t]}`;
}, relative: (e, n) => {
  var _a2;
  if (e == null) return "";
  try {
    const t = e instanceof Date ? e : new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const i = (/* @__PURE__ */ new Date()).getTime() - t.getTime(), o = Math.floor(i / 1e3), s = Math.floor(o / 60), a = Math.floor(s / 60), c = Math.floor(a / 24), u = De.t(), d = new Intl.RelativeTimeFormat((_a2 = n == null ? void 0 : n.locale) != null ? _a2 : u.intlLocale, { numeric: "auto" });
    return c > 30 ? J.date(e, n) : c > 0 ? d.format(-c, "day") : a > 0 ? d.format(-a, "hour") : s > 0 ? d.format(-s, "minute") : d.format(-o, "second");
  } catch {
    return String(e);
  }
}, auto: (e, n, t) => {
  if (e == null) return "";
  switch (n) {
    case "date":
      return J.date(e, t);
    case "datetime":
      return J.datetime(e, t);
    case "number":
    case "integer":
      return J.number(e, t);
    case "currency":
      return J.currency(e, t);
    case "boolean":
      return J.boolean(e);
    case "multiselect":
    case "tags":
      return J.list(e);
    default:
      return String(e);
  }
}, field: (e, n, t) => {
  var _a2, _b, _c2, _d2, _e2, _f2, _g2;
  const r = De.t();
  if (e == null) return r.format.empty;
  switch (n.kind) {
    case "boolean":
      return J.boolean(e);
    case "date":
      return J.date(e, t) || r.format.empty;
    case "datetime":
      return J.datetime(e, t) || r.format.empty;
    case "number":
    case "integer":
      return J.number(e, t) || r.format.empty;
    case "currency":
      return J.currency(e, t) || r.format.empty;
    case "enum":
    case "status":
      return (_c2 = (_b = (_a2 = n.options) == null ? void 0 : _a2.find((i) => i.value === e)) == null ? void 0 : _b.label) != null ? _c2 : String(e);
    case "relation": {
      if (typeof e != "object" || e === null) return String(e);
      const i = e, o = (_e2 = (_d2 = n.relation) == null ? void 0 : _d2.labelField) != null ? _e2 : "name";
      return String((_g2 = (_f2 = i[o]) != null ? _f2 : i.id) != null ? _g2 : r.format.empty);
    }
    case "multiselect":
    case "tags":
      return J.list(e) || r.format.empty;
    default:
      return String(e);
  }
} }, _ = { fields: (e) => e.fields, field: (e, n) => e.fields.find((t) => t.name === n), sortable: (e, n) => {
  var _a2, _b;
  return (_b = (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.sortable) != null ? _b : false;
}, sortField: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.defaultSort) == null ? void 0 : _a2.field) != null ? _b : null;
}, sortOrder: (e, n) => {
  var _a2;
  return ((_a2 = e.defaultSort) == null ? void 0 : _a2.field) === n ? e.defaultSort.order : null;
}, sortIcon: (e, n) => {
  const t = _.sortOrder(e, n);
  return t === "asc" ? "\u2191" : t === "desc" ? "\u2193" : "\u21C5";
}, searchable: (e) => e.search.fields.length > 0, searchQuery: (e) => e.search.query, searchFields: (e) => e.search.fields, selectable: (e) => e.selection.mode !== "none", multiSelect: (e) => e.selection.mode === "multi", singleSelect: (e) => e.selection.mode === "single", selected: (e, n) => e.selection.selected.includes(n), allSelected: (e) => e.rows.length > 0 && e.selection.selected.length === e.rows.length, selectedIds: (e) => e.selection.selected, selectedCount: (e) => e.selection.selected.length, selectedRows: (e) => e.rows.filter((n) => e.selection.selected.includes(n.id)), filters: (e) => e.filters.named, activeFilters: (e) => e.filters.named.filter((n) => n.active), filterActive: (e, n) => {
  var _a2, _b;
  return (_b = (_a2 = e.filters.named.find((t) => t.id === n)) == null ? void 0 : _a2.active) != null ? _b : false;
}, customFilter: (e) => e.filters.custom, page: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.pagination) == null ? void 0 : _a2.page) != null ? _b : 1;
}, pageSize: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.pagination) == null ? void 0 : _a2.pageSize) != null ? _b : e.rows.length;
}, total: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.pagination) == null ? void 0 : _a2.totalCount) != null ? _b : e.rows.length;
}, totalPages: (e) => {
  var _a2, _b;
  const n = (_a2 = e.pagination) == null ? void 0 : _a2.pageSize, t = (_b = e.pagination) == null ? void 0 : _b.totalCount;
  return !n || !t ? 1 : Math.ceil(t / n);
}, hasNext: (e) => _.page(e) < _.totalPages(e), hasPrev: (e) => _.page(e) > 1, headerActions: (e) => e.headerActions, bulkActions: (e) => e.bulkActions, rowActions: (e) => e.actions, allowedActions: (e) => e.filter((n) => n.allowed), rows: (e) => e.rows, row: (e, n) => e.rows.find((t) => t.id === n), rowCount: (e) => e.rows.length, empty: (e) => e.rows.length === 0, cellValue: (e, n) => e.values[n], formatCell: (e, n, t) => J.field(n, e, t), loading: (e) => {
  var _a2;
  return (_a2 = e.isLoading) != null ? _a2 : false;
}, error: (e) => e.error, label: (e) => e.label, resource: (e) => e.resource, clickAction: (e) => e.clickAction }, le = { fields: (e) => e.fields, field: (e, n) => e.fields.find((t) => t.name === n), visibleFields: (e) => e.fields.filter((n) => n.visible !== false), requiredFields: (e) => e.fields.filter((n) => n.required), readonlyFields: (e) => e.fields.filter((n) => n.readonly), value: (e, n) => {
  var _a2;
  return (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.value;
}, values: (e) => e.fields.reduce((n, t) => (n[t.name] = t.value, n), {}), valid: (e) => e.isValid, dirty: (e) => e.isDirty, errors: (e) => e.fields.filter((n) => n.errors.length > 0).map((n) => ({ field: n.name, errors: n.errors })), fieldErrors: (e, n) => {
  var _a2, _b;
  return (_b = (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.errors) != null ? _b : [];
}, hasError: (e, n) => {
  var _a2, _b;
  return ((_b = (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.errors.length) != null ? _b : 0) > 0;
}, hasErrors: (e) => e.fields.some((n) => n.errors.length > 0), fieldsWithErrors: (e) => e.fields.filter((n) => n.errors.length > 0), hint: (e, n) => {
  var _a2;
  return (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.hint;
}, placeholder: (e, n) => {
  var _a2;
  return (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.placeholder;
}, visible: (e, n) => {
  var _a2;
  return ((_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.visible) !== false;
}, required: (e, n) => {
  var _a2, _b;
  return (_b = (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.required) != null ? _b : false;
}, readonly: (e, n) => {
  var _a2, _b;
  return (_b = (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.readonly) != null ? _b : false;
}, groups: (e) => {
  var _a2;
  return (_a2 = e.groups) != null ? _a2 : [];
}, fieldsInGroup: (e, n) => {
  var _a2;
  const t = (_a2 = e.groups) == null ? void 0 : _a2.find((r) => r.id === n);
  return t ? e.fields.filter((r) => t.fields.includes(r.name)) : [];
}, actions: (e) => e.actions, allowedActions: (e) => e.actions.filter((n) => n.allowed), canSubmit: (e) => e.isValid && !e.isSubmitting, loading: (e) => {
  var _a2;
  return (_a2 = e.isLoading) != null ? _a2 : false;
}, submitting: (e) => {
  var _a2;
  return (_a2 = e.isSubmitting) != null ? _a2 : false;
}, error: (e) => e.error, label: (e) => e.label, resource: (e) => e.resource, mode: (e) => e.mode, id: (e) => e.id }, Pe = { fields: (e) => e.fields, field: (e, n) => e.fields.find((t) => t.name === n), value: (e, n) => {
  var _a2;
  return (_a2 = e.fields.find((t) => t.name === n)) == null ? void 0 : _a2.value;
}, formatValue: (e, n, t) => J.field(n, e, t), groups: (e) => {
  var _a2;
  return (_a2 = e.groups) != null ? _a2 : [];
}, fieldsInGroup: (e, n) => {
  var _a2;
  const t = (_a2 = e.groups) == null ? void 0 : _a2.find((r) => r.id === n);
  return t ? e.fields.filter((r) => t.fields.includes(r.name)) : [];
}, actions: (e) => e.actions, allowedActions: (e) => e.actions.filter((n) => n.allowed), loading: (e) => {
  var _a2;
  return (_a2 = e.isLoading) != null ? _a2 : false;
}, error: (e) => e.error, label: (e) => e.label, resource: (e) => e.resource, id: (e) => e.id }, bt = { allowed: (e) => e.allowed, needsConfirm: (e) => !!e.confirm, confirmMsg: (e) => e.confirm, variant: (e) => {
  var _a2;
  return (_a2 = e.ui) == null ? void 0 : _a2.variant;
}, icon: (e) => {
  var _a2;
  return (_a2 = e.ui) == null ? void 0 : _a2.icon;
} };
var ns = (e) => typeof e == "function", kr = (e, ...n) => ns(e) ? e(...n) : e;
function rs(e) {
  const [n, t] = createSignal(kr(e.defaultValue)), r = createMemo(() => {
    var _a2;
    return ((_a2 = e.value) == null ? void 0 : _a2.call(e)) !== void 0;
  }), i = createMemo(() => {
    var _a2;
    return r() ? (_a2 = e.value) == null ? void 0 : _a2.call(e) : n();
  });
  return [i, (s) => {
    untrack(() => {
      var _a2;
      const a = kr(s, i());
      return r() || t(a), (_a2 = e.onChange) == null ? void 0 : _a2.call(e, a);
    });
  }];
}
var W = () => (e, n) => splitProps(e, n);
const is = /* @__PURE__ */ Symbol(), Ar = Object.getPrototypeOf, rr = /* @__PURE__ */ new WeakMap(), os = (e) => e && (rr.has(e) ? rr.get(e) : Ar(e) === Object.prototype || Ar(e) === Array.prototype), ss = (e) => os(e) && e[is] || null, Lr = (e, n = true) => {
  rr.set(e, n);
};
function as() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof self < "u") return self;
  if (typeof global < "u") return global;
}
function ki(e, n) {
  const t = as();
  return t ? (t[e] || (t[e] = n()), t[e]) : n();
}
var Ht = ki("__zag__refSet", () => /* @__PURE__ */ new WeakSet()), ls = (e) => typeof e == "object" && e !== null && "$$typeof" in e && "props" in e, cs = (e) => typeof e == "object" && e !== null && "__v_isVNode" in e, us = (e) => typeof e == "object" && e !== null && "nodeType" in e && typeof e.nodeName == "string", ds = (e) => ls(e) || cs(e) || us(e), ir = (e) => e !== null && typeof e == "object", or = (e) => ir(e) && !Ht.has(e) && (Array.isArray(e) || !(Symbol.iterator in e)) && !ds(e) && !(e instanceof WeakMap) && !(e instanceof WeakSet) && !(e instanceof Error) && !(e instanceof Number) && !(e instanceof Date) && !(e instanceof String) && !(e instanceof RegExp) && !(e instanceof ArrayBuffer) && !(e instanceof Promise);
function $r(e, n, t) {
  typeof t.value == "object" && !or(t.value) && (t.value = lt(t.value)), !t.enumerable || t.get || t.set || !t.configurable || !t.writable || n === "__proto__" ? Object.defineProperty(e, n, t) : e[n] = t.value;
}
function lt(e) {
  if (typeof e != "object") return e;
  var n = 0, t, r, i, o = Object.prototype.toString.call(e);
  if (o === "[object Object]" ? i = Object.create(Object.getPrototypeOf(e) || null) : o === "[object Array]" ? i = Array(e.length) : o === "[object Set]" ? (i = /* @__PURE__ */ new Set(), e.forEach(function(s) {
    i.add(lt(s));
  })) : o === "[object Map]" ? (i = /* @__PURE__ */ new Map(), e.forEach(function(s, a) {
    i.set(lt(a), lt(s));
  })) : o === "[object Date]" ? i = /* @__PURE__ */ new Date(+e) : o === "[object RegExp]" ? i = new RegExp(e.source, e.flags) : o === "[object DataView]" ? i = new e.constructor(lt(e.buffer)) : o === "[object ArrayBuffer]" ? i = e.slice(0) : o === "[object Blob]" ? i = e.slice() : o.slice(-6) === "Array]" && (i = new e.constructor(e)), i) {
    for (r = Object.getOwnPropertySymbols(e); n < r.length; n++) $r(i, r[n], Object.getOwnPropertyDescriptor(e, r[n]));
    for (n = 0, r = Object.getOwnPropertyNames(e); n < r.length; n++) Object.hasOwnProperty.call(i, t = r[n]) && i[t] === e[t] || $r(i, t, Object.getOwnPropertyDescriptor(e, t));
  }
  return i || e;
}
var at = ki("__zag__proxyStateMap", () => /* @__PURE__ */ new WeakMap()), gs = (e = Object.is, n = (a, c) => new Proxy(a, c), t = /* @__PURE__ */ new WeakMap(), r = (a, c) => {
  const u = t.get(a);
  if ((u == null ? void 0 : u[0]) === c) return u[1];
  const d = Array.isArray(a) ? [] : Object.create(Object.getPrototypeOf(a));
  return Lr(d, true), t.set(a, [c, d]), Reflect.ownKeys(a).forEach((g) => {
    const f = Reflect.get(a, g);
    Ht.has(f) ? (Lr(f, false), d[g] = f) : at.has(f) ? d[g] = It(f) : d[g] = f;
  }), Object.freeze(d);
}, i = /* @__PURE__ */ new WeakMap(), o = [1, 1], s = (a) => {
  if (!ir(a)) throw new Error("object required");
  const c = i.get(a);
  if (c) return c;
  let u = o[0];
  const d = /* @__PURE__ */ new Set(), g = (S, L = ++o[0]) => {
    u !== L && (u = L, d.forEach(($) => $(S, L)));
  };
  let f = o[1];
  const h = (S = ++o[1]) => (f !== S && !d.size && (f = S, b.forEach(([L]) => {
    const $ = L[1](S);
    $ > u && (u = $);
  })), u), m = (S) => (L, $) => {
    const R = [...L];
    R[1] = [S, ...R[1]], g(R, $);
  }, b = /* @__PURE__ */ new Map(), P = (S, L) => {
    if (d.size) {
      const $ = L[3](m(S));
      b.set(S, [L, $]);
    } else b.set(S, [L]);
  }, E = (S) => {
    var _a2;
    const L = b.get(S);
    L && (b.delete(S), (_a2 = L[1]) == null ? void 0 : _a2.call(L));
  }, p = (S) => (d.add(S), d.size === 1 && b.forEach(([$, R], G) => {
    const K = $[3](m(G));
    b.set(G, [$, K]);
  }), () => {
    d.delete(S), d.size === 0 && b.forEach(([$, R], G) => {
      R && (R(), b.set(G, [$]));
    });
  }), v = Array.isArray(a) ? [] : Object.create(Object.getPrototypeOf(a)), O = n(v, { deleteProperty(S, L) {
    const $ = Reflect.get(S, L);
    E(L);
    const R = Reflect.deleteProperty(S, L);
    return R && g(["delete", [L], $]), R;
  }, set(S, L, $, R) {
    var _a2;
    const G = Reflect.has(S, L), K = Reflect.get(S, L, R);
    if (G && (e(K, $) || i.has($) && e(K, i.get($)))) return true;
    E(L), ir($) && ($ = ss($) || $);
    let ce = $;
    if (!((_a2 = Object.getOwnPropertyDescriptor(S, L)) == null ? void 0 : _a2.set)) {
      !at.has($) && or($) && (ce = pr($));
      const z = !Ht.has(ce) && at.get(ce);
      z && P(L, z);
    }
    return Reflect.set(S, L, ce, R), g(["set", [L], $, K]), true;
  } });
  i.set(a, O);
  const M = [v, h, r, p];
  return at.set(O, M), Reflect.ownKeys(a).forEach((S) => {
    const L = Object.getOwnPropertyDescriptor(a, S);
    L.get || L.set ? Object.defineProperty(v, S, L) : O[S] = a[S];
  }), O;
}) => [s, at, Ht, e, n, or, t, r, i, o], [fs] = gs();
function pr(e = {}) {
  return fs(e);
}
function Dr(e, n, t) {
  const r = at.get(e);
  let i;
  const o = [], s = r[3];
  let a = false;
  const u = s((d) => {
    if (o.push(d), t) {
      n(o.splice(0));
      return;
    }
    i || (i = Promise.resolve().then(() => {
      i = void 0, a && n(o.splice(0));
    }));
  });
  return a = true, () => {
    a = false, u();
  };
}
function It(e) {
  const n = at.get(e), [t, r, i] = n;
  return i(t, r());
}
function ze(e) {
  return Ht.add(e), e;
}
function hs(e, n) {
  Object.keys(n).forEach((i) => {
    if (Object.getOwnPropertyDescriptor(e, i)) throw new Error("object property already defined");
    const o = n[i], { get: s, set: a } = typeof o == "function" ? { get: o } : o, c = {};
    c.get = () => s(It(r)), a && (c.set = (u) => a(r, u)), Object.defineProperty(e, i, c);
  });
  const r = pr(e);
  return r;
}
var ms = (e, n) => e.indexOf(n) !== -1, ps = (e, ...n) => e.concat(n), vs = (e, ...n) => e.filter((t) => !n.includes(t)), bs = (e, n) => ms(e, n) ? vs(e, n) : ps(e, n);
function ys(e) {
  for (; e.length > 0; ) e.pop();
  return e;
}
var Fr = (e) => (e == null ? void 0 : e.constructor.name) === "Array", Es = (e, n) => {
  if (e.length !== n.length) return false;
  for (let t = 0; t < e.length; t++) if (!fe(e[t], n[t])) return false;
  return true;
}, fe = (e, n) => {
  if (Object.is(e, n)) return true;
  if (e == null && n != null || e != null && n == null) return false;
  if (typeof (e == null ? void 0 : e.isEqual) == "function" && typeof (n == null ? void 0 : n.isEqual) == "function") return e.isEqual(n);
  if (typeof e == "function" && typeof n == "function") return e.toString() === n.toString();
  if (Fr(e) && Fr(n)) return Es(Array.from(e), Array.from(n));
  if (typeof e != "object" || typeof n != "object") return false;
  const t = Object.keys(n != null ? n : /* @__PURE__ */ Object.create(null)), r = t.length;
  for (let i = 0; i < r; i++) if (!Reflect.has(e, t[i])) return false;
  for (let i = 0; i < r; i++) {
    const o = t[i];
    if (!fe(e[o], n[o])) return false;
  }
  return true;
}, sr = (e, ...n) => {
  var _a2;
  return (_a2 = typeof e == "function" ? e(...n) : e) != null ? _a2 : void 0;
}, Ve = (e) => e, Ai = () => {
}, xn = (...e) => (...n) => {
  e.forEach(function(t) {
    t == null ? void 0 : t(...n);
  });
}, Vr = /* @__PURE__ */ (() => {
  let e = 0;
  return () => (e++, e.toString(36));
})(), wn = (e) => Array.isArray(e), Li = (e) => e != null && typeof e == "object", ct = (e) => Li(e) && !wn(e), Ps = (e) => typeof e == "number" && !Number.isNaN(e), ge = (e) => typeof e == "string", jt = (e) => typeof e == "function", Is = (e) => e == null, Bt = (e, n) => Object.prototype.hasOwnProperty.call(e, n), xs = (e) => Object.prototype.toString.call(e), $i = Function.prototype.toString, ws = $i.call(Object), nn = (e) => {
  if (!Li(e) || xs(e) != "[object Object]") return false;
  const n = Object.getPrototypeOf(e);
  if (n === null) return true;
  const t = Bt(n, "constructor") && n.constructor;
  return typeof t == "function" && t instanceof t && $i.call(t) == ws;
}, { floor: Ts, round: Cs, min: Ss, max: Os } = Math, Ns = (e) => Number.isNaN(e), gt = (e) => Ns(e) ? 0 : e, Rs = (e, n) => (e % n + n) % n, ks = (e, n) => gt(e) >= n, As = (e, n) => gt(e) <= n, Ls = (e, n, t) => gt(e) >= n && gt(e) <= t, rn = (e, n, t) => Ss(Os(gt(e), n), t), Wt = (e, n) => typeof n == "number" ? Ts(e * n + 0.5) / n : Cs(e), Mr = (e) => {
  if (!Number.isFinite(e)) return 0;
  let n = 1, t = 0;
  for (; Math.round(e * n) / n !== e; ) n *= 10, t += 1;
  return t;
}, Di = (e, n, t) => {
  let r = n === "+" ? e + t : e - t;
  if (e % 1 !== 0 || t % 1 !== 0) {
    const i = 10 ** Math.max(Mr(e), Mr(t));
    e = Math.round(e * i), t = Math.round(t * i), r = n === "+" ? e + t : e - t, r /= i;
  }
  return r;
}, $s = (e, n) => Di(gt(e), "+", n), Ds = (e, n) => Di(gt(e), "-", n);
function Ae(e) {
  if (!Fs(e) || e === void 0) return e;
  const n = Reflect.ownKeys(e).filter((r) => typeof r == "string"), t = {};
  for (const r of n) {
    const i = e[r];
    i !== void 0 && (t[r] = Ae(i));
  }
  return t;
}
var Fs = (e) => e && typeof e == "object" && e.constructor === Object;
function yn(...e) {
  e.length === 1 ? e[0] : e[1], e.length === 2 && e[0];
}
function En(...e) {
  e.length === 1 ? e[0] : e[1], e.length === 2 && e[0];
}
var Vs = Object.defineProperty, Ms = (e, n, t) => n in e ? Vs(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t, T = (e, n, t) => Ms(e, typeof n != "symbol" ? n + "" : n, t);
function Fi(e, ...n) {
  if (!nn(e)) throw new TypeError("Source argument must be a plain object");
  for (const t of n) {
    if (!nn(t)) continue;
    const r = Ae(t);
    for (const i in r) {
      if (!Object.prototype.hasOwnProperty.call(r, i) || i === "__proto__" || i === "constructor" || i === "prototype") continue;
      const o = e[i], s = t[i];
      nn(s) ? e[i] = nn(o) ? Fi(o, s) : { ...s } : e[i] = s;
    }
  }
  return e;
}
function Ee(e) {
  return ge(e) ? { type: e } : e;
}
function je(e) {
  return e ? wn(e) ? e.slice() : [e] : [];
}
function Vi(e) {
  return ct(e) && e.predicate != null;
}
var Mi = () => true;
function $n(e, n, t, r) {
  return (i) => {
    var _a2;
    return ge(i) ? !!((_a2 = e[i]) == null ? void 0 : _a2.call(e, n, t, r)) : jt(i) ? i(n, t, r) : i.predicate(e)(n, t, r);
  };
}
function _s(...e) {
  return { predicate: (n) => (t, r, i) => e.map($n(n, t, r, i)).some(Boolean) };
}
function Gs(...e) {
  return { predicate: (n) => (t, r, i) => e.map($n(n, t, r, i)).every(Boolean) };
}
function Hs(e) {
  return { predicate: (n) => (t, r, i) => !$n(n, t, r, i)(e) };
}
var Dn = { or: _s, and: Gs, not: Hs };
function Bs(e) {
  return { predicate: (n) => (t, r, i) => {
    var _a2;
    return (_a2 = e.find((o) => {
      var _a3;
      const s = (_a3 = o.guard) != null ? _a3 : Mi;
      return $n(n, t, r, i)(s);
    })) == null ? void 0 : _a2.actions;
  } };
}
function _i(e, n) {
  return e = e != null ? e : Mi, (t, r, i) => {
    if (ge(e)) {
      const o = n[e];
      return jt(o) ? o(t, r, i) : o;
    }
    return Vi(e) ? e.predicate(n)(t, r, i) : e == null ? void 0 : e(t, r, i);
  };
}
function jn(e, n) {
  return (t, r, i) => Vi(e) ? e.predicate(n)(t, r, i) : e;
}
function Ws(e) {
  var _a2, _b, _c2, _d2, _e2;
  const n = (_a2 = e.computed) != null ? _a2 : Ve({}), t = (_b = e.context) != null ? _b : Ve({}), r = e.initial ? (_d2 = (_c2 = e.states) == null ? void 0 : _c2[e.initial]) == null ? void 0 : _d2.tags : [], i = pr({ value: (_e2 = e.initial) != null ? _e2 : "", previousValue: "", event: Ve({}), previousEvent: Ve({}), context: hs(t, n), done: false, tags: r != null ? r : [], hasTag(o) {
    return this.tags.includes(o);
  }, matches(...o) {
    return o.includes(this.value);
  }, can(o) {
    return Ve(this).nextEvents.includes(o);
  }, get nextEvents() {
    var _a3, _b2, _c3, _d3;
    const o = (_c3 = (_b2 = (_a3 = e.states) == null ? void 0 : _a3[this.value]) == null ? void 0 : _b2.on) != null ? _c3 : {}, s = (_d3 = e == null ? void 0 : e.on) != null ? _d3 : {};
    return Object.keys({ ...o, ...s });
  }, get changed() {
    return this.event.value === "machine.init" || !this.previousValue ? false : this.value !== this.previousValue;
  } });
  return Ve(i);
}
function At(e, n) {
  return (t, r) => {
    if (Ps(e)) return e;
    if (jt(e)) return e(t, r);
    if (ge(e)) {
      const i = Number.parseFloat(e);
      if (!Number.isNaN(i)) return i;
      if (n) {
        const o = n == null ? void 0 : n[e];
        return En(o == null, `[@zag-js/core > determine-delay] Cannot determine delay for \`${e}\`. It doesn't exist in \`options.delays\``), jt(o) ? o(t, r) : o;
      }
    }
  };
}
function Us(e) {
  return ge(e) ? { target: e } : e;
}
function js(e, n) {
  return (t, r, i) => je(e).map(Us).find((o) => {
    var _a2, _b;
    return (_b = (_a2 = _i(o.guard, n)(t, r, i)) != null ? _a2 : o.target) != null ? _b : o.actions;
  });
}
var Ks = class {
  constructor(e, n) {
    var _a2, _b, _c2, _d2, _e2, _f2, _g2, _h, _i2, _j, _k;
    T(this, "status", "Not Started"), T(this, "state"), T(this, "initialState"), T(this, "initialContext"), T(this, "id"), T(this, "type", "machine"), T(this, "activityEvents", /* @__PURE__ */ new Map()), T(this, "delayedEvents", /* @__PURE__ */ new Map()), T(this, "stateListeners", /* @__PURE__ */ new Set()), T(this, "doneListeners", /* @__PURE__ */ new Set()), T(this, "contextWatchers", /* @__PURE__ */ new Set()), T(this, "removeStateListener", Ai), T(this, "parent"), T(this, "children", /* @__PURE__ */ new Map()), T(this, "guardMap"), T(this, "actionMap"), T(this, "delayMap"), T(this, "activityMap"), T(this, "sync"), T(this, "options"), T(this, "config"), T(this, "_created", () => {
      if (!this.config.created) return;
      const t = Ee("machine.created");
      this.executeActions(this.config.created, t);
    }), T(this, "start", (t) => {
      if (this.state.value = "", this.state.tags = [], this.status === "Running") return this;
      this.status = "Running", this.removeStateListener = Dr(this.state, () => {
        this.stateListeners.forEach((c) => {
          c(this.stateSnapshot);
        });
      }, this.sync), this.setupContextWatchers(), this.executeActivities(Ee("machine.start"), je(this.config.activities), "machine.start"), this.executeActions(this.config.entry, Ee("machine.start"));
      const r = Ee("machine.init"), i = ct(t) ? t.value : t, o = ct(t) ? t.context : void 0;
      o && this.setContext(o);
      const s = { target: i != null ? i : this.config.initial }, a = this.getNextStateInfo(s, r);
      return this.initialState = a, this.performStateChangeEffects(this.state.value, a, r), this;
    }), T(this, "setupContextWatchers", () => {
      const { watch: t } = this.config;
      if (!t) return;
      let r = It(this.state.context);
      const i = Dr(this.state.context, () => {
        var _a3, _b2;
        const o = It(this.state.context);
        for (const [s, a] of Object.entries(t)) ((_b2 = (_a3 = this.options.compareFns) == null ? void 0 : _a3[s]) != null ? _b2 : Object.is)(r[s], o[s]) || this.executeActions(a, this.state.event);
        r = o;
      });
      this.contextWatchers.add(i);
    }), T(this, "stop", () => {
      if (this.status !== "Stopped") return this.performExitEffects(this.state.value, Ee("machine.stop")), this.executeActions(this.config.exit, Ee("machine.stop")), this.setState(""), this.setEvent("machine.stop"), this.stopStateListeners(), this.stopChildren(), this.stopActivities(), this.stopDelayedEvents(), this.stopContextWatchers(), this.status = "Stopped", this;
    }), T(this, "stopStateListeners", () => {
      this.removeStateListener(), this.stateListeners.clear();
    }), T(this, "stopContextWatchers", () => {
      this.contextWatchers.forEach((t) => t()), this.contextWatchers.clear();
    }), T(this, "stopDelayedEvents", () => {
      this.delayedEvents.forEach((t) => {
        t.forEach((r) => r());
      }), this.delayedEvents.clear();
    }), T(this, "stopActivities", (t) => {
      var _a3, _b2;
      t ? ((_a3 = this.activityEvents.get(t)) == null ? void 0 : _a3.forEach((r) => r()), (_b2 = this.activityEvents.get(t)) == null ? void 0 : _b2.clear(), this.activityEvents.delete(t)) : (this.activityEvents.forEach((r) => {
        r.forEach((i) => i()), r.clear();
      }), this.activityEvents.clear());
    }), T(this, "sendChild", (t, r) => {
      const i = Ee(t), o = sr(r, this.contextSnapshot), s = this.children.get(o);
      s || En(`[@zag-js/core] Cannot send '${i.type}' event to unknown child`), s.send(i);
    }), T(this, "stopChild", (t) => {
      this.children.has(t) || En(`[@zag-js/core > stop-child] Cannot stop unknown child ${t}`), this.children.get(t).stop(), this.children.delete(t);
    }), T(this, "removeChild", (t) => {
      this.children.delete(t);
    }), T(this, "stopChildren", () => {
      this.children.forEach((t) => t.stop()), this.children.clear();
    }), T(this, "setParent", (t) => {
      this.parent = t;
    }), T(this, "spawn", (t, r) => {
      const i = sr(t);
      return r && (i.id = r), i.type = "machine.actor", i.setParent(this), this.children.set(i.id, Ve(i)), i.onDone(() => {
        this.removeChild(i.id);
      }).start(), Ve(ze(i));
    }), T(this, "stopActivity", (t) => {
      var _a3;
      if (!this.state.value) return;
      const r = this.activityEvents.get(this.state.value);
      (_a3 = r == null ? void 0 : r.get(t)) == null ? void 0 : _a3(), r == null ? void 0 : r.delete(t);
    }), T(this, "addActivityCleanup", (t, r, i) => {
      var _a3;
      t && (this.activityEvents.has(t) ? (_a3 = this.activityEvents.get(t)) == null ? void 0 : _a3.set(r, i) : this.activityEvents.set(t, /* @__PURE__ */ new Map([[r, i]])));
    }), T(this, "setState", (t) => {
      this.state.previousValue = this.state.value, this.state.value = t;
      const r = this.getStateNode(t);
      t == null ? ys(this.state.tags) : this.state.tags = je(r == null ? void 0 : r.tags);
    }), T(this, "setContext", (t) => {
      t && Fi(this.state.context, t);
    }), T(this, "setOptions", (t) => {
      const r = Ae(t);
      this.actionMap = { ...this.actionMap, ...r.actions }, this.delayMap = { ...this.delayMap, ...r.delays }, this.activityMap = { ...this.activityMap, ...r.activities }, this.guardMap = { ...this.guardMap, ...r.guards };
    }), T(this, "getStateNode", (t) => {
      var _a3;
      if (t) return (_a3 = this.config.states) == null ? void 0 : _a3[t];
    }), T(this, "getNextStateInfo", (t, r) => {
      var _a3;
      const i = this.determineTransition(t, r), o = !(i == null ? void 0 : i.target), s = (_a3 = i == null ? void 0 : i.target) != null ? _a3 : this.state.value, a = this.state.value !== s, c = this.getStateNode(s), d = { reenter: !o && !a && !(i == null ? void 0 : i.internal), transition: i, stateNode: c, target: s, changed: a };
      return this.log("NextState:", `[${r.type}]`, this.state.value, "---->", d.target), d;
    }), T(this, "getAfterActions", (t, r) => {
      let i;
      const o = this.state.value;
      return { entry: () => {
        i = globalThis.setTimeout(() => {
          const s = this.getNextStateInfo(t, this.state.event);
          this.performStateChangeEffects(o, s, this.state.event);
        }, r);
      }, exit: () => {
        globalThis.clearTimeout(i);
      } };
    }), T(this, "getDelayedEventActions", (t) => {
      const r = this.getStateNode(t), i = this.state.event;
      if (!r || !r.after) return;
      const o = [], s = [];
      if (wn(r.after)) {
        const a = this.determineTransition(r.after, i);
        if (!a) return;
        if (!Bt(a, "delay")) throw new Error(`[@zag-js/core > after] Delay is required for after transition: ${JSON.stringify(a)}`);
        const u = At(a.delay, this.delayMap)(this.contextSnapshot, i), d = this.getAfterActions(a, u);
        return o.push(d.entry), s.push(d.exit), { entries: o, exits: s };
      }
      if (ct(r.after)) for (const a in r.after) {
        const c = r.after[a], d = At(a, this.delayMap)(this.contextSnapshot, i), g = this.getAfterActions(c, d);
        o.push(g.entry), s.push(g.exit);
      }
      return { entries: o, exits: s };
    }), T(this, "executeActions", (t, r) => {
      var _a3;
      const i = jn(t, this.guardMap)(this.contextSnapshot, r, this.guardMeta);
      for (const o of je(i)) {
        const s = ge(o) ? (_a3 = this.actionMap) == null ? void 0 : _a3[o] : o;
        yn(ge(o) && !s, `[@zag-js/core > execute-actions] No implementation found for action: \`${o}\``), s == null ? void 0 : s(this.state.context, r, this.meta);
      }
    }), T(this, "executeActivities", (t, r, i) => {
      var _a3;
      for (const o of r) {
        const s = ge(o) ? (_a3 = this.activityMap) == null ? void 0 : _a3[o] : o;
        if (!s) {
          yn(`[@zag-js/core > execute-activity] No implementation found for activity: \`${o}\``);
          continue;
        }
        const a = s(this.state.context, t, this.meta);
        if (a) {
          const c = ge(o) ? o : o.name || Vr();
          this.addActivityCleanup(i != null ? i : this.state.value, c, a);
        }
      }
    }), T(this, "createEveryActivities", (t, r) => {
      if (t) if (wn(t)) {
        const i = je(t).find((c) => {
          var _a3;
          const u = c.delay, g = At(u, this.delayMap)(this.contextSnapshot, this.state.event);
          return (_a3 = _i(c.guard, this.guardMap)(this.contextSnapshot, this.state.event, this.guardMeta)) != null ? _a3 : g != null;
        });
        if (!i) return;
        const s = At(i.delay, this.delayMap)(this.contextSnapshot, this.state.event);
        r(() => {
          const c = globalThis.setInterval(() => {
            this.executeActions(i.actions, this.state.event);
          }, s);
          return () => {
            globalThis.clearInterval(c);
          };
        });
      } else for (const i in t) {
        const o = t == null ? void 0 : t[i], a = At(i, this.delayMap)(this.contextSnapshot, this.state.event);
        r(() => {
          const u = globalThis.setInterval(() => {
            this.executeActions(o, this.state.event);
          }, a);
          return () => {
            globalThis.clearInterval(u);
          };
        });
      }
    }), T(this, "setEvent", (t) => {
      this.state.previousEvent = this.state.event, this.state.event = ze(Ee(t));
    }), T(this, "performExitEffects", (t, r) => {
      const i = this.state.value;
      if (i === "") return;
      const o = t ? this.getStateNode(t) : void 0;
      this.stopActivities(i);
      const s = jn(o == null ? void 0 : o.exit, this.guardMap)(this.contextSnapshot, r, this.guardMeta), a = je(s), c = this.delayedEvents.get(i);
      c && a.push(...c), this.executeActions(a, r), this.delayedEvents.delete(i);
    }), T(this, "performEntryEffects", (t, r) => {
      const i = this.getStateNode(t), o = je(i == null ? void 0 : i.activities);
      this.createEveryActivities(i == null ? void 0 : i.every, (u) => {
        o.unshift(u);
      }), o.length > 0 && this.executeActivities(r, o);
      const s = jn(i == null ? void 0 : i.entry, this.guardMap)(this.contextSnapshot, r, this.guardMeta), a = je(s), c = this.getDelayedEventActions(t);
      (i == null ? void 0 : i.after) && c && (this.delayedEvents.set(t, c == null ? void 0 : c.exits), a.push(...c.entries)), this.executeActions(a, r), (i == null ? void 0 : i.type) === "final" && (this.state.done = true, this.doneListeners.forEach((u) => {
        u(this.stateSnapshot);
      }), this.stop());
    }), T(this, "performTransitionEffects", (t, r) => {
      const i = this.determineTransition(t, r);
      this.executeActions(i == null ? void 0 : i.actions, r);
    }), T(this, "performStateChangeEffects", (t, r, i) => {
      this.setEvent(i);
      const o = r.changed || r.reenter;
      o && this.performExitEffects(t, i), this.performTransitionEffects(r.transition, i), this.setState(r.target), o && this.performEntryEffects(r.target, i);
    }), T(this, "determineTransition", (t, r) => {
      var _a3;
      return (_a3 = js(t, this.guardMap)) == null ? void 0 : _a3(this.contextSnapshot, r, this.guardMeta);
    }), T(this, "sendParent", (t) => {
      var _a3;
      this.parent || En("[@zag-js/core > send-parent] Cannot send event to an unknown parent");
      const r = Ee(t);
      (_a3 = this.parent) == null ? void 0 : _a3.send(r);
    }), T(this, "log", (...t) => {
    }), T(this, "send", (t) => {
      const r = Ee(t);
      this.transition(this.state.value, r);
    }), T(this, "transition", (t, r) => {
      var _a3, _b2, _c3;
      const i = ge(t) ? this.getStateNode(t) : t == null ? void 0 : t.stateNode, o = Ee(r);
      if (!i && !this.config.on) {
        const c = this.status === "Stopped" ? "[@zag-js/core > transition] Cannot transition a stopped machine" : `[@zag-js/core > transition] State does not have a definition for \`state\`: ${t}, \`event\`: ${o.type}`;
        yn(c);
        return;
      }
      const s = (_c3 = (_a3 = i == null ? void 0 : i.on) == null ? void 0 : _a3[o.type]) != null ? _c3 : (_b2 = this.config.on) == null ? void 0 : _b2[o.type], a = this.getNextStateInfo(s, o);
      return this.performStateChangeEffects(this.state.value, a, o), a.stateNode;
    }), T(this, "subscribe", (t) => (this.stateListeners.add(t), this.status === "Running" && t(this.stateSnapshot), () => {
      this.stateListeners.delete(t);
    })), T(this, "onDone", (t) => (this.doneListeners.add(t), this)), T(this, "onTransition", (t) => (this.stateListeners.add(t), this.status === "Running" && t(this.stateSnapshot), this)), this.config = lt(e), this.options = lt(n != null ? n : {}), this.id = (_a2 = this.config.id) != null ? _a2 : `machine-${Vr()}`, this.guardMap = (_c2 = (_b = this.options) == null ? void 0 : _b.guards) != null ? _c2 : {}, this.actionMap = (_e2 = (_d2 = this.options) == null ? void 0 : _d2.actions) != null ? _e2 : {}, this.delayMap = (_g2 = (_f2 = this.options) == null ? void 0 : _f2.delays) != null ? _g2 : {}, this.activityMap = (_i2 = (_h = this.options) == null ? void 0 : _h.activities) != null ? _i2 : {}, this.sync = (_k = (_j = this.options) == null ? void 0 : _j.sync) != null ? _k : false, this.state = Ws(this.config), this.initialContext = It(this.state.context);
  }
  get stateSnapshot() {
    return Ve(It(this.state));
  }
  getState() {
    return this.stateSnapshot;
  }
  get contextSnapshot() {
    return this.stateSnapshot.context;
  }
  get self() {
    const e = this;
    return { id: this.id, send: this.send.bind(this), sendParent: this.sendParent.bind(this), sendChild: this.sendChild.bind(this), stop: this.stop.bind(this), stopChild: this.stopChild.bind(this), spawn: this.spawn.bind(this), stopActivity: this.stopActivity.bind(this), get state() {
      return e.stateSnapshot;
    }, get initialContext() {
      return e.initialContext;
    }, get initialState() {
      var _a2, _b;
      return (_b = (_a2 = e.initialState) == null ? void 0 : _a2.target) != null ? _b : "";
    } };
  }
  get meta() {
    var _a2, _b;
    return { state: this.stateSnapshot, guards: this.guardMap, send: this.send.bind(this), self: this.self, initialContext: this.initialContext, initialState: (_b = (_a2 = this.initialState) == null ? void 0 : _a2.target) != null ? _b : "", getState: () => this.stateSnapshot, getAction: (e) => this.actionMap[e], getGuard: (e) => this.guardMap[e] };
  }
  get guardMeta() {
    return { state: this.stateSnapshot };
  }
  get [Symbol.toStringTag]() {
    return "Machine";
  }
  getHydrationState() {
    const e = this.getState();
    return { value: e.value, tags: e.tags };
  }
}, mt = (e, n) => new Ks(e, n), qs = (...e) => e.map((n) => {
  var _a2;
  return (_a2 = n == null ? void 0 : n.trim) == null ? void 0 : _a2.call(n);
}).filter(Boolean).join(" "), zs = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g, _r = (e) => {
  const n = {};
  let t;
  for (; t = zs.exec(e); ) n[t[1]] = t[2];
  return n;
}, Xs = (e, n) => {
  if (ge(e)) {
    if (ge(n)) return `${e};${n}`;
    e = _r(e);
  } else ge(n) && (n = _r(n));
  return Object.assign({}, e != null ? e : {}, n != null ? n : {});
};
function Ys(...e) {
  let n = {};
  for (let t of e) {
    for (let r in n) {
      if (r.startsWith("on") && typeof n[r] == "function" && typeof t[r] == "function") {
        n[r] = xn(t[r], n[r]);
        continue;
      }
      if (r === "className" || r === "class") {
        n[r] = qs(n[r], t[r]);
        continue;
      }
      if (r === "style") {
        n[r] = Xs(n[r], t[r]);
        continue;
      }
      n[r] = t[r] !== void 0 ? t[r] : n[r];
    }
    for (let r in t) n[r] === void 0 && (n[r] = t[r]);
  }
  return n;
}
function Zs(e) {
  return new Proxy({}, { get() {
    return e;
  } });
}
var Ce = () => (e) => Array.from(new Set(e));
function I(...e) {
  const n = {};
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    if (typeof r == "function" && (r = r()), r) {
      const i = Object.getOwnPropertyDescriptors(r);
      for (const o in i) o in n || Object.defineProperty(n, o, { enumerable: true, get() {
        let s = {};
        if (o === "style" || o === "class" || o === "className" || o.startsWith("on")) {
          for (let a = 0; a < e.length; a++) {
            let c = e[a];
            typeof c == "function" && (c = c()), s = Ys(s, { [o]: (c || {})[o] });
          }
          return s[o];
        }
        for (let a = e.length - 1; a >= 0; a--) {
          let c, u = e[a];
          if (typeof u == "function" && (u = u()), c = (u || {})[o], c !== void 0) return c;
        }
      } });
    }
  }
  return n;
}
var Js = (e) => Array.isArray(e), Qs = (e) => e != null && typeof e == "object", ea = (e) => Qs(e) && !Js(e), ta = (e) => typeof e == "number" && !Number.isNaN(e), Gi = (e) => typeof e == "string", na = Function.prototype.toString;
na.call(Object);
var Gr = { onFocus: "onFocusIn", onBlur: "onFocusOut", onDoubleClick: "onDblClick", onChange: "onInput", defaultChecked: "checked", defaultValue: "value", htmlFor: "for", className: "class" }, ra = (e) => e.startsWith("--") ? e : ca(e);
function ia(e) {
  return e in Gr ? Gr[e] : e;
}
var Ct = Zs((e) => {
  const n = {};
  for (const t in e) {
    const r = e[t];
    if (!(t === "readOnly" && r === false)) {
      if (t === "style" && ea(r)) {
        n.style = oa(r);
        continue;
      }
      if (t === "children") {
        Gi(r) && (n.textContent = r);
        continue;
      }
      n[ia(t)] = r;
    }
  }
  return n;
});
function oa(e) {
  let n = {};
  for (const t in e) {
    const r = e[t];
    !Gi(r) && !ta(r) || (n[ra(t)] = r);
  }
  return n;
}
var sa = /[A-Z]/g, aa = /^ms-/;
function la(e) {
  return "-" + e.toLowerCase();
}
var Kn = {};
function ca(e) {
  if (Kn.hasOwnProperty(e)) return Kn[e];
  var n = e.replace(sa, la);
  return Kn[e] = aa.test(n) ? "-" + n : n;
}
function ua(e, n) {
  const { actions: t, context: r } = n != null ? n : {}, [i, o] = createStore(e.getState());
  return onMount(() => {
    const s = e.subscribe((a) => {
      o(reconcile(a));
    });
    onCleanup(() => {
      s();
    });
  }), createEffect(() => {
    const s = typeof r == "function" ? r() : r;
    e.setContext(s);
  }), createEffect(() => {
    e.setOptions({ actions: t });
  }), i;
}
function da(e, n) {
  const { state: t, context: r } = n != null ? n : {}, i = (() => {
    const o = typeof e == "function" ? e() : e, s = typeof r == "function" ? r() : r;
    return s && o.setContext(s), o._created(), o;
  })();
  return onMount(() => {
    i.start(t), onCleanup(() => {
      i.stop();
    });
  }), i;
}
function pt(e, n) {
  const t = da(e, n);
  return [ua(t, n), t.send, t];
}
var qn = (e) => (t) => {
  const [r, i] = splitProps(t, ["asChild"]);
  if (r.asChild) {
    const o = (s) => {
      const [, a] = splitProps(i, ["ref"]);
      return I(a, s);
    };
    return r.asChild(o);
  }
  return createComponent(Dynamic, mergeProps({ component: e }, i));
};
function ga() {
  const e = /* @__PURE__ */ new Map();
  return new Proxy(qn, { apply(n, t, r) {
    return qn(r[0]);
  }, get(n, t) {
    const r = t;
    return e.has(r) || e.set(r, qn(r)), e.get(r);
  } });
}
var w = ga();
function fa(e, n) {
  return `${e} returned \`undefined\`. Seems you forgot to wrap component within ${n}`;
}
function te(e = {}) {
  const { strict: n = true, hookName: t = "useContext", providerName: r = "Provider", errorMessage: i, defaultValue: o } = e, s = createContext(o);
  function a() {
    var _a2;
    const c = useContext(s);
    if (!c && n) {
      const u = new Error(i != null ? i : fa(t, r));
      throw u.name = "ContextError", (_a2 = Error.captureStackTrace) == null ? void 0 : _a2.call(Error, u, a), u;
    }
    return c;
  }
  return [s.Provider, a, s];
}
var ha = Object.defineProperty, Ze = (e, n) => {
  for (var t in n) ha(e, t, { get: n[t], enumerable: true });
}, ma = (e, n) => e.map((t, r) => e[(Math.max(n, 0) + r) % e.length]), zn = (...e) => (n) => e.reduce((t, r) => r(t), n), on = () => {
}, Fn = (e) => typeof e == "object" && e !== null, pa = 2147483647, x = (e) => e ? "" : void 0, Tn = (e) => e ? "true" : void 0, va = 1, ba = 9, ya = 11, ee = (e) => Fn(e) && e.nodeType === va && typeof e.nodeName == "string", vr = (e) => Fn(e) && e.nodeType === ba, Ea = (e) => Fn(e) && e === e.window, Hi = (e) => ee(e) ? e.localName || "" : "#document";
function Pa(e) {
  return ["html", "body", "#document"].includes(Hi(e));
}
var Ia = (e) => Fn(e) && e.nodeType !== void 0, Cn = (e) => Ia(e) && e.nodeType === ya && "host" in e, xa = (e) => ee(e) && e.localName === "input", wa = (e) => ee(e) ? e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0 : false, Ta = /(textarea|select)/;
function Bi(e) {
  if (e == null || !ee(e)) return false;
  try {
    return xa(e) && e.selectionStart != null || Ta.test(e.localName) || e.isContentEditable || e.getAttribute("contenteditable") === "true" || e.getAttribute("contenteditable") === "";
  } catch {
    return false;
  }
}
function wt(e, n) {
  var _a2;
  if (!e || !n || !ee(e) || !ee(n)) return false;
  const t = (_a2 = n.getRootNode) == null ? void 0 : _a2.call(n);
  if (e === n || e.contains(n)) return true;
  if (t && Cn(t)) {
    let r = n;
    for (; r; ) {
      if (e === r) return true;
      r = r.parentNode || r.host;
    }
  }
  return false;
}
function ve(e) {
  var _a2;
  return vr(e) ? e : Ea(e) ? e.document : (_a2 = e == null ? void 0 : e.ownerDocument) != null ? _a2 : document;
}
function Ca(e) {
  return ve(e).documentElement;
}
function ae(e) {
  var _a2, _b, _c2;
  return Cn(e) ? ae(e.host) : vr(e) ? (_a2 = e.defaultView) != null ? _a2 : window : ee(e) ? (_c2 = (_b = e.ownerDocument) == null ? void 0 : _b.defaultView) != null ? _c2 : window : window;
}
function Wi(e) {
  let n = e.activeElement;
  for (; n == null ? void 0 : n.shadowRoot; ) {
    const t = n.shadowRoot.activeElement;
    if (t === n) break;
    n = t;
  }
  return n;
}
function Sa(e) {
  if (Hi(e) === "html") return e;
  const n = e.assignedSlot || e.parentNode || Cn(e) && e.host || Ca(e);
  return Cn(n) ? n.host : n;
}
var Xn = /* @__PURE__ */ new WeakMap();
function Ui(e) {
  return Xn.has(e) || Xn.set(e, ae(e).getComputedStyle(e)), Xn.get(e);
}
var ji = () => typeof document < "u";
function Oa() {
  var _a2, _b;
  return (_b = (_a2 = navigator.userAgentData) == null ? void 0 : _a2.platform) != null ? _b : navigator.platform;
}
var br = (e) => ji() && e.test(Oa()), Na = (e) => ji() && e.test(navigator.vendor), Ki = () => br(/^Mac/), qi = () => Ra() && Na(/apple/i), Ra = () => br(/mac|iphone|ipad|ipod/i), ka = () => br(/iP(hone|ad|od)|iOS/);
function Aa(e) {
  var _a2, _b, _c2, _d2;
  return (_d2 = (_a2 = e.composedPath) == null ? void 0 : _a2.call(e)) != null ? _d2 : (_c2 = (_b = e.nativeEvent) == null ? void 0 : _b.composedPath) == null ? void 0 : _c2.call(_b);
}
function oe(e) {
  var _a2, _b;
  return (_b = (_a2 = Aa(e)) == null ? void 0 : _a2[0]) != null ? _b : e.target;
}
var La = (e) => wt(e.currentTarget, oe(e));
function $a(e) {
  return Ma(e).isComposing;
}
var Hr = (e) => e.button === 0, Da = (e) => e.button === 2 || Ki() && e.ctrlKey && e.button === 0, Br = (e) => e.ctrlKey || e.altKey || e.metaKey, Fa = (e) => "touches" in e && e.touches.length > 0, Va = { Up: "ArrowUp", Down: "ArrowDown", Esc: "Escape", " ": "Space", ",": "Comma", Left: "ArrowLeft", Right: "ArrowRight" }, Wr = { ArrowLeft: "ArrowRight", ArrowRight: "ArrowLeft" };
function Ur(e, n = {}) {
  var _a2;
  const { dir: t = "ltr", orientation: r = "horizontal" } = n;
  let i = e.key;
  return i = (_a2 = Va[i]) != null ? _a2 : i, t === "rtl" && r === "horizontal" && i in Wr && (i = Wr[i]), i;
}
function Ma(e) {
  var _a2;
  return (_a2 = e.nativeEvent) != null ? _a2 : e;
}
var _a = /* @__PURE__ */ new Set(["PageUp", "PageDown"]), Ga = /* @__PURE__ */ new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
function Ha(e) {
  return e.ctrlKey || e.metaKey ? 0.1 : _a.has(e.key) || e.shiftKey && Ga.has(e.key) ? 10 : 1;
}
function zi(e, n = "client") {
  const t = Fa(e) ? e.touches[0] || e.changedTouches[0] : e;
  return { x: t[`${n}X`], y: t[`${n}Y`] };
}
var j = (e, n, t, r) => {
  const i = typeof e == "function" ? e() : e;
  return i == null ? void 0 : i.addEventListener(n, t, r), () => {
    i == null ? void 0 : i.removeEventListener(n, t, r);
  };
};
function Xi(e, n) {
  var _a2;
  const { type: t = "HTMLInputElement", property: r = "value" } = n, i = ae(e)[t].prototype;
  return (_a2 = Object.getOwnPropertyDescriptor(i, r)) != null ? _a2 : {};
}
function Ba(e) {
  if (e.localName === "input") return "HTMLInputElement";
  if (e.localName === "textarea") return "HTMLTextAreaElement";
  if (e.localName === "select") return "HTMLSelectElement";
}
function Yi(e, n, t = "value") {
  var _a2;
  const r = Ba(e);
  r && ((_a2 = Xi(e, { type: r, property: t }).set) == null ? void 0 : _a2.call(e, n)), e.setAttribute(t, n);
}
function Zi(e, n) {
  var _a2;
  (_a2 = Xi(e, { type: "HTMLInputElement", property: "checked" }).set) == null ? void 0 : _a2.call(e, n), n ? e.setAttribute("checked", "") : e.removeAttribute("checked");
}
function Ji(e, n) {
  const { checked: t, bubbles: r = true } = n;
  if (!e) return;
  const i = ae(e);
  e instanceof i.HTMLInputElement && (Zi(e, t), e.dispatchEvent(new i.Event("click", { bubbles: r })));
}
function Wa(e) {
  return Ua(e) ? e.form : e.closest("form");
}
function Ua(e) {
  return e.matches("textarea, input, select, button");
}
function ja(e, n) {
  if (!e) return;
  const t = Wa(e), r = (i) => {
    i.defaultPrevented || n();
  };
  return t == null ? void 0 : t.addEventListener("reset", r, { passive: true }), () => t == null ? void 0 : t.removeEventListener("reset", r);
}
function Ka(e, n) {
  const t = e == null ? void 0 : e.closest("fieldset");
  if (!t) return;
  n(t.disabled);
  const r = ae(t), i = new r.MutationObserver(() => n(t.disabled));
  return i.observe(t, { attributes: true, attributeFilter: ["disabled"] }), () => i.disconnect();
}
function Vn(e, n) {
  if (!e) return;
  const { onFieldsetDisabledChange: t, onFormReset: r } = n, i = [ja(e, r), Ka(e, t)];
  return () => i.forEach((o) => o == null ? void 0 : o());
}
var Qi = (e) => ee(e) && e.tagName === "IFRAME", qa = (e) => !Number.isNaN(parseInt(e.getAttribute("tabindex") || "0", 10)), za = (e) => parseInt(e.getAttribute("tabindex") || "0", 10) < 0, yr = "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), details > summary:first-of-type", eo = (e, n = false) => {
  if (!e) return [];
  const t = Array.from(e.querySelectorAll(yr));
  (n == true || n == "if-empty" && t.length === 0) && ee(e) && qe(e) && t.unshift(e);
  const i = t.filter(qe);
  return i.forEach((o, s) => {
    if (Qi(o) && o.contentDocument) {
      const a = o.contentDocument.body;
      i.splice(s, 1, ...eo(a));
    }
  }), i;
};
function qe(e) {
  return !e || e.closest("[inert]") ? false : e.matches(yr) && wa(e);
}
function Mn(e, n) {
  if (!e) return [];
  const r = Array.from(e.querySelectorAll(yr)).filter(ot);
  return r.forEach((i, o) => {
    if (Qi(i) && i.contentDocument) {
      const s = i.contentDocument.body, a = Mn(s);
      r.splice(o, 1, ...a);
    }
  }), r.length, r;
}
function ot(e) {
  return e != null && e.tabIndex > 0 ? true : qe(e) && !za(e);
}
function Xa(e, n) {
  const t = Mn(e), r = t[0] || null, i = t[t.length - 1] || null;
  return [r, i];
}
function Lt(e) {
  return e.tabIndex < 0 && (/^(audio|video|details)$/.test(e.localName) || Bi(e)) && !qa(e) ? 0 : e.tabIndex;
}
function Ya(e) {
  const { root: n, getInitialEl: t, filter: r, enabled: i = true } = e;
  if (!i) return;
  let o = null;
  if (o || (o = typeof t == "function" ? t() : t), o || (o = n == null ? void 0 : n.querySelector("[data-autofocus],[autofocus]")), !o) {
    const s = Mn(n);
    o = r ? s.filter(r)[0] : s[0];
  }
  return o || n || void 0;
}
function Za(e) {
  const n = e.currentTarget;
  if (!n) return false;
  const [t, r] = Xa(n), i = n.ownerDocument || document;
  return !(i.activeElement === t && e.shiftKey || i.activeElement === r && !e.shiftKey || !t && !r);
}
function se(e) {
  const n = globalThis.requestAnimationFrame(e);
  return () => {
    globalThis.cancelAnimationFrame(n);
  };
}
function Ja(e, n) {
  if (!e) return;
  const { attributes: t, callback: r } = n, i = e.ownerDocument.defaultView || window, o = new i.MutationObserver((s) => {
    for (const a of s) a.type === "attributes" && a.attributeName && t.includes(a.attributeName) && r(a);
  });
  return o.observe(e, { attributes: true, attributeFilter: t }), () => o.disconnect();
}
function to(e, n) {
  const { defer: t } = n, r = t ? se : (o) => o(), i = [];
  return i.push(r(() => {
    const o = typeof e == "function" ? e() : e;
    i.push(Ja(o, n));
  })), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
function ar(e) {
  const n = Sa(e);
  return Pa(n) ? ve(n).body : ee(n) && no(n) ? n : ar(n);
}
var Qa = /auto|scroll|overlay|hidden|clip/;
function no(e) {
  const n = ae(e), { overflow: t, overflowX: r, overflowY: i, display: o } = n.getComputedStyle(e);
  return Qa.test(t + i + r) && !["inline", "contents"].includes(o);
}
function el(e) {
  return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth;
}
function tl(e, n) {
  const { rootEl: t, ...r } = n || {};
  !e || !t || !no(t) || !el(t) || e.scrollIntoView(r);
}
function nl(e, n) {
  const t = e.body, r = "pointerLockElement" in e || "mozPointerLockElement" in e, i = () => !!e.pointerLockElement;
  function o() {
  }
  function s(c) {
    i(), console.error("PointerLock error occurred:", c), e.exitPointerLock();
  }
  if (!r) return;
  try {
    t.requestPointerLock();
  } catch {
  }
  const a = [j(e, "pointerlockchange", o, false), j(e, "pointerlockerror", s, false)];
  return () => {
    a.forEach((c) => c()), e.exitPointerLock();
  };
}
function ro(e) {
  const { pointerNode: n, keyboardNode: t = n, onPress: r, onPressStart: i, onPressEnd: o, isValidKey: s = (v) => v.key === "Enter" } = e;
  if (!n) return on;
  const a = ae(n), c = ve(n);
  let u = on, d = on, g = on;
  const f = (v) => ({ point: zi(v), event: v });
  function h(v) {
    i == null ? void 0 : i(f(v));
  }
  function m(v) {
    o == null ? void 0 : o(f(v));
  }
  const P = j(n, "pointerdown", (v) => {
    d();
    const O = j(a, "pointerup", (S) => {
      const L = oe(S);
      wt(n, L) ? r == null ? void 0 : r(f(S)) : o == null ? void 0 : o(f(S));
    }, { passive: !r }), M = j(a, "pointercancel", m, { passive: !o });
    d = zn(O, M), c.activeElement === t && v.pointerType === "mouse" && v.preventDefault(), h(v);
  }, { passive: !i }), E = j(t, "focus", p);
  u = zn(P, E);
  function p() {
    const v = (S) => {
      if (!s(S)) return;
      const L = (R) => {
        if (!s(R)) return;
        const G = new a.PointerEvent("pointerup"), K = f(G);
        r == null ? void 0 : r(K), o == null ? void 0 : o(K);
      };
      d(), d = j(t, "keyup", L);
      const $ = new a.PointerEvent("pointerdown");
      h($);
    }, C = () => {
      const S = new a.PointerEvent("pointercancel");
      m(S);
    }, O = j(t, "keydown", v), M = j(t, "blur", C);
    g = zn(O, M);
  }
  return () => {
    u(), d(), g();
  };
}
var Er = (e) => e.id;
function rl(e, n, t = Er) {
  return e.find((r) => t(r) === n);
}
function il(e, n, t = Er) {
  const r = rl(e, n, t);
  return r ? e.indexOf(r) : -1;
}
function St(e) {
  const n = { getRootNode: (t) => {
    var _a2, _b;
    return (_b = (_a2 = t.getRootNode) == null ? void 0 : _a2.call(t)) != null ? _b : document;
  }, getDoc: (t) => ve(n.getRootNode(t)), getWin: (t) => {
    var _a2;
    return (_a2 = n.getDoc(t).defaultView) != null ? _a2 : window;
  }, getActiveElement: (t) => Wi(n.getRootNode(t)), isActiveElement: (t, r) => r === n.getActiveElement(t), getById: (t, r) => n.getRootNode(t).getElementById(r), setValue: (t, r) => {
    t == null || r == null || Yi(t, r.toString());
  } };
  return { ...n, ...e };
}
var ol = (e) => e.split("").map((n) => {
  const t = n.charCodeAt(0);
  return t > 0 && t < 128 ? n : t >= 128 && t <= 255 ? `/x${t.toString(16)}`.replace("/", "\\") : "";
}).join("").trim(), sl = (e) => {
  var _a2, _b, _c2;
  return ol((_c2 = (_b = (_a2 = e.dataset) == null ? void 0 : _a2.valuetext) != null ? _b : e.textContent) != null ? _c2 : "");
}, al = (e, n) => e.trim().toLowerCase().startsWith(n.toLowerCase());
function ll(e, n, t, r = Er) {
  const i = t ? il(e, t, r) : -1;
  let o = t ? ma(e, i) : e;
  return n.length === 1 && (o = o.filter((a) => r(a) !== t)), o.find((a) => al(sl(a), n));
}
var Yn = /* @__PURE__ */ new WeakMap();
function cl(e, n, t) {
  Yn.has(e) || Yn.set(e, /* @__PURE__ */ new Map());
  const r = Yn.get(e), i = r.get(n);
  if (!i) return r.set(n, t()), () => {
    var _a2;
    (_a2 = r.get(n)) == null ? void 0 : _a2(), r.delete(n);
  };
  const o = t(), s = () => {
    o(), i(), r.delete(n);
  };
  return r.set(n, s), () => {
    r.get(n) === s && (o(), r.set(n, i));
  };
}
function ul(e, n) {
  return e ? cl(e, "style", () => {
    const r = e.style.cssText;
    return Object.assign(e.style, n), () => {
      e.style.cssText = r;
    };
  }) : () => {
  };
}
function dl(e, n) {
  const { state: t, activeId: r, key: i, timeout: o = 350, itemToId: s } = n, a = t.keysSoFar + i, u = a.length > 1 && Array.from(a).every((m) => m === a[0]) ? a[0] : a;
  let d = e.slice();
  const g = ll(d, u, r, s);
  function f() {
    clearTimeout(t.timer), t.timer = -1;
  }
  function h(m) {
    t.keysSoFar = m, f(), m !== "" && (t.timer = +setTimeout(() => {
      h(""), f();
    }, o));
  }
  return h(a), g;
}
var lr = Object.assign(dl, { defaultOptions: { keysSoFar: "", timer: -1 }, isValidEvent: gl });
function gl(e) {
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey;
}
var Pr = { border: "0", clip: "rect(0 0 0 0)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0", position: "absolute", width: "1px", whiteSpace: "nowrap", wordWrap: "normal" }, fl = 1e3 / 60;
function hl(e, n) {
  const t = e();
  if (ee(t) && t.isConnected) return n(t), () => {
  };
  {
    const r = setInterval(() => {
      const i = e();
      ee(i) && i.isConnected && (n(i), clearInterval(r));
    }, fl);
    return () => clearInterval(r);
  }
}
function ml(e, n) {
  const t = [];
  return e == null ? void 0 : e.forEach((r) => {
    const i = hl(r, n);
    t.push(i);
  }), () => {
    t.forEach((r) => r());
  };
}
var xe = (e, n = []) => ({ parts: (...t) => {
  if (pl(n)) return xe(e, t);
  throw new Error("createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?");
}, extendWith: (...t) => xe(e, [...n, ...t]), rename: (t) => xe(t, n), keys: () => n, build: () => [...new Set(n)].reduce((t, r) => Object.assign(t, { [r]: { selector: [`&[data-scope="${yt(e)}"][data-part="${yt(r)}"]`, `& [data-scope="${yt(e)}"][data-part="${yt(r)}"]`].join(", "), attrs: { "data-scope": yt(e), "data-part": yt(r) } } }), {}) }), yt = (e) => e.replace(/([A-Z])([A-Z])/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase(), pl = (e) => e.length === 0, [io, Xt] = te({ hookName: "useFieldsetContext", providerName: "<FieldsetProvider />", strict: false }), vl = (e) => e.children(Xt()), bl = (e) => {
  const n = Xt(), t = I(() => n().getErrorTextProps(), e);
  return createComponent(Show, { get when() {
    return n().invalid;
  }, get children() {
    return createComponent(w.span, t);
  } });
}, yl = (e) => {
  const n = Xt(), t = I(() => n().getHelperTextProps(), e);
  return createComponent(w.span, t);
}, El = (e) => {
  const n = Xt(), t = I(() => n().getLegendProps(), e);
  return createComponent(w.legend, t);
}, Pl = xe("fieldset").parts("root", "errorText", "helperText", "legend"), sn = Pl.build(), Il = (e) => {
  var _a2;
  const { disabled: n = false, invalid: t = false } = e;
  let r;
  const i = (_a2 = e.id) != null ? _a2 : createUniqueId(), o = `fieldset::${i}::error-text`, s = `fieldset::${i}::helper-text`, [a, c] = createSignal(false), [u, d] = createSignal(false);
  createEffect(() => {
  });
  const g = [];
  a() && t && g.push(o), u() && g.push(s);
  const f = () => ({ ...sn.root.attrs, disabled: n, "data-disabled": an(n), "data-invalid": an(t), "aria-describedby": g.join(" ") || void 0 }), h = () => ({ ...sn.legend.attrs, "data-disabled": an(n), "data-invalid": an(t) }), m = () => ({ id: s, ...sn.helperText.attrs }), b = () => ({ id: o, ...sn.errorText.attrs, "aria-live": "polite" });
  return createMemo(() => ({ refs: { rootRef: r }, disabled: n, invalid: t, getRootProps: f, getLegendProps: h, getHelperTextProps: m, getErrorTextProps: b }));
}, an = (e) => e ? "" : void 0, oo = (e) => {
  const [n, t] = W()(e, ["id", "disabled", "invalid"]), r = Il(n), i = I(() => r().getRootProps(), t);
  return createComponent(io, { value: r, get children() {
    return createComponent(w.fieldset, i);
  } });
};
oo.displayName = "FieldsetRoot";
var xl = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(io, { value: n, get children() {
    return createComponent(w.fieldset, r);
  } });
}, wl = {};
Ze(wl, { Context: () => vl, ErrorText: () => bl, HelperText: () => yl, Legend: () => El, Root: () => oo, RootProvider: () => xl });
var Tl = (e) => {
}, [so, ne] = te({ hookName: "useFieldContext", providerName: "<FieldProvider />", strict: false }), Cl = (e) => e.children(ne()), Sl = (e) => {
  const n = ne(), t = I(() => n().getErrorTextProps(), e);
  return createComponent(Show, { get when() {
    return n == null ? void 0 : n().invalid;
  }, get children() {
    return createComponent(w.span, t);
  } });
}, Ol = (e) => {
  const n = ne(), t = I(() => n().getHelperTextProps(), e);
  return createComponent(w.span, t);
}, Nl = (e) => {
  const n = ne(), t = I(() => n == null ? void 0 : n().getInputProps(), e);
  return createComponent(w.input, t);
}, Rl = (e) => {
  const n = ne(), t = I(() => n == null ? void 0 : n().getLabelProps(), e);
  return createComponent(w.label, t);
}, kl = (e) => {
  const n = ne(), t = I(() => n().getRequiredIndicatorProps(), e);
  return createComponent(Show, { get when() {
    return n().required;
  }, get fallback() {
    return e.fallback;
  }, get children() {
    return createComponent(w.span, mergeProps(t, { get children() {
      var _a2;
      return (_a2 = e.children) != null ? _a2 : "*";
    } }));
  } });
}, Al = xe("field").parts("root", "errorText", "helperText", "input", "label", "select", "textarea", "requiredIndicator"), We = Al.build(), Ll = (e) => {
  var _a2, _b, _c2, _d2, _e2, _f2, _g2, _h, _i2;
  const n = Xt(), t = mergeProps$1({ disabled: !!(n == null ? void 0 : n().disabled), required: false, invalid: false, readOnly: false }, e), [r, i] = createSignal(false), [o, s] = createSignal(false), a = (_a2 = t.id) != null ? _a2 : createUniqueId();
  let c;
  const u = (_c2 = (_b = t.ids) == null ? void 0 : _b.control) != null ? _c2 : `field::${a}`, d = (_e2 = (_d2 = t.ids) == null ? void 0 : _d2.errorText) != null ? _e2 : `field::${a}::error-text`, g = (_g2 = (_f2 = t.ids) == null ? void 0 : _f2.helperText) != null ? _g2 : `field::${a}::helper-text`, f = (_i2 = (_h = t.ids) == null ? void 0 : _h.label) != null ? _i2 : `field::${a}::label`;
  createEffect(() => {
  });
  const h = () => ({ ...We.root.attrs, id: u, role: "group", "data-disabled": x(t.disabled), "data-invalid": x(t.invalid), "data-readonly": x(t.readOnly) }), m = () => ({ ...We.label.attrs, id: f, "data-disabled": x(t.disabled), "data-invalid": x(t.invalid), "data-readonly": x(t.readOnly), htmlFor: a }), b = [];
  r() && t.invalid && b.push(d), o() && b.push(g);
  const P = () => ({ "aria-describedby": b.join(" ") || void 0, "aria-invalid": Tn(t.invalid), "data-invalid": x(t.invalid), "data-required": x(t.required), "data-readonly": x(t.readOnly), id: a, required: t.required, disabled: t.disabled, readOnly: t.readOnly || void 0 }), E = () => ({ ...P(), ...We.input.attrs }), p = () => ({ ...P(), ...We.textarea.attrs }), v = () => ({ ...P(), ...We.select.attrs }), C = () => ({ id: g, ...We.helperText.attrs, "data-disabled": x(t.disabled) }), O = () => ({ id: d, ...We.errorText.attrs, "aria-live": "polite" }), M = () => ({ "aria-hidden": true, ...We.requiredIndicator.attrs });
  return createMemo(() => ({ ariaDescribedby: b.join(" "), ids: { control: a, label: f, errorText: d, helperText: g }, refs: { rootRef: c }, disabled: t.disabled, invalid: t.invalid, readOnly: t.readOnly, required: t.required, getLabelProps: m, getRootProps: h, getInputProps: E, getTextareaProps: p, getSelectProps: v, getHelperTextProps: C, getErrorTextProps: O, getRequiredIndicatorProps: M }));
}, $l = (e) => {
  const [n, t] = W()(e, ["id", "ids", "disabled", "invalid", "readOnly", "required"]), r = Ll(n), i = I(() => r().getRootProps(), t);
  return createComponent(so, { value: r, get children() {
    return createComponent(w.div, i);
  } });
}, Dl = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(so, { value: n, get children() {
    return createComponent(w.div, r);
  } });
}, Fl = (e) => {
  const n = ne(), t = I(() => n == null ? void 0 : n().getSelectProps(), e);
  return createComponent(w.select, t);
}, Vl = (e) => {
  const n = ne(), { autoresize: t, ...r } = e, i = I(() => n == null ? void 0 : n().getTextareaProps(), () => ({ style: { resize: t ? "none" : void 0 } }), r);
  return createEffect(() => t ? Tl() : void 0), createComponent(w.textarea, i);
}, q = {};
Ze(q, { Context: () => Cl, ErrorText: () => Sl, HelperText: () => Ol, Input: () => Nl, Label: () => Rl, RequiredIndicator: () => kl, Root: () => $l, RootProvider: () => Dl, Select: () => Fl, Textarea: () => Vl });
var [bh, Ot] = te({ hookName: "useEnvironmentContext", providerName: "<EnvironmentProvider />", strict: false, defaultValue: () => ({ getRootNode: () => document, getDocument: () => document, getWindow: () => window }) }), [yh, Nt] = te({ hookName: "useEnvironmentContext", providerName: "<EnvironmentProvider />", strict: false, defaultValue: () => ({ dir: "ltr", locale: "en-US" }) });
var Gl = /* @__PURE__ */ new Set(["checkbox", "radio", "range", "color", "file", "image", "button", "submit", "reset"]);
function Hl(e, n, t) {
  const r = t ? oe(t) : null, i = ae(r);
  return e = e || r instanceof i.HTMLInputElement && !Gl.has(r == null ? void 0 : r.type) || r instanceof i.HTMLTextAreaElement || r instanceof i.HTMLElement && r.isContentEditable, !(e && n === "keyboard" && t instanceof i.KeyboardEvent && !Reflect.has(Bl, t.key));
}
var vt = null, cr = /* @__PURE__ */ new Set(), Bl = { Tab: true, Escape: true };
function On() {
  return vt === "keyboard";
}
function uo(e = {}) {
  const { isTextInput: n, autoFocus: t, onChange: r, root: i } = e;
  r == null ? void 0 : r({ isFocusVisible: t || On(), modality: vt });
  const o = (s, a) => {
    Hl(!!n, s, a) && (r == null ? void 0 : r({ isFocusVisible: On(), modality: s }));
  };
  return cr.add(o), () => {
    cr.delete(o);
  };
}
var go = xe("checkbox").parts("root", "label", "control", "indicator"), ln = go.build(), Y = St({ getRootId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.root) != null ? _b : `checkbox:${e.id}`;
}, getLabelId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.label) != null ? _b : `checkbox:${e.id}:label`;
}, getControlId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.control) != null ? _b : `checkbox:${e.id}:control`;
}, getHiddenInputId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.hiddenInput) != null ? _b : `checkbox:${e.id}:input`;
}, getRootEl: (e) => Y.getById(e, Y.getRootId(e)), getHiddenInputEl: (e) => Y.getById(e, Y.getHiddenInputId(e)) });
function jl(e, n, t) {
  const r = e.context.isDisabled, i = e.context.readOnly, o = !r && e.context.focused, s = !r && e.context.focusVisible, a = e.context.isChecked, c = e.context.isIndeterminate, u = { "data-active": x(e.context.active), "data-focus": x(o), "data-focus-visible": x(s), "data-readonly": x(i), "data-hover": x(e.context.hovered), "data-disabled": x(r), "data-state": c ? "indeterminate" : e.context.checked ? "checked" : "unchecked", "data-invalid": x(e.context.invalid) };
  return { checked: a, disabled: r, indeterminate: c, focused: o, checkedState: e.context.checked, setChecked(d) {
    n({ type: "CHECKED.SET", checked: d, isTrusted: false });
  }, toggleChecked() {
    n({ type: "CHECKED.TOGGLE", checked: a, isTrusted: false });
  }, getRootProps() {
    return t.label({ ...ln.root.attrs, ...u, dir: e.context.dir, id: Y.getRootId(e.context), htmlFor: Y.getHiddenInputId(e.context), onPointerMove() {
      r || n({ type: "CONTEXT.SET", context: { hovered: true } });
    }, onPointerLeave() {
      r || n({ type: "CONTEXT.SET", context: { hovered: false } });
    }, onClick(d) {
      oe(d) === Y.getHiddenInputEl(e.context) && d.stopPropagation();
    } });
  }, getLabelProps() {
    return t.element({ ...ln.label.attrs, ...u, dir: e.context.dir, id: Y.getLabelId(e.context) });
  }, getControlProps() {
    return t.element({ ...ln.control.attrs, ...u, dir: e.context.dir, id: Y.getControlId(e.context), "aria-hidden": true });
  }, getIndicatorProps() {
    return t.element({ ...ln.indicator.attrs, ...u, dir: e.context.dir, hidden: !c && !e.context.checked });
  }, getHiddenInputProps() {
    return t.input({ id: Y.getHiddenInputId(e.context), type: "checkbox", required: e.context.required, defaultChecked: a, disabled: r, "aria-labelledby": Y.getLabelId(e.context), "aria-invalid": e.context.invalid, name: e.context.name, form: e.context.form, value: e.context.value, style: Pr, onFocus() {
      const d = On();
      n({ type: "CONTEXT.SET", context: { focused: true, focusVisible: d } });
    }, onBlur() {
      n({ type: "CONTEXT.SET", context: { focused: false, focusVisible: false } });
    }, onClick(d) {
      if (i) {
        d.preventDefault();
        return;
      }
      const g = d.currentTarget.checked;
      n({ type: "CHECKED.SET", checked: g, isTrusted: true });
    } });
  } };
}
var { not: jr } = Dn;
function Kl(e) {
  const n = Ae(e);
  return mt({ id: "checkbox", initial: "ready", context: { checked: false, value: "on", disabled: false, ...n, fieldsetDisabled: false, focusVisible: false }, watch: { disabled: "removeFocusIfNeeded", checked: "syncInputElement" }, activities: ["trackFormControlState", "trackPressEvent", "trackFocusVisible"], on: { "CHECKED.TOGGLE": [{ guard: jr("isTrusted"), actions: ["toggleChecked", "dispatchChangeEvent"] }, { actions: ["toggleChecked"] }], "CHECKED.SET": [{ guard: jr("isTrusted"), actions: ["setChecked", "dispatchChangeEvent"] }, { actions: ["setChecked"] }], "CONTEXT.SET": { actions: ["setContext"] } }, computed: { isIndeterminate: (t) => dr(t.checked), isChecked: (t) => Kr(t.checked), isDisabled: (t) => !!t.disabled || t.fieldsetDisabled }, states: { ready: {} } }, { guards: { isTrusted: (t, r) => !!r.isTrusted }, activities: { trackPressEvent(t) {
    if (!t.isDisabled) return ro({ pointerNode: Y.getRootEl(t), keyboardNode: Y.getHiddenInputEl(t), isValidKey: (r) => r.key === " ", onPress: () => t.active = false, onPressStart: () => t.active = true, onPressEnd: () => t.active = false });
  }, trackFocusVisible(t) {
    if (!t.isDisabled) return uo({ root: Y.getRootNode(t) });
  }, trackFormControlState(t, r, { send: i, initialContext: o }) {
    return Vn(Y.getHiddenInputEl(t), { onFieldsetDisabledChange(s) {
      t.fieldsetDisabled = s;
    }, onFormReset() {
      i({ type: "CHECKED.SET", checked: !!o.checked });
    } });
  } }, actions: { setContext(t, r) {
    Object.assign(t, r.context);
  }, syncInputElement(t) {
    const r = Y.getHiddenInputEl(t);
    r && (Zi(r, t.isChecked), r.indeterminate = t.isIndeterminate);
  }, removeFocusIfNeeded(t) {
    t.disabled && t.focused && (t.focused = false, t.focusVisible = false);
  }, setChecked(t, r) {
    qr.checked(t, r.checked);
  }, toggleChecked(t) {
    const r = dr(t.checked) ? true : !t.checked;
    qr.checked(t, r);
  }, dispatchChangeEvent(t) {
    const r = Y.getHiddenInputEl(t);
    Ji(r, { checked: Kr(t.checked) });
  } } });
}
function dr(e) {
  return e === "indeterminate";
}
function Kr(e) {
  return dr(e) ? false : !!e;
}
var ql = { change: (e) => {
  var _a2;
  (_a2 = e.onCheckedChange) == null ? void 0 : _a2.call(e, { checked: e.checked });
} }, qr = { checked: (e, n) => {
  fe(e.checked, n) || (e.checked = n, ql.change(e));
} };
Ce()(["checked", "dir", "disabled", "form", "getRootNode", "id", "ids", "invalid", "name", "onCheckedChange", "readOnly", "required", "value"]);
var [fo, Yt] = te({ hookName: "useCheckboxContext", providerName: "<CheckboxProvider />" }), zl = (e) => e.children(Yt()), Xl = (e) => {
  const n = Yt(), t = I(() => n().getControlProps(), e);
  return createComponent(w.div, t);
}, Yl = go.extendWith("group");
function Zl(e = {}) {
  const n = createMemo(() => !(e.disabled || e.readOnly)), [t, r] = rs({ value: e.value, defaultValue: e.defaultValue || [], onChange: e.onValueChange });
  return createMemo(() => {
    const i = (u) => t().some((d) => String(d) === String(u)), o = (u) => {
      i(u) ? a(u) : s(u);
    }, s = (u) => {
      n() && (i(u) || r(t().concat(u)));
    }, a = (u) => {
      n() && r(t().filter((d) => String(d) !== String(u)));
    }, c = (u) => ({ checked: u.value != null ? i(u.value) : void 0, onCheckedChange() {
      u.value != null && o(u.value);
    }, name: e.name, disabled: e.disabled, readOnly: e.readOnly, invalid: e.invalid });
    return { isChecked: i, value: t, name: e.name, disabled: e.disabled, readOnly: e.readOnly, invalid: e.invalid, setValue: r, addValue: s, toggleValue: o, getItemProps: c };
  });
}
var [Jl, Ql] = te({ hookName: "useCheckboxGroupContext", providerName: "<CheckboxGroupProvider />", strict: false }), ec = (e) => {
  const [n, t] = W()(e, ["defaultValue", "value", "onValueChange", "disabled", "invalid", "readOnly", "name"]), r = Zl(n);
  return createComponent(Jl, { value: r, get children() {
    return createComponent(w.div, mergeProps({ role: "group" }, t, () => Yl.build().group.attrs));
  } });
}, tc = (e) => {
  const n = Yt(), t = I(() => n().getHiddenInputProps(), e), r = ne();
  return createComponent(w.input, mergeProps({ get "aria-describedby"() {
    return r == null ? void 0 : r().ariaDescribedby;
  } }, t));
}, nc = (e) => {
  const [n, t] = W()(e, ["indeterminate"]), r = Yt(), i = I(() => r().getIndicatorProps(), t);
  return createComponent(w.div, mergeProps(i, { get hidden() {
    return !(n.indeterminate ? r().indeterminate : r().checked);
  } }));
}, rc = (e) => {
  const n = Yt(), t = I(() => n().getLabelProps(), e);
  return createComponent(w.span, t);
}, ic = (e = {}) => {
  const n = Ql(), t = createMemo(() => {
    var _a2;
    return I(e, (_a2 = n == null ? void 0 : n().getItemProps({ value: e.value })) != null ? _a2 : {});
  }, [e, n]), r = Nt(), i = Ot(), o = createUniqueId(), s = ne(), a = createMemo(() => ({ id: o, ids: { label: s == null ? void 0 : s().ids.label, hiddenInput: s == null ? void 0 : s().ids.control }, disabled: s == null ? void 0 : s().disabled, readOnly: s == null ? void 0 : s().readOnly, invalid: s == null ? void 0 : s().invalid, required: s == null ? void 0 : s().required, dir: r().dir, getRootNode: i().getRootNode, checked: t().defaultChecked, ...t() })), [c, u] = pt(Kl(a()), { context: a });
  return createMemo(() => jl(c, u, Ct));
}, oc = (e) => {
  const [n, t] = W()(e, ["checked", "defaultChecked", "disabled", "form", "id", "ids", "invalid", "name", "onCheckedChange", "readOnly", "required", "value"]), r = ic(n), i = I(() => r().getRootProps(), t);
  return createComponent(fo, { value: r, get children() {
    return createComponent(w.label, i);
  } });
}, sc = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(fo, { value: n, get children() {
    return createComponent(w.label, r);
  } });
}, Me = {};
Ze(Me, { Context: () => zl, Control: () => Xl, Group: () => ec, HiddenInput: () => tc, Indicator: () => nc, Label: () => rc, Root: () => oc, RootProvider: () => sc });
var ac = ["<th", ' class="w-12 px-4 py-3">', "</th>"], lc = ["<thead", '><tr class="bg-gray-50 border-b"><!--$-->', "<!--/--><!--$-->", '<!--/--><th class="w-24 px-4 py-3"></th></tr></thead>'], cc = ["<span", ' class="text-gray-400">', "</span>"], uc = ["<th", ' class="', '"><span class="inline-flex items-center gap-1"><!--$-->', "<!--/--><!--$-->", "<!--/--></span></th>"];
const dc = (e) => ssr(lc, ssrHydrationKey(), escape(createComponent(Show, { get when() {
  return e.selectable;
}, get children() {
  return ssr(ac, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return e.multiSelect;
  }, get children() {
    return createComponent(Me.Root, { get checked() {
      return e.allSelected;
    }, onCheckedChange: () => {
      var _a2;
      return (_a2 = e.onSelectAll) == null ? void 0 : _a2.call(e);
    }, get children() {
      return [createComponent(Me.Control, { class: "w-4 h-4 border border-gray-300 rounded flex items-center justify-center bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500", get children() {
        return createComponent(Me.Indicator, { class: "text-white text-xs", children: "\u2713" });
      } }), createComponent(Me.HiddenInput, {})];
    } });
  } })));
} })), escape(createComponent(For, { get each() {
  return e.fields;
}, children: (n) => ssr(uc, ssrHydrationKey(), `px-4 py-3 text-left text-sm font-semibold text-gray-700 ${n.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""}`, escape(n.label), escape(createComponent(Show, { get when() {
  return n.sortable;
}, get children() {
  var _a2, _b;
  return ssr(cc, ssrHydrationKey(), (_b = escape((_a2 = e.sortIcon) == null ? void 0 : _a2.call(e, n.name))) != null ? _b : "\u21C5");
} }))) })));
var zr = ["<span", ' class="', '">', "</span>"], gc = ["<span", ">", "</span>"];
const ho = (e) => {
  const n = () => J.field(e.value, e.field);
  return createComponent(Switch, { get fallback() {
    return ssr(gc, ssrHydrationKey() + ssrAttribute("class", escape(e.class, true), false), escape(n()));
  }, get children() {
    return [createComponent(Match, { get when() {
      return e.field.kind === "boolean";
    }, get children() {
      var _a2;
      return ssr(zr, ssrHydrationKey(), `${(_a2 = escape(e.class, true)) != null ? _a2 : ""}`, e.value ? "\u2713" : "\u2717");
    } }), createComponent(Match, { get when() {
      return e.field.kind === "relation" && e.field.relation;
    }, get children() {
      var _a2;
      return ssr(zr, ssrHydrationKey(), `text-blue-600 ${(_a2 = escape(e.class, true)) != null ? _a2 : ""}`, escape(n()));
    } })];
  } });
};
var [mo, fc] = te({ hookName: "useRenderStrategyContext", providerName: "<RenderStrategyProvider />" }), Ir = (e) => W()(e, ["lazyMount", "unmountOnExit"]);
function hc(e, n, t) {
  const r = e.matches("mounted", "unmountSuspended");
  return { skip: !e.context.initial && r, present: r, setNode(i) {
    i && n({ type: "NODE.SET", node: i });
  }, unmount() {
    n({ type: "UNMOUNT" });
  } };
}
function mc(e) {
  return mt({ initial: e.present ? "mounted" : "unmounted", context: { node: null, styles: null, unmountAnimationName: null, prevAnimationName: null, present: false, initial: false, ...e }, exit: ["clearInitial", "cleanupNode"], watch: { present: ["setInitial", "syncPresence"] }, on: { "NODE.SET": { actions: ["setNode", "setStyles"] } }, states: { mounted: { on: { UNMOUNT: { target: "unmounted", actions: ["invokeOnExitComplete"] }, "UNMOUNT.SUSPEND": "unmountSuspended" } }, unmountSuspended: { activities: ["trackAnimationEvents"], after: { ANIMATION_DURATION: { target: "unmounted", actions: ["invokeOnExitComplete"] } }, on: { MOUNT: { target: "mounted", actions: ["setPrevAnimationName"] }, UNMOUNT: { target: "unmounted", actions: ["invokeOnExitComplete"] } } }, unmounted: { entry: ["clearPrevAnimationName"], on: { MOUNT: { target: "mounted", actions: ["setPrevAnimationName"] } } } } }, { delays: { ANIMATION_DURATION(n) {
    var _a2, _b;
    return Xr((_a2 = n.styles) == null ? void 0 : _a2.animationDuration) + Xr((_b = n.styles) == null ? void 0 : _b.animationDelay) + pc;
  } }, actions: { setInitial(n) {
    n.initial = true;
  }, clearInitial(n) {
    n.initial = false;
  }, cleanupNode(n) {
    n.node = null, n.styles = null;
  }, invokeOnExitComplete(n) {
    var _a2;
    (_a2 = n.onExitComplete) == null ? void 0 : _a2.call(n);
  }, setNode(n, t) {
    n.node = ze(t.node);
  }, setStyles(n, t) {
    const r = t.node.ownerDocument.defaultView || window;
    n.styles = ze(r.getComputedStyle(t.node));
  }, syncPresence(n, t, { send: r }) {
    var _a2;
    if (n.present) {
      r({ type: "MOUNT", src: "presence.changed" });
      return;
    }
    if (!n.present && ((_a2 = n.node) == null ? void 0 : _a2.ownerDocument.visibilityState) === "hidden") {
      r({ type: "UNMOUNT", src: "visibilitychange" });
      return;
    }
    const i = cn(n.styles);
    (n.immediate ? queueMicrotask : requestAnimationFrame)(() => {
      var _a3, _b;
      n.unmountAnimationName = i, i === "none" || i === n.prevAnimationName || ((_a3 = n.styles) == null ? void 0 : _a3.display) === "none" || ((_b = n.styles) == null ? void 0 : _b.animationDuration) === "0s" ? r({ type: "UNMOUNT", src: "presence.changed" }) : r({ type: "UNMOUNT.SUSPEND" });
    });
  }, setPrevAnimationName(n) {
    (n.immediate ? queueMicrotask : requestAnimationFrame)(() => {
      n.prevAnimationName = cn(n.styles);
    });
  }, clearPrevAnimationName(n) {
    n.prevAnimationName = null;
  } }, activities: { trackAnimationEvents(n, t, { send: r }) {
    const i = n.node;
    if (!i) return;
    const o = (a) => {
      var _a2, _b, _c2;
      ((_c2 = (_b = (_a2 = a.composedPath) == null ? void 0 : _a2.call(a)) == null ? void 0 : _b[0]) != null ? _c2 : a.target) === i && (n.prevAnimationName = cn(n.styles));
    }, s = (a) => {
      var _a2, _b, _c2;
      const c = cn(n.styles);
      ((_c2 = (_b = (_a2 = a.composedPath) == null ? void 0 : _a2.call(a)) == null ? void 0 : _b[0]) != null ? _c2 : a.target) === i && c === n.unmountAnimationName && r({ type: "UNMOUNT", src: "animationend" });
    };
    return i.addEventListener("animationstart", o), i.addEventListener("animationcancel", s), i.addEventListener("animationend", s), () => {
      i.removeEventListener("animationstart", o), i.removeEventListener("animationcancel", s), i.removeEventListener("animationend", s);
    };
  } } });
}
function cn(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function Xr(e) {
  return parseFloat(e || "0") * 1e3;
}
var pc = 16.667;
Ce()(["onExitComplete", "present", "immediate"]);
var Gn = (e) => W()(e, ["immediate", "lazyMount", "onExitComplete", "present", "unmountOnExit"]), Zt = (e) => {
  const [n, t] = Ir(e), [r, i] = createSignal(false), [o, s] = pt(mc(t), { context: t }), a = createMemo(() => hc(o, s));
  return createEffect(() => {
    a().present && i(true);
  }), createMemo(() => ({ unmounted: !a().present && !r() && n.lazyMount || n.unmountOnExit && !a().present && r(), present: a().present, presenceProps: { ref: a().setNode, hidden: !a().present, "data-state": t.present ? "open" : "closed" } }));
}, [Hn, Jt] = te({ hookName: "usePresenceContext", providerName: "<PresenceProvider />" }), Et = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap(), dn = {}, Zn = 0, po = (e) => e && (e.host || po(e.parentNode)), vc = (e, n) => n.map((t) => {
  if (e.contains(t)) return t;
  const r = po(t);
  return r && e.contains(r) ? r : (console.error("[zag-js > ariaHidden] target", t, "in not contained inside", e, ". Doing nothing"), null);
}).filter((t) => !!t), bc = (e) => e.localName === "next-route-announcer" || e.localName === "script" || e.hasAttribute("aria-live") ? true : e.matches("[data-live-announcer]"), yc = (e, n) => {
  const { parentNode: t, markerName: r, controlAttribute: i, explicitBooleanValue: o } = n, s = vc(t, Array.isArray(e) ? e : [e]);
  dn[r] || (dn[r] = /* @__PURE__ */ new WeakMap());
  const a = dn[r], c = [], u = /* @__PURE__ */ new Set(), d = new Set(s), g = (h) => {
    !h || u.has(h) || (u.add(h), g(h.parentNode));
  };
  s.forEach(g);
  const f = (h) => {
    !h || d.has(h) || Array.prototype.forEach.call(h.children, (m) => {
      if (u.has(m)) f(m);
      else try {
        if (bc(m)) return;
        const b = m.getAttribute(i), P = o ? b === "true" : b !== null && b !== "false", E = (Et.get(m) || 0) + 1, p = (a.get(m) || 0) + 1;
        Et.set(m, E), a.set(m, p), c.push(m), E === 1 && P && un.set(m, true), p === 1 && m.setAttribute(r, ""), P || m.setAttribute(i, o ? "true" : "");
      } catch (b) {
        console.error("[zag-js > ariaHidden] cannot operate on ", m, b);
      }
    });
  };
  return f(t), u.clear(), Zn++, () => {
    c.forEach((h) => {
      const m = Et.get(h) - 1, b = a.get(h) - 1;
      Et.set(h, m), a.set(h, b), m || (un.has(h) || h.removeAttribute(i), un.delete(h)), b || h.removeAttribute(r);
    }), Zn--, Zn || (Et = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap(), dn = {});
  };
}, Ec = (e) => (Array.isArray(e) ? e[0] : e).ownerDocument.body, Pc = (e, n = Ec(e), t = "data-aria-hidden") => {
  if (n) return yc(e, { parentNode: n, markerName: t, controlAttribute: "aria-hidden", explicitBooleanValue: true });
}, Ic = (e) => {
  const n = requestAnimationFrame(() => e());
  return () => cancelAnimationFrame(n);
};
function xc(e, n = {}) {
  const { defer: t = true } = n, r = t ? Ic : (o) => o(), i = [];
  return i.push(r(() => {
    const s = (typeof e == "function" ? e() : e).filter(Boolean);
    s.length !== 0 && i.push(Pc(s));
  })), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
function wc(e) {
  const n = { each(t) {
    var _a2;
    for (let r = 0; r < ((_a2 = e.frames) == null ? void 0 : _a2.length); r += 1) {
      const i = e.frames[r];
      i && t(i);
    }
  }, addEventListener(t, r, i) {
    return n.each((o) => {
      try {
        o.document.addEventListener(t, r, i);
      } catch {
      }
    }), () => {
      try {
        n.removeEventListener(t, r, i);
      } catch {
      }
    };
  }, removeEventListener(t, r, i) {
    n.each((o) => {
      try {
        o.document.removeEventListener(t, r, i);
      } catch {
      }
    });
  } };
  return n;
}
function Tc(e) {
  const n = e.frameElement != null ? e.parent : null;
  return { addEventListener: (t, r, i) => {
    try {
      n == null ? void 0 : n.addEventListener(t, r, i);
    } catch {
    }
    return () => {
      try {
        n == null ? void 0 : n.removeEventListener(t, r, i);
      } catch {
      }
    };
  }, removeEventListener: (t, r, i) => {
    try {
      n == null ? void 0 : n.removeEventListener(t, r, i);
    } catch {
    }
  } };
}
var Yr = "pointerdown.outside", Zr = "focus.outside";
function Cc(e) {
  for (const n of e) if (ee(n) && qe(n)) return true;
  return false;
}
var vo = (e) => "clientY" in e;
function Sc(e, n) {
  if (!vo(n) || !e) return false;
  const t = e.getBoundingClientRect();
  return t.width === 0 || t.height === 0 ? false : t.top <= n.clientY && n.clientY <= t.top + t.height && t.left <= n.clientX && n.clientX <= t.left + t.width;
}
function Oc(e, n) {
  return e.y <= n.y && n.y <= e.y + e.height && e.x <= n.x && n.x <= e.x + e.width;
}
function Jr(e, n) {
  if (!n || !vo(e)) return false;
  const t = n.scrollHeight > n.clientHeight, r = t && e.clientX > n.offsetLeft + n.clientWidth, i = n.scrollWidth > n.clientWidth, o = i && e.clientY > n.offsetTop + n.clientHeight, s = { x: n.offsetLeft, y: n.offsetTop, width: n.clientWidth + (t ? 16 : 0), height: n.clientHeight + (i ? 16 : 0) }, a = { x: e.clientX, y: e.clientY };
  return Oc(s, a) ? r || o : false;
}
function Nc(e, n) {
  const { exclude: t, onFocusOutside: r, onPointerDownOutside: i, onInteractOutside: o, defer: s } = n;
  if (!e) return;
  const a = ve(e), c = ae(e), u = wc(c), d = Tc(c);
  function g(E) {
    const p = oe(E);
    if (!ee(p) || !p.isConnected || wt(e, p) || Sc(e, E)) return false;
    const v = a.querySelector(`[aria-controls="${e.id}"]`);
    if (v) {
      const O = ar(v);
      if (Jr(E, O)) return false;
    }
    const C = ar(e);
    return Jr(E, C) ? false : !(t == null ? void 0 : t(p));
  }
  const f = /* @__PURE__ */ new Set();
  function h(E) {
    function p() {
      var _a2, _b;
      const v = s ? se : (O) => O(), C = (_b = (_a2 = E.composedPath) == null ? void 0 : _a2.call(E)) != null ? _b : [E.target];
      v(() => {
        if (!(!e || !g(E))) {
          if (i || o) {
            const O = xn(i, o);
            e.addEventListener(Yr, O, { once: true });
          }
          Qr(e, Yr, { bubbles: false, cancelable: true, detail: { originalEvent: E, contextmenu: Da(E), focusable: Cc(C) } });
        }
      });
    }
    E.pointerType === "touch" ? (f.forEach((v) => v()), f.add(j(a, "click", p, { once: true })), f.add(d.addEventListener("click", p, { once: true })), f.add(u.addEventListener("click", p, { once: true }))) : p();
  }
  const m = /* @__PURE__ */ new Set(), b = setTimeout(() => {
    m.add(j(a, "pointerdown", h, true)), m.add(d.addEventListener("pointerdown", h, true)), m.add(u.addEventListener("pointerdown", h, true));
  }, 0);
  function P(E) {
    (s ? se : (v) => v())(() => {
      if (!(!e || !g(E))) {
        if (r || o) {
          const v = xn(r, o);
          e.addEventListener(Zr, v, { once: true });
        }
        Qr(e, Zr, { bubbles: false, cancelable: true, detail: { originalEvent: E, contextmenu: false, focusable: qe(oe(E)) } });
      }
    });
  }
  return m.add(j(a, "focusin", P, true)), m.add(d.addEventListener("focusin", P, true)), m.add(u.addEventListener("focusin", P, true)), () => {
    clearTimeout(b), f.forEach((E) => E()), m.forEach((E) => E());
  };
}
function Rc(e, n) {
  const { defer: t } = n, r = t ? se : (o) => o(), i = [];
  return i.push(r(() => {
    const o = typeof e == "function" ? e() : e;
    i.push(Nc(o, n));
  })), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
function Qr(e, n, t) {
  const r = e.ownerDocument.defaultView || window, i = new r.CustomEvent(n, t);
  return e.dispatchEvent(i);
}
function kc(e, n) {
  const t = (r) => {
    r.key === "Escape" && (r.isComposing || (n == null ? void 0 : n(r)));
  };
  return j(ve(e), "keydown", t, { capture: true });
}
var Ie = { layers: [], branches: [], count() {
  return this.layers.length;
}, pointerBlockingLayers() {
  return this.layers.filter((e) => e.pointerBlocking);
}, topMostPointerBlockingLayer() {
  return [...this.pointerBlockingLayers()].slice(-1)[0];
}, hasPointerBlockingLayer() {
  return this.pointerBlockingLayers().length > 0;
}, isBelowPointerBlockingLayer(e) {
  var _a2;
  const n = this.indexOf(e), t = this.topMostPointerBlockingLayer() ? this.indexOf((_a2 = this.topMostPointerBlockingLayer()) == null ? void 0 : _a2.node) : -1;
  return n < t;
}, isTopMost(e) {
  var _a2;
  return ((_a2 = this.layers[this.count() - 1]) == null ? void 0 : _a2.node) === e;
}, getNestedLayers(e) {
  return Array.from(this.layers).slice(this.indexOf(e) + 1);
}, isInNestedLayer(e, n) {
  return this.getNestedLayers(e).some((t) => wt(t.node, n));
}, isInBranch(e) {
  return Array.from(this.branches).some((n) => wt(n, e));
}, add(e) {
  const n = this.layers.push(e);
  e.node.style.setProperty("--layer-index", `${n}`);
}, addBranch(e) {
  this.branches.push(e);
}, remove(e) {
  const n = this.indexOf(e);
  n < 0 || (n < this.count() - 1 && this.getNestedLayers(e).forEach((r) => r.dismiss()), this.layers.splice(n, 1), e.style.removeProperty("--layer-index"));
}, removeBranch(e) {
  const n = this.branches.indexOf(e);
  n >= 0 && this.branches.splice(n, 1);
}, indexOf(e) {
  return this.layers.findIndex((n) => n.node === e);
}, dismiss(e) {
  var _a2;
  (_a2 = this.layers[this.indexOf(e)]) == null ? void 0 : _a2.dismiss();
}, clear() {
  this.remove(this.layers[0].node);
} }, ei;
function ti() {
  Ie.layers.forEach(({ node: e }) => {
    e.style.pointerEvents = Ie.isBelowPointerBlockingLayer(e) ? "none" : "auto";
  });
}
function Ac(e) {
  e.style.pointerEvents = "";
}
function Lc(e, n) {
  const t = ve(e), r = [];
  if (Ie.hasPointerBlockingLayer() && !t.body.hasAttribute("data-inert") && (ei = document.body.style.pointerEvents, queueMicrotask(() => {
    t.body.style.pointerEvents = "none", t.body.setAttribute("data-inert", "");
  })), n) {
    const i = ml(n, (o) => {
      r.push(ul(o, { pointerEvents: "auto" }));
    });
    r.push(i);
  }
  return () => {
    Ie.hasPointerBlockingLayer() || (queueMicrotask(() => {
      t.body.style.pointerEvents = ei, t.body.removeAttribute("data-inert"), t.body.style.length === 0 && t.body.removeAttribute("style");
    }), r.forEach((i) => i()));
  };
}
function $c(e, n) {
  if (!e) {
    yn("[@zag-js/dismissable] node is `null` or `undefined`");
    return;
  }
  const { onDismiss: t, pointerBlocking: r, exclude: i, debug: o } = n, s = { dismiss: t, node: e, pointerBlocking: r };
  Ie.add(s), ti();
  function a(f) {
    var _a2, _b;
    const h = oe(f.detail.originalEvent);
    Ie.isBelowPointerBlockingLayer(e) || Ie.isInBranch(h) || ((_a2 = n.onPointerDownOutside) == null ? void 0 : _a2.call(n, f), (_b = n.onInteractOutside) == null ? void 0 : _b.call(n, f), !f.defaultPrevented && (o && console.log("onPointerDownOutside:", f.detail.originalEvent), t == null ? void 0 : t()));
  }
  function c(f) {
    var _a2, _b;
    const h = oe(f.detail.originalEvent);
    Ie.isInBranch(h) || ((_a2 = n.onFocusOutside) == null ? void 0 : _a2.call(n, f), (_b = n.onInteractOutside) == null ? void 0 : _b.call(n, f), !f.defaultPrevented && (o && console.log("onFocusOutside:", f.detail.originalEvent), t == null ? void 0 : t()));
  }
  function u(f) {
    var _a2;
    Ie.isTopMost(e) && ((_a2 = n.onEscapeKeyDown) == null ? void 0 : _a2.call(n, f), !f.defaultPrevented && t && (f.preventDefault(), t()));
  }
  function d(f) {
    var _a2;
    if (!e) return false;
    const h = typeof i == "function" ? i() : i, m = Array.isArray(h) ? h : [h], b = (_a2 = n.persistentElements) == null ? void 0 : _a2.map((P) => P()).filter(ee);
    return b && m.push(...b), m.some((P) => wt(P, f)) || Ie.isInNestedLayer(e, f);
  }
  const g = [r ? Lc(e, n.persistentElements) : void 0, kc(e, u), Rc(e, { exclude: d, onFocusOutside: c, onPointerDownOutside: a, defer: n.defer })];
  return () => {
    Ie.remove(e), ti(), Ac(e), g.forEach((f) => f == null ? void 0 : f());
  };
}
function bo(e, n) {
  const { defer: t } = n, r = t ? se : (o) => o(), i = [];
  return i.push(r(() => {
    const o = jt(e) ? e() : e;
    i.push($c(o, n));
  })), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
var Dc = Object.defineProperty, Fc = (e, n, t) => n in e ? Dc(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t, B = (e, n, t) => Fc(e, typeof n != "symbol" ? n + "" : n, t), ni = { activateTrap(e, n) {
  if (e.length > 0) {
    const r = e[e.length - 1];
    r !== n && r.pause();
  }
  const t = e.indexOf(n);
  t === -1 || e.splice(t, 1), e.push(n);
}, deactivateTrap(e, n) {
  const t = e.indexOf(n);
  t !== -1 && e.splice(t, 1), e.length > 0 && e[e.length - 1].unpause();
} }, Vc = [], Mc = class {
  constructor(e, n) {
    B(this, "trapStack"), B(this, "config"), B(this, "doc"), B(this, "state", { containers: [], containerGroups: [], tabbableGroups: [], nodeFocusedBeforeActivation: null, mostRecentlyFocusedNode: null, active: false, paused: false, delayInitialFocusTimer: void 0, recentNavEvent: void 0 }), B(this, "listenerCleanups", []), B(this, "handleFocus", (r) => {
      const i = oe(r), o = this.findContainerIndex(i, r) >= 0;
      if (o || vr(i)) o && (this.state.mostRecentlyFocusedNode = i);
      else {
        r.stopImmediatePropagation();
        let s, a = true;
        if (this.state.mostRecentlyFocusedNode) if (Lt(this.state.mostRecentlyFocusedNode) > 0) {
          const c = this.findContainerIndex(this.state.mostRecentlyFocusedNode), { tabbableNodes: u } = this.state.containerGroups[c];
          if (u.length > 0) {
            const d = u.findIndex((g) => g === this.state.mostRecentlyFocusedNode);
            d >= 0 && (this.config.isKeyForward(this.state.recentNavEvent) ? d + 1 < u.length && (s = u[d + 1], a = false) : d - 1 >= 0 && (s = u[d - 1], a = false));
          }
        } else this.state.containerGroups.some((c) => c.tabbableNodes.some((u) => Lt(u) > 0)) || (a = false);
        else a = false;
        a && (s = this.findNextNavNode({ target: this.state.mostRecentlyFocusedNode, isBackward: this.config.isKeyBackward(this.state.recentNavEvent) })), s ? this.tryFocus(s) : this.tryFocus(this.state.mostRecentlyFocusedNode || this.getInitialFocusNode());
      }
      this.state.recentNavEvent = void 0;
    }), B(this, "handlePointerDown", (r) => {
      const i = oe(r);
      if (!(this.findContainerIndex(i, r) >= 0)) {
        if (Dt(this.config.clickOutsideDeactivates, r)) {
          this.deactivate({ returnFocus: this.config.returnFocusOnDeactivate });
          return;
        }
        Dt(this.config.allowOutsideClick, r) || r.preventDefault();
      }
    }), B(this, "handleClick", (r) => {
      const i = oe(r);
      this.findContainerIndex(i, r) >= 0 || Dt(this.config.clickOutsideDeactivates, r) || Dt(this.config.allowOutsideClick, r) || (r.preventDefault(), r.stopImmediatePropagation());
    }), B(this, "handleTabKey", (r) => {
      if (this.config.isKeyForward(r) || this.config.isKeyBackward(r)) {
        this.state.recentNavEvent = r;
        const i = this.config.isKeyBackward(r), o = this.findNextNavNode({ event: r, isBackward: i });
        if (!o) return;
        $t(r) && r.preventDefault(), this.tryFocus(o);
      }
    }), B(this, "handleEscapeKey", (r) => {
      _c(r) && Dt(this.config.escapeDeactivates, r) !== false && (r.preventDefault(), this.deactivate());
    }), B(this, "_mutationObserver"), B(this, "setupMutationObserver", () => {
      const r = this.doc.defaultView || window;
      this._mutationObserver = new r.MutationObserver((i) => {
        i.some((s) => Array.from(s.removedNodes).some((c) => c === this.state.mostRecentlyFocusedNode)) && this.tryFocus(this.getInitialFocusNode());
      });
    }), B(this, "updateObservedNodes", () => {
      var _a2;
      (_a2 = this._mutationObserver) == null ? void 0 : _a2.disconnect(), this.state.active && !this.state.paused && this.state.containers.map((r) => {
        var _a3;
        (_a3 = this._mutationObserver) == null ? void 0 : _a3.observe(r, { subtree: true, childList: true });
      });
    }), B(this, "getInitialFocusNode", () => {
      let r = this.getNodeForOption("initialFocus", { hasFallback: true });
      if (r === false) return false;
      if (r === void 0 || r && !qe(r)) if (this.findContainerIndex(this.doc.activeElement) >= 0) r = this.doc.activeElement;
      else {
        const i = this.state.tabbableGroups[0];
        r = i && i.firstTabbableNode || this.getNodeForOption("fallbackFocus");
      }
      else r === null && (r = this.getNodeForOption("fallbackFocus"));
      if (!r) throw new Error("Your focus-trap needs to have at least one focusable element");
      return r.isConnected || (r = this.getNodeForOption("fallbackFocus")), r;
    }), B(this, "tryFocus", (r) => {
      if (r !== false && r !== Wi(this.doc)) {
        if (!r || !r.focus) {
          this.tryFocus(this.getInitialFocusNode());
          return;
        }
        r.focus({ preventScroll: !!this.config.preventScroll }), this.state.mostRecentlyFocusedNode = r, Gc(r) && r.select();
      }
    }), B(this, "deactivate", (r) => {
      if (!this.state.active) return this;
      const i = { onDeactivate: this.config.onDeactivate, onPostDeactivate: this.config.onPostDeactivate, checkCanReturnFocus: this.config.checkCanReturnFocus, ...r };
      clearTimeout(this.state.delayInitialFocusTimer), this.state.delayInitialFocusTimer = void 0, this.removeListeners(), this.state.active = false, this.state.paused = false, this.updateObservedNodes(), ni.deactivateTrap(this.trapStack, this);
      const o = this.getOption(i, "onDeactivate"), s = this.getOption(i, "onPostDeactivate"), a = this.getOption(i, "checkCanReturnFocus"), c = this.getOption(i, "returnFocus", "returnFocusOnDeactivate");
      o == null ? void 0 : o();
      const u = () => {
        ri(() => {
          if (c) {
            const d = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation);
            this.tryFocus(d);
          }
          s == null ? void 0 : s();
        });
      };
      if (c && a) {
        const d = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation);
        return a(d).then(u, u), this;
      }
      return u(), this;
    }), B(this, "pause", (r) => {
      if (this.state.paused || !this.state.active) return this;
      const i = this.getOption(r, "onPause"), o = this.getOption(r, "onPostPause");
      return this.state.paused = true, i == null ? void 0 : i(), this.removeListeners(), this.updateObservedNodes(), o == null ? void 0 : o(), this;
    }), B(this, "unpause", (r) => {
      if (!this.state.paused || !this.state.active) return this;
      const i = this.getOption(r, "onUnpause"), o = this.getOption(r, "onPostUnpause");
      return this.state.paused = false, i == null ? void 0 : i(), this.updateTabbableNodes(), this.addListeners(), this.updateObservedNodes(), o == null ? void 0 : o(), this;
    }), B(this, "updateContainerElements", (r) => (this.state.containers = Array.isArray(r) ? r.filter(Boolean) : [r].filter(Boolean), this.state.active && this.updateTabbableNodes(), this.updateObservedNodes(), this)), B(this, "getReturnFocusNode", (r) => {
      const i = this.getNodeForOption("setReturnFocus", { params: [r] });
      return i || (i === false ? false : r);
    }), B(this, "getOption", (r, i, o) => r && r[i] !== void 0 ? r[i] : this.config[o || i]), B(this, "getNodeForOption", (r, { hasFallback: i = false, params: o = [] } = {}) => {
      let s = this.config[r];
      if (typeof s == "function" && (s = s(...o)), s === true && (s = void 0), !s) {
        if (s === void 0 || s === false) return s;
        throw new Error(`\`${r}\` was specified but was not a node, or did not return a node`);
      }
      let a = s;
      if (typeof s == "string") {
        try {
          a = this.doc.querySelector(s);
        } catch (c) {
          throw new Error(`\`${r}\` appears to be an invalid selector; error="${c.message}"`);
        }
        if (!a && !i) throw new Error(`\`${r}\` as selector refers to no known node`);
      }
      return a;
    }), B(this, "findNextNavNode", (r) => {
      const { event: i, isBackward: o = false } = r, s = r.target || oe(i);
      this.updateTabbableNodes();
      let a = null;
      if (this.state.tabbableGroups.length > 0) {
        const c = this.findContainerIndex(s, i), u = c >= 0 ? this.state.containerGroups[c] : void 0;
        if (c < 0) o ? a = this.state.tabbableGroups[this.state.tabbableGroups.length - 1].lastTabbableNode : a = this.state.tabbableGroups[0].firstTabbableNode;
        else if (o) {
          let d = this.state.tabbableGroups.findIndex(({ firstTabbableNode: g }) => s === g);
          if (d < 0 && ((u == null ? void 0 : u.container) === s || qe(s) && !ot(s) && !(u == null ? void 0 : u.nextTabbableNode(s, false))) && (d = c), d >= 0) {
            const g = d === 0 ? this.state.tabbableGroups.length - 1 : d - 1, f = this.state.tabbableGroups[g];
            a = Lt(s) >= 0 ? f.lastTabbableNode : f.lastDomTabbableNode;
          } else $t(i) || (a = u == null ? void 0 : u.nextTabbableNode(s, false));
        } else {
          let d = this.state.tabbableGroups.findIndex(({ lastTabbableNode: g }) => s === g);
          if (d < 0 && ((u == null ? void 0 : u.container) === s || qe(s) && !ot(s) && !(u == null ? void 0 : u.nextTabbableNode(s))) && (d = c), d >= 0) {
            const g = d === this.state.tabbableGroups.length - 1 ? 0 : d + 1, f = this.state.tabbableGroups[g];
            a = Lt(s) >= 0 ? f.firstTabbableNode : f.firstDomTabbableNode;
          } else $t(i) || (a = u == null ? void 0 : u.nextTabbableNode(s));
        }
      } else a = this.getNodeForOption("fallbackFocus");
      return a;
    }), this.trapStack = n.trapStack || Vc;
    const t = { returnFocusOnDeactivate: true, escapeDeactivates: true, delayInitialFocus: true, isKeyForward(r) {
      return $t(r) && !r.shiftKey;
    }, isKeyBackward(r) {
      return $t(r) && r.shiftKey;
    }, ...n };
    this.doc = t.document || ve(Array.isArray(e) ? e[0] : e), this.config = t, this.updateContainerElements(e), this.setupMutationObserver();
  }
  get active() {
    return this.state.active;
  }
  get paused() {
    return this.state.paused;
  }
  findContainerIndex(e, n) {
    const t = typeof (n == null ? void 0 : n.composedPath) == "function" ? n.composedPath() : void 0;
    return this.state.containerGroups.findIndex(({ container: r, tabbableNodes: i }) => r.contains(e) || (t == null ? void 0 : t.includes(r)) || i.find((o) => o === e));
  }
  updateTabbableNodes() {
    if (this.state.containerGroups = this.state.containers.map((e) => {
      const n = Mn(e), t = eo(e), r = n.length > 0 ? n[0] : void 0, i = n.length > 0 ? n[n.length - 1] : void 0, o = t.find((u) => ot(u)), s = t.slice().reverse().find((u) => ot(u)), a = !!n.find((u) => Lt(u) > 0);
      function c(u, d = true) {
        const g = n.indexOf(u);
        return g < 0 ? d ? t.slice(t.indexOf(u) + 1).find((f) => ot(f)) : t.slice(0, t.indexOf(u)).reverse().find((f) => ot(f)) : n[g + (d ? 1 : -1)];
      }
      return { container: e, tabbableNodes: n, focusableNodes: t, posTabIndexesFound: a, firstTabbableNode: r, lastTabbableNode: i, firstDomTabbableNode: o, lastDomTabbableNode: s, nextTabbableNode: c };
    }), this.state.tabbableGroups = this.state.containerGroups.filter((e) => e.tabbableNodes.length > 0), this.state.tabbableGroups.length <= 0 && !this.getNodeForOption("fallbackFocus")) throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    if (this.state.containerGroups.find((e) => e.posTabIndexesFound) && this.state.containerGroups.length > 1) throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
  }
  addListeners() {
    if (this.state.active) return ni.activateTrap(this.trapStack, this), this.state.delayInitialFocusTimer = this.config.delayInitialFocus ? ri(() => {
      this.tryFocus(this.getInitialFocusNode());
    }) : this.tryFocus(this.getInitialFocusNode()), this.listenerCleanups.push(j(this.doc, "focusin", this.handleFocus, true), j(this.doc, "mousedown", this.handlePointerDown, { capture: true, passive: false }), j(this.doc, "touchstart", this.handlePointerDown, { capture: true, passive: false }), j(this.doc, "click", this.handleClick, { capture: true, passive: false }), j(this.doc, "keydown", this.handleTabKey, { capture: true, passive: false }), j(this.doc, "keydown", this.handleEscapeKey)), this;
  }
  removeListeners() {
    if (this.state.active) return this.listenerCleanups.forEach((e) => e()), this.listenerCleanups = [], this;
  }
  activate(e) {
    if (this.state.active) return this;
    const n = this.getOption(e, "onActivate"), t = this.getOption(e, "onPostActivate"), r = this.getOption(e, "checkCanFocusTrap");
    r || this.updateTabbableNodes(), this.state.active = true, this.state.paused = false, this.state.nodeFocusedBeforeActivation = this.doc.activeElement || null, n == null ? void 0 : n();
    const i = () => {
      r && this.updateTabbableNodes(), this.addListeners(), this.updateObservedNodes(), t == null ? void 0 : t();
    };
    return r ? (r(this.state.containers.concat()).then(i, i), this) : (i(), this);
  }
}, $t = (e) => e.key === "Tab", Dt = (e, ...n) => typeof e == "function" ? e(...n) : e, _c = (e) => !e.isComposing && e.key === "Escape", ri = (e) => setTimeout(e, 0), Gc = (e) => e.localName === "input" && "select" in e && typeof e.select == "function";
function Hc(e, n = {}) {
  let t;
  const r = se(() => {
    const i = typeof e == "function" ? e() : e;
    if (i) {
      t = new Mc(i, { escapeDeactivates: false, allowOutsideClick: true, preventScroll: true, returnFocusOnDeactivate: true, delayInitialFocus: false, fallbackFocus: i, ...n, document: ve(i) });
      try {
        t.activate();
      } catch {
      }
    }
  });
  return function() {
    t == null ? void 0 : t.deactivate(), r();
  };
}
var Jn = "data-scroll-lock";
function ii(e, n) {
  if (!e) return;
  const t = Object.keys(n).reduce((r, i) => (r[i] = e.style.getPropertyValue(i), r), {});
  return Object.assign(e.style, n), () => {
    Object.assign(e.style, t);
  };
}
function Bc(e, n, t) {
  if (!e) return;
  const r = e.style.getPropertyValue(n);
  return e.style.setProperty(n, t), () => {
    r ? e.style.setProperty(n, r) : e.style.removeProperty(n);
  };
}
function Wc(e) {
  const n = e.getBoundingClientRect().left;
  return Math.round(n) + e.scrollLeft ? "paddingLeft" : "paddingRight";
}
function Uc(e) {
  var _a2;
  const n = e != null ? e : document, t = (_a2 = n.defaultView) != null ? _a2 : window, { documentElement: r, body: i } = n;
  if (i.hasAttribute(Jn)) return;
  i.setAttribute(Jn, "");
  const s = t.innerWidth - r.clientWidth, a = () => Bc(r, "--scrollbar-width", `${s}px`), c = Wc(r), u = () => ii(i, { overflow: "hidden", [c]: `${s}px` }), d = () => {
    var _a3, _b;
    const { scrollX: f, scrollY: h, visualViewport: m } = t, b = (_a3 = m == null ? void 0 : m.offsetLeft) != null ? _a3 : 0, P = (_b = m == null ? void 0 : m.offsetTop) != null ? _b : 0, E = ii(i, { position: "fixed", overflow: "hidden", top: `${-(h - Math.floor(P))}px`, left: `${-(f - Math.floor(b))}px`, right: "0", [c]: `${s}px` });
    return () => {
      E == null ? void 0 : E(), t.scrollTo({ left: f, top: h, behavior: "instant" });
    };
  }, g = [a(), ka() ? d() : u()];
  return () => {
    g.forEach((f) => f == null ? void 0 : f()), i.removeAttribute(Jn);
  };
}
var jc = xe("dialog").parts("trigger", "backdrop", "positioner", "content", "title", "description", "closeTrigger"), tt = jc.build(), V = St({ getPositionerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.positioner) != null ? _b : `dialog:${e.id}:positioner`;
}, getBackdropId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.backdrop) != null ? _b : `dialog:${e.id}:backdrop`;
}, getContentId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.content) != null ? _b : `dialog:${e.id}:content`;
}, getTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.trigger) != null ? _b : `dialog:${e.id}:trigger`;
}, getTitleId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.title) != null ? _b : `dialog:${e.id}:title`;
}, getDescriptionId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.description) != null ? _b : `dialog:${e.id}:description`;
}, getCloseTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.closeTrigger) != null ? _b : `dialog:${e.id}:close`;
}, getContentEl: (e) => V.getById(e, V.getContentId(e)), getPositionerEl: (e) => V.getById(e, V.getPositionerId(e)), getBackdropEl: (e) => V.getById(e, V.getBackdropId(e)), getTriggerEl: (e) => V.getById(e, V.getTriggerId(e)), getTitleEl: (e) => V.getById(e, V.getTitleId(e)), getDescriptionEl: (e) => V.getById(e, V.getDescriptionId(e)), getCloseTriggerEl: (e) => V.getById(e, V.getCloseTriggerId(e)) });
function Kc(e, n, t) {
  const r = e.context["aria-label"], i = e.matches("open"), o = e.context.renderedElements;
  return { open: i, setOpen(s) {
    s !== i && n(s ? "OPEN" : "CLOSE");
  }, getTriggerProps() {
    return t.button({ ...tt.trigger.attrs, dir: e.context.dir, id: V.getTriggerId(e.context), "aria-haspopup": "dialog", type: "button", "aria-expanded": i, "data-state": i ? "open" : "closed", "aria-controls": V.getContentId(e.context), onClick(s) {
      s.defaultPrevented || n("TOGGLE");
    } });
  }, getBackdropProps() {
    return t.element({ ...tt.backdrop.attrs, dir: e.context.dir, hidden: !i, id: V.getBackdropId(e.context), "data-state": i ? "open" : "closed" });
  }, getPositionerProps() {
    return t.element({ ...tt.positioner.attrs, dir: e.context.dir, id: V.getPositionerId(e.context), style: { pointerEvents: i ? void 0 : "none" } });
  }, getContentProps() {
    return t.element({ ...tt.content.attrs, dir: e.context.dir, role: e.context.role, hidden: !i, id: V.getContentId(e.context), tabIndex: -1, "data-state": i ? "open" : "closed", "aria-modal": true, "aria-label": r || void 0, "aria-labelledby": r || !o.title ? void 0 : V.getTitleId(e.context), "aria-describedby": o.description ? V.getDescriptionId(e.context) : void 0 });
  }, getTitleProps() {
    return t.element({ ...tt.title.attrs, dir: e.context.dir, id: V.getTitleId(e.context) });
  }, getDescriptionProps() {
    return t.element({ ...tt.description.attrs, dir: e.context.dir, id: V.getDescriptionId(e.context) });
  }, getCloseTriggerProps() {
    return t.button({ ...tt.closeTrigger.attrs, dir: e.context.dir, id: V.getCloseTriggerId(e.context), type: "button", onClick(s) {
      s.defaultPrevented || (s.stopPropagation(), n("CLOSE"));
    } });
  } };
}
function qc(e) {
  const n = Ae(e);
  return mt({ id: "dialog", initial: n.open ? "open" : "closed", context: { role: "dialog", renderedElements: { title: true, description: true }, modal: true, trapFocus: true, preventScroll: true, closeOnInteractOutside: true, closeOnEscape: true, restoreFocus: true, ...n }, created: ["setAlertDialogProps"], watch: { open: ["toggleVisibility"] }, states: { open: { entry: ["checkRenderedElements", "syncZIndex"], activities: ["trackDismissableElement", "trapFocus", "preventScroll", "hideContentBelow"], on: { "CONTROLLED.CLOSE": { target: "closed" }, CLOSE: [{ guard: "isOpenControlled", actions: ["invokeOnClose"] }, { target: "closed", actions: ["invokeOnClose"] }], TOGGLE: [{ guard: "isOpenControlled", actions: ["invokeOnClose"] }, { target: "closed", actions: ["invokeOnClose"] }] } }, closed: { on: { "CONTROLLED.OPEN": { target: "open" }, OPEN: [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["invokeOnOpen"] }], TOGGLE: [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["invokeOnOpen"] }] } } } }, { guards: { isOpenControlled: (t) => !!t["open.controlled"] }, activities: { trackDismissableElement(t, r, { send: i }) {
    return bo(() => V.getContentEl(t), { defer: true, pointerBlocking: t.modal, exclude: [V.getTriggerEl(t)], onInteractOutside(s) {
      var _a2;
      (_a2 = t.onInteractOutside) == null ? void 0 : _a2.call(t, s), t.closeOnInteractOutside || s.preventDefault();
    }, persistentElements: t.persistentElements, onFocusOutside: t.onFocusOutside, onPointerDownOutside: t.onPointerDownOutside, onEscapeKeyDown(s) {
      var _a2;
      (_a2 = t.onEscapeKeyDown) == null ? void 0 : _a2.call(t, s), t.closeOnEscape || s.preventDefault();
    }, onDismiss() {
      i({ type: "CLOSE", src: "interact-outside" });
    } });
  }, preventScroll(t) {
    if (t.preventScroll) return Uc(V.getDoc(t));
  }, trapFocus(t) {
    return !t.trapFocus || !t.modal ? void 0 : Hc(() => V.getContentEl(t), { preventScroll: true, returnFocusOnDeactivate: !!t.restoreFocus, initialFocus: t.initialFocusEl, setReturnFocus: (i) => {
      var _a2, _b;
      return (_b = (_a2 = t.finalFocusEl) == null ? void 0 : _a2.call(t)) != null ? _b : i;
    } });
  }, hideContentBelow(t) {
    return t.modal ? xc(() => [V.getContentEl(t)], { defer: true }) : void 0;
  } }, actions: { setAlertDialogProps(t) {
    t.role === "alertdialog" && (t.initialFocusEl || (t.initialFocusEl = () => V.getCloseTriggerEl(t)), t.closeOnInteractOutside = false);
  }, checkRenderedElements(t) {
    se(() => {
      t.renderedElements.title = !!V.getTitleEl(t), t.renderedElements.description = !!V.getDescriptionEl(t);
    });
  }, syncZIndex(t) {
    se(() => {
      const r = V.getContentEl(t);
      if (!r) return;
      const i = Ui(r);
      [V.getPositionerEl(t), V.getBackdropEl(t)].forEach((s) => {
        s == null ? void 0 : s.style.setProperty("--z-index", i.zIndex);
      });
    });
  }, invokeOnClose(t) {
    var _a2;
    (_a2 = t.onOpenChange) == null ? void 0 : _a2.call(t, { open: false });
  }, invokeOnOpen(t) {
    var _a2;
    (_a2 = t.onOpenChange) == null ? void 0 : _a2.call(t, { open: true });
  }, toggleVisibility(t, r, { send: i }) {
    i({ type: t.open ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE", previousEvent: r });
  } } });
}
Ce()(["aria-label", "closeOnEscape", "closeOnInteractOutside", "dir", "finalFocusEl", "getRootNode", "getRootNode", "id", "id", "ids", "initialFocusEl", "modal", "onEscapeKeyDown", "onFocusOutside", "onInteractOutside", "onOpenChange", "onPointerDownOutside", "open.controlled", "open", "persistentElements", "preventScroll", "restoreFocus", "role", "trapFocus"]);
var [yo, Je] = te({ hookName: "useDialogContext", providerName: "<DialogProvider />" }), zc = (e) => {
  const n = Je(), t = fc(), r = Zt(I(t, () => ({ present: n().open }))), i = I(() => n().getBackdropProps(), () => r().presenceProps, e);
  return createComponent(Show, { get when() {
    return !r().unmounted;
  }, get children() {
    return createComponent(w.div, i);
  } });
}, Xc = (e) => {
  const n = Je(), t = I(() => n().getCloseTriggerProps(), e);
  return createComponent(w.button, t);
}, Yc = (e) => {
  const n = Je(), t = Jt(), r = I(() => n().getContentProps(), () => t().presenceProps, e);
  return createComponent(Show, { get when() {
    return !t().unmounted;
  }, get children() {
    return createComponent(w.div, r);
  } });
}, Zc = (e) => e.children(Je()), Jc = (e) => {
  const n = Je(), t = I(() => n().getDescriptionProps(), e);
  return createComponent(w.div, t);
}, Qc = (e) => {
  const n = Je(), t = Jt(), r = I(() => n().getPositionerProps(), e);
  return createComponent(Show, { get when() {
    return !t().unmounted;
  }, get children() {
    return createComponent(w.div, r);
  } });
}, eu = (e = {}) => {
  const n = Nt(), t = Ot(), r = createUniqueId(), i = createMemo(() => ({ id: r, dir: n().dir, getRootNode: t().getRootNode, open: e.defaultOpen, "open.controlled": e.open !== void 0, ...e })), [o, s] = pt(qc(i()), { context: i });
  return createMemo(() => Kc(o, s, Ct));
}, tu = (e) => {
  const [n, t] = Gn(e), [r] = Ir(n), [i, o] = W()(t, ["aria-label", "closeOnEscape", "closeOnInteractOutside", "defaultOpen", "finalFocusEl", "id", "ids", "initialFocusEl", "modal", "onEscapeKeyDown", "onFocusOutside", "onInteractOutside", "onOpenChange", "onPointerDownOutside", "open", "persistentElements", "preventScroll", "restoreFocus", "role", "trapFocus"]), s = eu(i), a = Zt(I(n, () => ({ present: s().open })));
  return createComponent(yo, { value: s, get children() {
    return createComponent(mo, { value: r, get children() {
      return createComponent(Hn, { value: a, get children() {
        return o.children;
      } });
    } });
  } });
}, nu = (e) => {
  const [n, t] = Gn(e), [r] = Ir(n), i = Zt(I(n, () => ({ present: t.value().open })));
  return createComponent(yo, { get value() {
    return t.value;
  }, get children() {
    return createComponent(mo, { value: r, get children() {
      return createComponent(Hn, { value: i, get children() {
        return t.children;
      } });
    } });
  } });
}, ru = (e) => {
  const n = Je(), t = I(() => n().getTitleProps(), e);
  return createComponent(w.h2, t);
}, iu = (e) => {
  const n = Je(), t = Jt(), r = I(() => n().getTriggerProps(), () => ({ "aria-controls": t().unmounted && null }), e);
  return createComponent(w.button, r);
}, Ke = {};
Ze(Ke, { Backdrop: () => zc, CloseTrigger: () => Xc, Content: () => Yc, Context: () => Zc, Description: () => Jc, Positioner: () => Qc, Root: () => tu, RootProvider: () => nu, Title: () => ru, Trigger: () => iu });
var ou = ["<span", ' class="mr-2">', "</span>"], su = ["<button", ' type="button" class="', '"', "><!--$-->", "<!--/--><!--$-->", "<!--/--></button>"], au = ["<div", ' class="flex justify-end gap-3"><!--$-->', '<!--/--><button type="button" class="', '">\u5B9F\u884C</button></div>'];
const Kt = (e) => {
  var _a2;
  const [n, t] = createSignal(false), r = () => bt.variant(e.action), i = () => bt.needsConfirm(e.action), o = () => bt.confirmMsg(e.action), s = () => bt.allowed(e.action), a = () => {
    switch (r()) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      case "ghost":
        return "bg-transparent text-gray-600 hover:bg-gray-100";
      default:
        return "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
    }
  };
  return [ssr(su, ssrHydrationKey(), `px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${escape(a(), true)} ${(_a2 = escape(e.class, true)) != null ? _a2 : ""}`, ssrAttribute("disabled", !s(), true), escape(createComponent(Show, { get when() {
    return bt.icon(e.action);
  }, get children() {
    return ssr(ou, ssrHydrationKey(), escape(bt.icon(e.action)));
  } })), escape(e.action.label)), createComponent(Show, { get when() {
    return i();
  }, get children() {
    return createComponent(Ke.Root, { get open() {
      return n();
    }, onOpenChange: (c) => t(c.open), get children() {
      return createComponent(Portal, { get children() {
        return [createComponent(Ke.Backdrop, { class: "fixed inset-0 bg-black/50 z-40" }), createComponent(Ke.Positioner, { class: "fixed inset-0 flex items-center justify-center z-50", get children() {
          return createComponent(Ke.Content, { class: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", get children() {
            return [createComponent(Ke.Title, { class: "text-lg font-semibold text-gray-900 mb-2", children: "\u78BA\u8A8D" }), createComponent(Ke.Description, { class: "text-gray-600 mb-6", get children() {
              var _a3;
              return (_a3 = o()) != null ? _a3 : `${e.action.label}\u3092\u5B9F\u884C\u3057\u307E\u3059\u304B\uFF1F`;
            } }), ssr(au, ssrHydrationKey(), escape(createComponent(Ke.CloseTrigger, { class: "px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50", children: "\u30AD\u30E3\u30F3\u30BB\u30EB" })), `px-4 py-2 rounded-md font-medium ${r() === "danger" ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"}`)];
          } });
        } })];
      } });
    } });
  } })];
};
var lu = ["<td", ' class="px-4 py-3">', "</td>"], cu = ["<tr", ' class="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><td class="px-4 py-3"><div class="flex gap-1">', "</div></td></tr>"], uu = ["<input", ' type="radio"', ' class="w-4 h-4">'], du = ["<td", ' class="px-4 py-3 text-sm">', "</td>"];
const gu = (e) => ssr(cu, ssrHydrationKey(), `border-b hover:bg-gray-50 ${e.selected ? "bg-blue-50" : ""} ${e.clickable ? "cursor-pointer" : ""}`, escape(createComponent(Show, { get when() {
  return e.selectable;
}, get children() {
  return ssr(lu, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return e.multiSelect;
  }, get fallback() {
    return ssr(uu, ssrHydrationKey(), ssrAttribute("checked", e.selected, true));
  }, get children() {
    return createComponent(Me.Root, { get checked() {
      return e.selected;
    }, onCheckedChange: () => {
      var _a2;
      return (_a2 = e.onSelect) == null ? void 0 : _a2.call(e, e.row.id);
    }, get children() {
      return [createComponent(Me.Control, { class: "w-4 h-4 border border-gray-300 rounded flex items-center justify-center bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500", get children() {
        return createComponent(Me.Indicator, { class: "text-white text-xs", children: "\u2713" });
      } }), createComponent(Me.HiddenInput, {})];
    } });
  } })));
} })), escape(createComponent(For, { get each() {
  return e.fields;
}, children: (n) => ssr(du, ssrHydrationKey(), escape(createComponent(ho, { field: n, get value() {
  return _.cellValue(e.row, n.name);
} }))) })), escape(createComponent(For, { get each() {
  return _.rowActions(e.row);
}, children: (n) => createComponent(Kt, { action: n, onExecute: (t) => {
  var _a2;
  return (_a2 = e.onAction) == null ? void 0 : _a2.call(e, t, [e.row.id]);
}, class: "text-xs px-2 py-1" }) })));
var fu = xe("pagination").parts("root", "item", "ellipsis", "prevTrigger", "nextTrigger"), Ft = fu.build(), Vt = St({ getRootId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.root) != null ? _b : `pagination:${e.id}`;
}, getPrevTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.prevTrigger) != null ? _b : `pagination:${e.id}:prev`;
}, getNextTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.nextTrigger) != null ? _b : `pagination:${e.id}:next`;
}, getEllipsisId: (e, n) => {
  var _a2, _b, _c2;
  return (_c2 = (_b = (_a2 = e.ids) == null ? void 0 : _a2.ellipsis) == null ? void 0 : _b.call(_a2, n)) != null ? _c2 : `pagination:${e.id}:ellipsis:${n}`;
}, getItemId: (e, n) => {
  var _a2, _b, _c2;
  return (_c2 = (_b = (_a2 = e.ids) == null ? void 0 : _a2.item) == null ? void 0 : _b.call(_a2, n)) != null ? _c2 : `pagination:${e.id}:item:${n}`;
} }), gn = (e, n) => {
  let t = n - e + 1;
  return Array.from({ length: t }, (r, i) => i + e);
}, hu = (e) => e.map((n) => typeof n == "number" ? { type: "page", value: n } : { type: "ellipsis" }), fn = "ellipsis", mu = (e) => {
  const n = Math.min(2 * e.siblingCount + 5, e.totalPages), t = 1, r = e.totalPages, i = Math.max(e.page - e.siblingCount, t), o = Math.min(e.page + e.siblingCount, r), s = i > t + 1, a = o < r - 1, c = n - 2;
  if (!s && a) return [...gn(1, c), fn, r];
  if (s && !a) {
    const d = gn(r - c + 1, r);
    return [t, fn, ...d];
  }
  if (s && a) {
    const d = gn(i, o);
    return [t, fn, ...d, fn, r];
  }
  return gn(t, r);
}, pu = (e) => hu(mu(e));
function vu(e, n, t) {
  const r = e.context.totalPages, i = e.context.page, o = e.context.translations, s = e.context.count, a = e.context.previousPage, c = e.context.nextPage, u = e.context.pageRange, g = e.context.type === "button", f = i === 1, h = i === r, m = pu(e.context);
  return { count: s, page: i, pageSize: e.context.pageSize, totalPages: r, pages: m, previousPage: a, nextPage: c, pageRange: u, slice(b) {
    return b.slice(u.start, u.end);
  }, setCount(b) {
    n({ type: "SET_COUNT", count: b });
  }, setPageSize(b) {
    n({ type: "SET_PAGE_SIZE", size: b });
  }, setPage(b) {
    n({ type: "SET_PAGE", page: b });
  }, goToNextPage() {
    n({ type: "NEXT_PAGE" });
  }, goToPrevPage() {
    n({ type: "PREVIOUS_PAGE" });
  }, goToFirstPage() {
    n({ type: "FIRST_PAGE" });
  }, goToLastPage() {
    n({ type: "LAST_PAGE" });
  }, getRootProps() {
    return t.element({ id: Vt.getRootId(e.context), ...Ft.root.attrs, dir: e.context.dir, "aria-label": o.rootLabel });
  }, getEllipsisProps(b) {
    return t.element({ id: Vt.getEllipsisId(e.context, b.index), ...Ft.ellipsis.attrs, dir: e.context.dir });
  }, getItemProps(b) {
    var _a2;
    const P = b.value, E = P === e.context.page;
    return t.element({ id: Vt.getItemId(e.context, P), ...Ft.item.attrs, dir: e.context.dir, "data-index": P, "data-selected": x(E), "aria-current": E ? "page" : void 0, "aria-label": (_a2 = o.itemLabel) == null ? void 0 : _a2.call(o, { page: P, totalPages: r }), onClick() {
      n({ type: "SET_PAGE", page: P });
    }, ...g && { type: "button" } });
  }, getPrevTriggerProps() {
    return t.element({ id: Vt.getPrevTriggerId(e.context), ...Ft.prevTrigger.attrs, dir: e.context.dir, "data-disabled": x(f), "aria-label": o.prevTriggerLabel, onClick() {
      n({ type: "PREVIOUS_PAGE" });
    }, ...g && { disabled: f, type: "button" } });
  }, getNextTriggerProps() {
    return t.element({ id: Vt.getNextTriggerId(e.context), ...Ft.nextTrigger.attrs, dir: e.context.dir, "data-disabled": x(h), "aria-label": o.nextTriggerLabel, onClick() {
      n({ type: "NEXT_PAGE" });
    }, ...g && { disabled: h, type: "button" } });
  } };
}
var bu = { rootLabel: "pagination", prevTriggerLabel: "previous page", nextTriggerLabel: "next page", itemLabel({ page: e, totalPages: n }) {
  return `${n > 1 && e === n ? "last page, " : ""}page ${e}`;
} };
function yu(e) {
  const n = Ae(e);
  return mt({ id: "pagination", initial: "idle", context: { pageSize: 10, siblingCount: 1, page: 1, type: "button", translations: { ...bu, ...n.translations }, ...n }, watch: { pageSize: ["setPageIfNeeded"] }, computed: { totalPages: (t) => Math.ceil(t.count / t.pageSize), previousPage: (t) => t.page === 1 ? null : t.page - 1, nextPage: (t) => t.page === t.totalPages ? null : t.page + 1, pageRange: (t) => {
    const r = (t.page - 1) * t.pageSize, i = Math.min(r + t.pageSize, t.count);
    return { start: r, end: i };
  }, isValidPage: (t) => t.page >= 1 && t.page <= t.totalPages }, on: { SET_COUNT: [{ guard: "isValidCount", actions: ["setCount", "goToFirstPage"] }, { actions: "setCount" }], SET_PAGE: { guard: "isValidPage", actions: "setPage" }, SET_PAGE_SIZE: { actions: "setPageSize" }, FIRST_PAGE: { actions: "goToFirstPage" }, LAST_PAGE: { actions: "goToLastPage" }, PREVIOUS_PAGE: { guard: "canGoToPrevPage", actions: "goToPrevPage" }, NEXT_PAGE: { guard: "canGoToNextPage", actions: "goToNextPage" } }, states: { idle: {} } }, { guards: { isValidPage: (t, r) => r.page >= 1 && r.page <= t.totalPages, isValidCount: (t, r) => t.page > r.count, canGoToNextPage: (t) => t.page < t.totalPages, canGoToPrevPage: (t) => t.page > 1 }, actions: { setCount(t, r) {
    t.count = r.count;
  }, setPage(t, r) {
    nt.page(t, r.page);
  }, setPageSize(t, r) {
    nt.pageSize(t, r.size);
  }, goToFirstPage(t) {
    nt.page(t, 1);
  }, goToLastPage(t) {
    nt.page(t, t.totalPages);
  }, goToPrevPage(t) {
    nt.page(t, t.page - 1);
  }, goToNextPage(t) {
    nt.page(t, t.page + 1);
  }, setPageIfNeeded(t, r) {
    t.isValidPage || nt.page(t, 1);
  } } });
}
var Eu = (e, n) => Math.min(Math.max(e, 1), n), nt = { pageSize: (e, n) => {
  var _a2;
  fe(e.pageSize, n) || (e.pageSize = n, (_a2 = e.onPageSizeChange) == null ? void 0 : _a2.call(e, { pageSize: e.pageSize }));
}, page: (e, n) => {
  var _a2;
  fe(e.page, n) || (e.page = Eu(n, e.totalPages), (_a2 = e.onPageChange) == null ? void 0 : _a2.call(e, { page: e.page, pageSize: e.pageSize }));
} };
Ce()(["count", "dir", "getRootNode", "id", "ids", "onPageChange", "onPageSizeChange", "page", "pageSize", "siblingCount", "translations", "type"]);
Ce()(["value", "type"]);
Ce()(["index"]);
var [Eo, Qt] = te({ hookName: "usePaginationContext", providerName: "<PaginationProvider />" }), Pu = (e) => e.children(Qt()), Iu = (e) => {
  const [n, t] = W()(e, ["index"]), r = Qt(), i = I(() => r().getEllipsisProps(n), t);
  return createComponent(w.div, i);
}, xu = (e) => {
  const [n, t] = W()(e, ["value", "type"]), r = Qt(), i = I(() => r().getItemProps(n), t);
  return createComponent(w.button, i);
}, wu = (e) => {
  const n = Qt(), t = I(() => n().getNextTriggerProps(), e);
  return createComponent(w.button, t);
}, Tu = (e) => {
  const n = Qt(), t = I(() => n().getPrevTriggerProps(), e);
  return createComponent(w.button, t);
}, Cu = (e) => {
  const n = Nt(), t = Ot(), r = createUniqueId(), i = createMemo(() => ({ id: r, dir: n().dir, getRootNode: t().getRootNode, page: e.defaultPage, ...e })), [o, s] = pt(yu(i()), { context: i });
  return createMemo(() => vu(o, s, Ct));
}, Su = (e) => {
  const [n, t] = W()(e, ["count", "defaultPage", "id", "ids", "onPageChange", "onPageSizeChange", "page", "pageSize", "siblingCount", "translations", "type"]), r = Cu(n), i = I(() => r().getRootProps(), t);
  return createComponent(Eo, { value: r, get children() {
    return createComponent(w.nav, i);
  } });
}, Ou = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(Eo, { value: n, get children() {
    return createComponent(w.nav, r);
  } });
}, st = {};
Ze(st, { Context: () => Pu, Ellipsis: () => Iu, Item: () => xu, NextTrigger: () => wu, PrevTrigger: () => Tu, Root: () => Su, RootProvider: () => Ou });
var Nu = ["<div", ' class="flex items-center gap-1"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], Ru = ["<div", ' class="mt-4 flex items-center justify-between"><span class="text-sm text-gray-600"><!--$-->', "<!--/--> \u4EF6\u4E2D <!--$-->", "<!--/--> / <!--$-->", "<!--/--> \u30DA\u30FC\u30B8</span><!--$-->", "<!--/--></div>"];
const ku = (e) => createComponent(Show, { get when() {
  return e.totalPages > 1;
}, get children() {
  return ssr(Ru, ssrHydrationKey(), escape(e.total), escape(e.page), escape(e.totalPages), escape(createComponent(st.Root, { get count() {
    return e.total;
  }, get pageSize() {
    var _a2;
    return (_a2 = e.pageSize) != null ? _a2 : 10;
  }, get page() {
    return e.page;
  }, onPageChange: (n) => {
    var _a2;
    return (_a2 = e.onPageChange) == null ? void 0 : _a2.call(e, n.page);
  }, siblingCount: 1, get children() {
    return ssr(Nu, ssrHydrationKey(), escape(createComponent(st.PrevTrigger, { class: "px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "\u524D\u3078" })), escape(createComponent(st.Context, { children: (n) => createComponent(For, { get each() {
      return n().pages;
    }, children: (t, r) => t.type === "page" ? createComponent(st.Item, mergeProps(t, { class: "px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 data-[selected]:bg-blue-500 data-[selected]:text-white data-[selected]:border-blue-500", get children() {
      return t.value;
    } })) : createComponent(st.Ellipsis, { get index() {
      return r();
    }, class: "px-2 text-gray-500", children: "\u2026" }) }) })), escape(createComponent(st.NextTrigger, { class: "px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "\u6B21\u3078" })));
  } })));
} });
var Au = ["<div", ' class="mb-4 flex gap-2">', "</div>"], Lu = ["<div", ' class="mb-4 p-3 bg-blue-50 rounded flex items-center gap-4"><span class="text-sm text-blue-800"><!--$-->', "<!--/--> \u4EF6\u9078\u629E\u4E2D</span><!--$-->", "<!--/--></div>"];
const $u = (e) => [createComponent(Show, { get when() {
  var _a2, _b;
  return ((_b = (_a2 = e.headerActions) == null ? void 0 : _a2.length) != null ? _b : 0) > 0;
}, get children() {
  return ssr(Au, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return e.headerActions;
  }, children: (n) => createComponent(Kt, { action: n, onExecute: (t) => {
    var _a2;
    return (_a2 = e.onAction) == null ? void 0 : _a2.call(e, t);
  } }) })));
} }), createComponent(Show, { get when() {
  var _a2;
  return ((_a2 = e.selectedCount) != null ? _a2 : 0) > 0;
}, get children() {
  return ssr(Lu, ssrHydrationKey(), escape(e.selectedCount), escape(createComponent(For, { get each() {
    return e.bulkActions;
  }, children: (n) => createComponent(Kt, { action: n, onExecute: (t) => {
    var _a2;
    return (_a2 = e.onAction) == null ? void 0 : _a2.call(e, t, e.selectedIds);
  } }) })));
} })];
var Du = ["<div", ' class="text-center py-8 text-gray-500">\u8AAD\u307F\u8FBC\u307F\u4E2D...</div>'], Fu = ["<div", ' class="p-4 bg-red-50 text-red-700 rounded mb-4">', "</div>"], Vu = ["<div", ' class="overflow-x-auto"><table class="w-full border-collapse"><!--$-->', "<!--/--><tbody>", "</tbody></table></div>"], Mu = ["<div", "><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _u = ["<tr", "><td", ' class="px-4 py-8 text-center text-gray-500">\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093</td></tr>'];
const Eh = (e) => {
  var _a2;
  const n = () => _.fields(e.vm), t = () => _.rows(e.vm);
  return ssr(Mu, ssrHydrationKey() + ssrAttribute("class", (_a2 = escape(e.class, true)) != null ? _a2 : "", false), escape(createComponent($u, { get headerActions() {
    return _.headerActions(e.vm);
  }, get bulkActions() {
    return _.bulkActions(e.vm);
  }, get selectedCount() {
    return _.selectedCount(e.vm);
  }, get selectedIds() {
    return _.selectedIds(e.vm);
  }, get onAction() {
    return e.onAction;
  } })), escape(createComponent(Show, { get when() {
    return _.loading(e.vm);
  }, get children() {
    return ssr(Du, ssrHydrationKey());
  } })), escape(createComponent(Show, { get when() {
    return _.error(e.vm);
  }, get children() {
    return ssr(Fu, ssrHydrationKey(), escape(_.error(e.vm)));
  } })), escape(createComponent(Show, { get when() {
    return !_.loading(e.vm);
  }, get children() {
    return [ssr(Vu, ssrHydrationKey(), escape(createComponent(dc, { get fields() {
      return n();
    }, get selectable() {
      return _.selectable(e.vm);
    }, get multiSelect() {
      return _.multiSelect(e.vm);
    }, get allSelected() {
      return _.allSelected(e.vm);
    }, get onSelectAll() {
      return e.onSelectAll;
    }, get onSort() {
      return e.onSort;
    }, sortIcon: (r) => _.sortIcon(e.vm, r) })), escape(createComponent(Show, { get when() {
      return !_.empty(e.vm);
    }, get fallback() {
      return ssr(_u, ssrHydrationKey(), ssrAttribute("colspan", escape(n().length, true) + 2, false));
    }, get children() {
      return createComponent(For, { get each() {
        return t();
      }, children: (r) => createComponent(gu, { row: r, get fields() {
        return n();
      }, get selectable() {
        return _.selectable(e.vm);
      }, get multiSelect() {
        return _.multiSelect(e.vm);
      }, get selected() {
        return _.selected(e.vm, r.id);
      }, get clickable() {
        return !!e.vm.clickAction;
      }, get onSelect() {
        return e.onSelect;
      }, get onClick() {
        return e.onRowClick;
      }, get onAction() {
        return e.onAction;
      } }) });
    } }))), createComponent(ku, { get page() {
      return _.page(e.vm);
    }, get totalPages() {
      return _.totalPages(e.vm);
    }, get total() {
      return _.total(e.vm);
    }, get hasNext() {
      return _.hasNext(e.vm);
    }, get hasPrev() {
      return _.hasPrev(e.vm);
    }, get onPageChange() {
      return e.onPageChange;
    } })];
  } })));
};
let Qn = /* @__PURE__ */ new Map(), gr = false;
try {
  gr = new Intl.NumberFormat("de-DE", { signDisplay: "exceptZero" }).resolvedOptions().signDisplay === "exceptZero";
} catch {
}
let Nn = false;
try {
  Nn = new Intl.NumberFormat("de-DE", { style: "unit", unit: "degree" }).resolvedOptions().style === "unit";
} catch {
}
const Po = { degree: { narrow: { default: "\xB0", "ja-JP": " \u5EA6", "zh-TW": "\u5EA6", "sl-SI": " \xB0" } } };
class Gu {
  format(n) {
    let t = "";
    if (!gr && this.options.signDisplay != null ? t = Bu(this.numberFormatter, this.options.signDisplay, n) : t = this.numberFormatter.format(n), this.options.style === "unit" && !Nn) {
      var r;
      let { unit: i, unitDisplay: o = "short", locale: s } = this.resolvedOptions();
      if (!i) return t;
      let a = (r = Po[i]) === null || r === void 0 ? void 0 : r[o];
      t += a[s] || a.default;
    }
    return t;
  }
  formatToParts(n) {
    return this.numberFormatter.formatToParts(n);
  }
  formatRange(n, t) {
    if (typeof this.numberFormatter.formatRange == "function") return this.numberFormatter.formatRange(n, t);
    if (t < n) throw new RangeError("End date must be >= start date");
    return `${this.format(n)} \u2013 ${this.format(t)}`;
  }
  formatRangeToParts(n, t) {
    if (typeof this.numberFormatter.formatRangeToParts == "function") return this.numberFormatter.formatRangeToParts(n, t);
    if (t < n) throw new RangeError("End date must be >= start date");
    let r = this.numberFormatter.formatToParts(n), i = this.numberFormatter.formatToParts(t);
    return [...r.map((o) => ({ ...o, source: "startRange" })), { type: "literal", value: " \u2013 ", source: "shared" }, ...i.map((o) => ({ ...o, source: "endRange" }))];
  }
  resolvedOptions() {
    let n = this.numberFormatter.resolvedOptions();
    return !gr && this.options.signDisplay != null && (n = { ...n, signDisplay: this.options.signDisplay }), !Nn && this.options.style === "unit" && (n = { ...n, style: "unit", unit: this.options.unit, unitDisplay: this.options.unitDisplay }), n;
  }
  constructor(n, t = {}) {
    this.numberFormatter = Hu(n, t), this.options = t;
  }
}
function Hu(e, n = {}) {
  let { numberingSystem: t } = n;
  if (t && e.includes("-nu-") && (e.includes("-u-") || (e += "-u-"), e += `-nu-${t}`), n.style === "unit" && !Nn) {
    var r;
    let { unit: s, unitDisplay: a = "short" } = n;
    if (!s) throw new Error('unit option must be provided with style: "unit"');
    if (!(!((r = Po[s]) === null || r === void 0) && r[a])) throw new Error(`Unsupported unit ${s} with unitDisplay = ${a}`);
    n = { ...n, style: "decimal" };
  }
  let i = e + (n ? Object.entries(n).sort((s, a) => s[0] < a[0] ? -1 : 1).join() : "");
  if (Qn.has(i)) return Qn.get(i);
  let o = new Intl.NumberFormat(e, n);
  return Qn.set(i, o), o;
}
function Bu(e, n, t) {
  if (n === "auto") return e.format(t);
  if (n === "never") return e.format(Math.abs(t));
  {
    let r = false;
    if (n === "always" ? r = t > 0 || Object.is(t, 0) : n === "exceptZero" && (Object.is(t, -0) || Object.is(t, 0) ? t = Math.abs(t) : r = t > 0), r) {
      let i = e.format(-t), o = e.format(t), s = i.replace(o, "").replace(/\u200e|\u061C/, "");
      return [...s].length !== 1 && console.warn("@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case"), i.replace(o, "!!!").replace(s, "+").replace("!!!", o);
    } else return e.format(t);
  }
}
const Wu = new RegExp("^.*\\(.*\\).*$"), Uu = ["latn", "arab", "hanidec", "deva", "beng"];
class Io {
  parse(n) {
    return er(this.locale, this.options, n).parse(n);
  }
  isValidPartialNumber(n, t, r) {
    return er(this.locale, this.options, n).isValidPartialNumber(n, t, r);
  }
  getNumberingSystem(n) {
    return er(this.locale, this.options, n).options.numberingSystem;
  }
  constructor(n, t = {}) {
    this.locale = n, this.options = t;
  }
}
const oi = /* @__PURE__ */ new Map();
function er(e, n, t) {
  let r = si(e, n);
  if (!e.includes("-nu-") && !r.isValidPartialNumber(t)) {
    for (let i of Uu) if (i !== r.options.numberingSystem) {
      let o = si(e + (e.includes("-u-") ? "-nu-" : "-u-nu-") + i, n);
      if (o.isValidPartialNumber(t)) return o;
    }
  }
  return r;
}
function si(e, n) {
  let t = e + (n ? Object.entries(n).sort((i, o) => i[0] < o[0] ? -1 : 1).join() : ""), r = oi.get(t);
  return r || (r = new ju(e, n), oi.set(t, r)), r;
}
class ju {
  parse(n) {
    let t = this.sanitize(n);
    if (this.symbols.group && (t = hn(t, this.symbols.group, "")), this.symbols.decimal && (t = t.replace(this.symbols.decimal, ".")), this.symbols.minusSign && (t = t.replace(this.symbols.minusSign, "-")), t = t.replace(this.symbols.numeral, this.symbols.index), this.options.style === "percent") {
      let s = t.indexOf("-");
      t = t.replace("-", "");
      let a = t.indexOf(".");
      a === -1 && (a = t.length), t = t.replace(".", ""), a - 2 === 0 ? t = `0.${t}` : a - 2 === -1 ? t = `0.0${t}` : a - 2 === -2 ? t = "0.00" : t = `${t.slice(0, a - 2)}.${t.slice(a - 2)}`, s > -1 && (t = `-${t}`);
    }
    let r = t ? +t : NaN;
    if (isNaN(r)) return NaN;
    if (this.options.style === "percent") {
      var i, o;
      let s = { ...this.options, style: "decimal", minimumFractionDigits: Math.min(((i = this.options.minimumFractionDigits) !== null && i !== void 0 ? i : 0) + 2, 20), maximumFractionDigits: Math.min(((o = this.options.maximumFractionDigits) !== null && o !== void 0 ? o : 0) + 2, 20) };
      return new Io(this.locale, s).parse(new Gu(this.locale, s).format(r));
    }
    return this.options.currencySign === "accounting" && Wu.test(n) && (r = -1 * r), r;
  }
  sanitize(n) {
    return n = n.replace(this.symbols.literals, ""), this.symbols.minusSign && (n = n.replace("-", this.symbols.minusSign)), this.options.numberingSystem === "arab" && (this.symbols.decimal && (n = n.replace(",", this.symbols.decimal), n = n.replace("\u060C", this.symbols.decimal)), this.symbols.group && (n = hn(n, ".", this.symbols.group))), this.options.locale === "fr-FR" && (n = hn(n, ".", "\u202F")), n;
  }
  isValidPartialNumber(n, t = -1 / 0, r = 1 / 0) {
    return n = this.sanitize(n), this.symbols.minusSign && n.startsWith(this.symbols.minusSign) && t < 0 ? n = n.slice(this.symbols.minusSign.length) : this.symbols.plusSign && n.startsWith(this.symbols.plusSign) && r > 0 && (n = n.slice(this.symbols.plusSign.length)), this.symbols.group && n.startsWith(this.symbols.group) || this.symbols.decimal && n.indexOf(this.symbols.decimal) > -1 && this.options.maximumFractionDigits === 0 ? false : (this.symbols.group && (n = hn(n, this.symbols.group, "")), n = n.replace(this.symbols.numeral, ""), this.symbols.decimal && (n = n.replace(this.symbols.decimal, "")), n.length === 0);
  }
  constructor(n, t = {}) {
    this.locale = n, this.formatter = new Intl.NumberFormat(n, t), this.options = this.formatter.resolvedOptions(), this.symbols = qu(n, this.formatter, this.options, t);
    var r, i;
    this.options.style === "percent" && (((r = this.options.minimumFractionDigits) !== null && r !== void 0 ? r : 0) > 18 || ((i = this.options.maximumFractionDigits) !== null && i !== void 0 ? i : 0) > 18) && console.warn("NumberParser cannot handle percentages with greater than 18 decimal places, please reduce the number in your options.");
  }
}
const ai = /* @__PURE__ */ new Set(["decimal", "fraction", "integer", "minusSign", "plusSign", "group"]), Ku = [0, 4, 2, 1, 11, 20, 3, 7, 100, 21, 0.1, 1.1];
function qu(e, n, t, r) {
  var i, o, s, a;
  let c = new Intl.NumberFormat(e, { ...t, minimumSignificantDigits: 1, maximumSignificantDigits: 21, roundingIncrement: 1, roundingPriority: "auto", roundingMode: "halfExpand" }), u = c.formatToParts(-10000.111), d = c.formatToParts(10000.111), g = Ku.map((R) => c.formatToParts(R));
  var f;
  let h = (f = (i = u.find((R) => R.type === "minusSign")) === null || i === void 0 ? void 0 : i.value) !== null && f !== void 0 ? f : "-", m = (o = d.find((R) => R.type === "plusSign")) === null || o === void 0 ? void 0 : o.value;
  !m && ((r == null ? void 0 : r.signDisplay) === "exceptZero" || (r == null ? void 0 : r.signDisplay) === "always") && (m = "+");
  let P = (s = new Intl.NumberFormat(e, { ...t, minimumFractionDigits: 2, maximumFractionDigits: 2 }).formatToParts(1e-3).find((R) => R.type === "decimal")) === null || s === void 0 ? void 0 : s.value, E = (a = u.find((R) => R.type === "group")) === null || a === void 0 ? void 0 : a.value, p = u.filter((R) => !ai.has(R.type)).map((R) => li(R.value)), v = g.flatMap((R) => R.filter((G) => !ai.has(G.type)).map((G) => li(G.value))), C = [.../* @__PURE__ */ new Set([...p, ...v])].sort((R, G) => G.length - R.length), O = C.length === 0 ? new RegExp("[\\p{White_Space}]", "gu") : new RegExp(`${C.join("|")}|[\\p{White_Space}]`, "gu"), M = [...new Intl.NumberFormat(t.locale, { useGrouping: false }).format(9876543210)].reverse(), S = new Map(M.map((R, G) => [R, G])), L = new RegExp(`[${M.join("")}]`, "g");
  return { minusSign: h, plusSign: m, decimal: P, group: E, literals: O, numeral: L, index: (R) => String(S.get(R)) };
}
function hn(e, n, t) {
  return e.replaceAll ? e.replaceAll(n, t) : e.split(n).join(t);
}
function li(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var zu = xe("numberInput").parts("root", "label", "input", "control", "valueText", "incrementTrigger", "decrementTrigger", "scrubber"), Ue = zu.build(), D = St({ getRootId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.root) != null ? _b : `number-input:${e.id}`;
}, getInputId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.input) != null ? _b : `number-input:${e.id}:input`;
}, getIncrementTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.incrementTrigger) != null ? _b : `number-input:${e.id}:inc`;
}, getDecrementTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.decrementTrigger) != null ? _b : `number-input:${e.id}:dec`;
}, getScrubberId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.scrubber) != null ? _b : `number-input:${e.id}:scrubber`;
}, getCursorId: (e) => `number-input:${e.id}:cursor`, getLabelId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.label) != null ? _b : `number-input:${e.id}:label`;
}, getInputEl: (e) => D.getById(e, D.getInputId(e)), getIncrementTriggerEl: (e) => D.getById(e, D.getIncrementTriggerId(e)), getDecrementTriggerEl: (e) => D.getById(e, D.getDecrementTriggerId(e)), getScrubberEl: (e) => D.getById(e, D.getScrubberId(e)), getCursorEl: (e) => D.getDoc(e).getElementById(D.getCursorId(e)), getPressedTriggerEl: (e, n = e.hint) => {
  let t = null;
  return n === "increment" && (t = D.getIncrementTriggerEl(e)), n === "decrement" && (t = D.getDecrementTriggerEl(e)), t;
}, setupVirtualCursor(e) {
  if (!qi()) return D.createVirtualCursor(e), () => {
    var _a2;
    (_a2 = D.getCursorEl(e)) == null ? void 0 : _a2.remove();
  };
}, preventTextSelection(e) {
  const n = D.getDoc(e), t = n.documentElement, r = n.body;
  return r.style.pointerEvents = "none", t.style.userSelect = "none", t.style.cursor = "ew-resize", () => {
    r.style.pointerEvents = "", t.style.userSelect = "", t.style.cursor = "", t.style.length || t.removeAttribute("style"), r.style.length || r.removeAttribute("style");
  };
}, getMousemoveValue(e, n) {
  const t = D.getWin(e), r = Wt(n.movementX, t.devicePixelRatio), i = Wt(n.movementY, t.devicePixelRatio);
  let o = r > 0 ? "increment" : r < 0 ? "decrement" : null;
  e.isRtl && o === "increment" && (o = "decrement"), e.isRtl && o === "decrement" && (o = "increment");
  const s = { x: e.scrubberCursorPoint.x + r, y: e.scrubberCursorPoint.y + i }, a = t.innerWidth, c = Wt(7.5, t.devicePixelRatio);
  return s.x = Rs(s.x + c, a) - c, { hint: o, point: s };
}, createVirtualCursor(e) {
  const n = D.getDoc(e), t = n.createElement("div");
  t.className = "scrubber--cursor", t.id = D.getCursorId(e), Object.assign(t.style, { width: "15px", height: "15px", position: "fixed", pointerEvents: "none", left: "0px", top: "0px", zIndex: pa, transform: e.scrubberCursorPoint ? `translate3d(${e.scrubberCursorPoint.x}px, ${e.scrubberCursorPoint.y}px, 0px)` : void 0, willChange: "transform" }), t.innerHTML = `
        <svg width="46" height="15" style="left: -15.5px; position: absolute; top: 0; filter: drop-shadow(rgba(0, 0, 0, 0.4) 0px 1px 1.1px);">
          <g transform="translate(2 3)">
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z" style="stroke-width: 2px; stroke: white;"></path>
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"></path>
          </g>
        </svg>`, n.body.appendChild(t);
} });
function Xu(e, n, t) {
  const r = e.hasTag("focus"), i = e.context.isDisabled, o = e.context.readOnly, s = e.context.isValueEmpty, a = e.context.isOutOfRange || !!e.context.invalid, c = i || !e.context.canIncrement || o, u = i || !e.context.canDecrement || o, d = e.context.translations;
  return { focused: r, invalid: a, empty: s, value: e.context.formattedValue, valueAsNumber: e.context.valueAsNumber, setValue(g) {
    n({ type: "VALUE.SET", value: g });
  }, clearValue() {
    n("VALUE.CLEAR");
  }, increment() {
    n("VALUE.INCREMENT");
  }, decrement() {
    n("VALUE.DECREMENT");
  }, setToMax() {
    n({ type: "VALUE.SET", value: e.context.max });
  }, setToMin() {
    n({ type: "VALUE.SET", value: e.context.min });
  }, focus() {
    var _a2;
    (_a2 = D.getInputEl(e.context)) == null ? void 0 : _a2.focus();
  }, getRootProps() {
    return t.element({ id: D.getRootId(e.context), ...Ue.root.attrs, dir: e.context.dir, "data-disabled": x(i), "data-focus": x(r), "data-invalid": x(a) });
  }, getLabelProps() {
    return t.label({ ...Ue.label.attrs, dir: e.context.dir, "data-disabled": x(i), "data-focus": x(r), "data-invalid": x(a), id: D.getLabelId(e.context), htmlFor: D.getInputId(e.context) });
  }, getControlProps() {
    return t.element({ ...Ue.control.attrs, dir: e.context.dir, role: "group", "aria-disabled": i, "data-focus": x(r), "data-disabled": x(i), "data-invalid": x(a), "aria-invalid": Tn(e.context.invalid) });
  }, getValueTextProps() {
    return t.element({ ...Ue.valueText.attrs, dir: e.context.dir, "data-disabled": x(i), "data-invalid": x(a), "data-focus": x(r) });
  }, getInputProps() {
    return t.input({ ...Ue.input.attrs, dir: e.context.dir, name: e.context.name, form: e.context.form, id: D.getInputId(e.context), role: "spinbutton", defaultValue: e.context.formattedValue, pattern: e.context.pattern, inputMode: e.context.inputMode, "aria-invalid": Tn(a), "data-invalid": x(a), disabled: i, "data-disabled": x(i), readOnly: e.context.readOnly, required: e.context.required, autoComplete: "off", autoCorrect: "off", spellCheck: "false", type: "text", "aria-roledescription": "numberfield", "aria-valuemin": e.context.min, "aria-valuemax": e.context.max, "aria-valuenow": Number.isNaN(e.context.valueAsNumber) ? void 0 : e.context.valueAsNumber, "aria-valuetext": e.context.valueText, onFocus() {
      n("INPUT.FOCUS");
    }, onBlur() {
      n("INPUT.BLUR");
    }, onInput(g) {
      n({ type: "INPUT.CHANGE", target: g.currentTarget, hint: "set" });
    }, onBeforeInput(g) {
      var _a2;
      try {
        const { selectionStart: f, selectionEnd: h, value: m } = g.currentTarget, b = m.slice(0, f) + ((_a2 = g.data) != null ? _a2 : "") + m.slice(h);
        e.context.parser.isValidPartialNumber(b) || g.preventDefault();
      } catch {
      }
    }, onKeyDown(g) {
      if (g.defaultPrevented || o || $a(g)) return;
      const f = Ha(g) * e.context.step, m = { ArrowUp() {
        n({ type: "INPUT.ARROW_UP", step: f }), g.preventDefault();
      }, ArrowDown() {
        n({ type: "INPUT.ARROW_DOWN", step: f }), g.preventDefault();
      }, Home() {
        Br(g) || (n("INPUT.HOME"), g.preventDefault());
      }, End() {
        Br(g) || (n("INPUT.END"), g.preventDefault());
      }, Enter() {
        n("INPUT.ENTER");
      } }[g.key];
      m == null ? void 0 : m(g);
    } });
  }, getDecrementTriggerProps() {
    return t.button({ ...Ue.decrementTrigger.attrs, dir: e.context.dir, id: D.getDecrementTriggerId(e.context), disabled: u, "data-disabled": x(u), "aria-label": d.decrementLabel, type: "button", tabIndex: -1, "aria-controls": D.getInputId(e.context), onPointerDown(g) {
      var _a2;
      u || !Hr(g) || (n({ type: "TRIGGER.PRESS_DOWN", hint: "decrement", pointerType: g.pointerType }), g.pointerType === "mouse" && g.preventDefault(), g.pointerType === "touch" && ((_a2 = g.currentTarget) == null ? void 0 : _a2.focus({ preventScroll: true })));
    }, onPointerUp(g) {
      n({ type: "TRIGGER.PRESS_UP", hint: "decrement", pointerType: g.pointerType });
    }, onPointerLeave() {
      u || n({ type: "TRIGGER.PRESS_UP", hint: "decrement" });
    } });
  }, getIncrementTriggerProps() {
    return t.button({ ...Ue.incrementTrigger.attrs, dir: e.context.dir, id: D.getIncrementTriggerId(e.context), disabled: c, "data-disabled": x(c), "aria-label": d.incrementLabel, type: "button", tabIndex: -1, "aria-controls": D.getInputId(e.context), onPointerDown(g) {
      var _a2;
      c || !Hr(g) || (n({ type: "TRIGGER.PRESS_DOWN", hint: "increment", pointerType: g.pointerType }), g.pointerType === "mouse" && g.preventDefault(), g.pointerType === "touch" && ((_a2 = g.currentTarget) == null ? void 0 : _a2.focus({ preventScroll: true })));
    }, onPointerUp(g) {
      n({ type: "TRIGGER.PRESS_UP", hint: "increment", pointerType: g.pointerType });
    }, onPointerLeave(g) {
      n({ type: "TRIGGER.PRESS_UP", hint: "increment", pointerType: g.pointerType });
    } });
  }, getScrubberProps() {
    return t.element({ ...Ue.scrubber.attrs, dir: e.context.dir, "data-disabled": x(i), id: D.getScrubberId(e.context), role: "presentation", onMouseDown(g) {
      if (i) return;
      const f = zi(g), m = ae(g.currentTarget).devicePixelRatio;
      f.x = f.x - Wt(7.5, m), f.y = f.y - Wt(7.5, m), n({ type: "SCRUBBER.PRESS_DOWN", point: f }), g.preventDefault();
    }, style: { cursor: i ? void 0 : "ew-resize" } });
  } };
}
function Yu(e) {
  if (e.ownerDocument.activeElement === e) try {
    const { selectionStart: n, selectionEnd: t, value: r } = e, i = r.substring(0, n), o = r.substring(t);
    return { start: n, end: t, value: r, beforeTxt: i, afterTxt: o };
  } catch {
  }
}
function Zu(e, n) {
  if (e.ownerDocument.activeElement === e) {
    if (!n) {
      e.setSelectionRange(e.value.length, e.value.length);
      return;
    }
    try {
      const { value: t } = e, { beforeTxt: r = "", afterTxt: i = "", start: o } = n;
      let s = t.length;
      if (t.endsWith(i)) s = t.length - i.length;
      else if (t.startsWith(r)) s = r.length;
      else if (o != null) {
        const a = r[o - 1], c = t.indexOf(a, o - 1);
        c !== -1 && (s = c + 1);
      }
      e.setSelectionRange(s, s);
    } catch {
    }
  }
}
var ci = (e, n = {}) => ze(new Intl.NumberFormat(e, n)), ui = (e, n = {}) => ze(new Io(e, n)), di = (e, n) => e.formatOptions ? e.parser.parse(String(n)) : parseFloat(n), rt = (e, n) => Number.isNaN(n) ? "" : e.formatOptions ? e.formatter.format(n) : n.toString(), { not: tr, and: mn } = Dn;
function Ju(e) {
  const n = Ae(e);
  return mt({ id: "number-input", initial: "idle", context: { dir: "ltr", locale: "en-US", focusInputOnChange: true, clampValueOnBlur: true, allowOverflow: false, inputMode: "decimal", pattern: "[0-9]*(.[0-9]+)?", value: "", step: 1, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, invalid: false, spinOnPress: true, disabled: false, readOnly: false, ...n, hint: null, scrubberCursorPoint: null, fieldsetDisabled: false, formatter: ci(n.locale || "en-US", n.formatOptions), parser: ui(n.locale || "en-US", n.formatOptions), translations: { incrementLabel: "increment value", decrementLabel: "decrease value", ...n.translations } }, computed: { isRtl: (t) => t.dir === "rtl", valueAsNumber: (t) => di(t, t.value), formattedValue: (t) => rt(t, t.valueAsNumber), isAtMin: (t) => As(t.valueAsNumber, t.min), isAtMax: (t) => ks(t.valueAsNumber, t.max), isOutOfRange: (t) => !Ls(t.valueAsNumber, t.min, t.max), isValueEmpty: (t) => t.value === "", isDisabled: (t) => !!t.disabled || t.fieldsetDisabled, canIncrement: (t) => t.allowOverflow || !t.isAtMax, canDecrement: (t) => t.allowOverflow || !t.isAtMin, valueText: (t) => {
    var _a2, _b;
    return (_b = (_a2 = t.translations).valueText) == null ? void 0 : _b.call(_a2, t.value);
  } }, watch: { formatOptions: ["setFormatterAndParser", "syncInputElement"], locale: ["setFormatterAndParser", "syncInputElement"], value: ["syncInputElement"], isOutOfRange: ["invokeOnInvalid"], scrubberCursorPoint: ["setVirtualCursorPosition"] }, activities: ["trackFormControl"], on: { "VALUE.SET": { actions: ["setRawValue", "setHintToSet"] }, "VALUE.CLEAR": { actions: ["clearValue"] }, "VALUE.INCREMENT": { actions: ["increment"] }, "VALUE.DECREMENT": { actions: ["decrement"] } }, states: { idle: { on: { "TRIGGER.PRESS_DOWN": [{ guard: "isTouchPointer", target: "before:spin", actions: ["setHint"] }, { target: "before:spin", actions: ["focusInput", "invokeOnFocus", "setHint"] }], "SCRUBBER.PRESS_DOWN": { target: "scrubbing", actions: ["focusInput", "invokeOnFocus", "setHint", "setCursorPoint"] }, "INPUT.FOCUS": { target: "focused", actions: ["focusInput", "invokeOnFocus"] } } }, focused: { tags: "focus", activities: "attachWheelListener", on: { "TRIGGER.PRESS_DOWN": [{ guard: "isTouchPointer", target: "before:spin", actions: ["setHint"] }, { target: "before:spin", actions: ["focusInput", "setHint"] }], "SCRUBBER.PRESS_DOWN": { target: "scrubbing", actions: ["focusInput", "setHint", "setCursorPoint"] }, "INPUT.ARROW_UP": { actions: "increment" }, "INPUT.ARROW_DOWN": { actions: "decrement" }, "INPUT.HOME": { actions: "decrementToMin" }, "INPUT.END": { actions: "incrementToMax" }, "INPUT.CHANGE": { actions: ["setValue", "setHint"] }, "INPUT.BLUR": [{ guard: mn("clampValueOnBlur", tr("isInRange")), target: "idle", actions: ["setClampedValue", "clearHint", "invokeOnBlur"] }, { target: "idle", actions: ["setFormattedValue", "clearHint", "invokeOnBlur"] }], "INPUT.ENTER": { actions: ["setFormattedValue", "clearHint", "invokeOnBlur"] } } }, "before:spin": { tags: "focus", activities: "trackButtonDisabled", entry: Bs([{ guard: "isIncrementHint", actions: "increment" }, { guard: "isDecrementHint", actions: "decrement" }]), after: { CHANGE_DELAY: { target: "spinning", guard: mn("isInRange", "spinOnPress") } }, on: { "TRIGGER.PRESS_UP": [{ guard: "isTouchPointer", target: "focused", actions: "clearHint" }, { target: "focused", actions: ["focusInput", "clearHint"] }] } }, spinning: { tags: "focus", activities: "trackButtonDisabled", every: [{ delay: "CHANGE_INTERVAL", guard: mn(tr("isAtMin"), "isIncrementHint"), actions: "increment" }, { delay: "CHANGE_INTERVAL", guard: mn(tr("isAtMax"), "isDecrementHint"), actions: "decrement" }], on: { "TRIGGER.PRESS_UP": { target: "focused", actions: ["focusInput", "clearHint"] } } }, scrubbing: { tags: "focus", activities: ["activatePointerLock", "trackMousemove", "setupVirtualCursor", "preventTextSelection"], on: { "SCRUBBER.POINTER_UP": { target: "focused", actions: ["focusInput", "clearCursorPoint"] }, "SCRUBBER.POINTER_MOVE": [{ guard: "isIncrementHint", actions: ["increment", "setCursorPoint"] }, { guard: "isDecrementHint", actions: ["decrement", "setCursorPoint"] }] } } } }, { delays: { CHANGE_INTERVAL: 50, CHANGE_DELAY: 300 }, guards: { clampValueOnBlur: (t) => t.clampValueOnBlur, isAtMin: (t) => t.isAtMin, spinOnPress: (t) => !!t.spinOnPress, isAtMax: (t) => t.isAtMax, isInRange: (t) => !t.isOutOfRange, isDecrementHint: (t, r) => {
    var _a2;
    return ((_a2 = r.hint) != null ? _a2 : t.hint) === "decrement";
  }, isIncrementHint: (t, r) => {
    var _a2;
    return ((_a2 = r.hint) != null ? _a2 : t.hint) === "increment";
  }, isTouchPointer: (t, r) => r.pointerType === "touch" }, activities: { trackFormControl(t, r, { initialContext: i }) {
    const o = D.getInputEl(t);
    return Vn(o, { onFieldsetDisabledChange(s) {
      t.fieldsetDisabled = s;
    }, onFormReset() {
      Se.value(t, i.value);
    } });
  }, setupVirtualCursor(t) {
    return D.setupVirtualCursor(t);
  }, preventTextSelection(t) {
    return D.preventTextSelection(t);
  }, trackButtonDisabled(t, r, { send: i }) {
    const o = D.getPressedTriggerEl(t, t.hint);
    return to(o, { attributes: ["disabled"], callback() {
      i({ type: "TRIGGER.PRESS_UP", src: "attr" });
    } });
  }, attachWheelListener(t, r, { send: i }) {
    const o = D.getInputEl(t);
    if (!o || !D.isActiveElement(t, o) || !t.allowMouseWheel) return;
    function s(a) {
      a.preventDefault();
      const c = Math.sign(a.deltaY) * -1;
      c === 1 ? i("VALUE.INCREMENT") : c === -1 && i("VALUE.DECREMENT");
    }
    return j(o, "wheel", s, { passive: false });
  }, activatePointerLock(t) {
    if (!qi()) return nl(D.getDoc(t));
  }, trackMousemove(t, r, { send: i }) {
    const o = D.getDoc(t);
    function s(c) {
      if (!t.scrubberCursorPoint) return;
      const u = D.getMousemoveValue(t, c);
      u.hint && i({ type: "SCRUBBER.POINTER_MOVE", hint: u.hint, point: u.point });
    }
    function a() {
      i("SCRUBBER.POINTER_UP");
    }
    return xn(j(o, "mousemove", s, false), j(o, "mouseup", a, false));
  } }, actions: { focusInput(t) {
    if (!t.focusInputOnChange) return;
    const r = D.getInputEl(t);
    D.isActiveElement(t, r) || se(() => r == null ? void 0 : r.focus({ preventScroll: true }));
  }, increment(t, r) {
    var _a2;
    const i = $s(t.valueAsNumber, (_a2 = r.step) != null ? _a2 : t.step), o = rt(t, rn(i, t.min, t.max));
    Se.value(t, o);
  }, decrement(t, r) {
    var _a2;
    const i = Ds(t.valueAsNumber, (_a2 = r.step) != null ? _a2 : t.step), o = rt(t, rn(i, t.min, t.max));
    Se.value(t, o);
  }, setClampedValue(t) {
    const r = rn(t.valueAsNumber, t.min, t.max);
    Se.value(t, rt(t, r));
  }, setRawValue(t, r) {
    const i = di(t, r.value), o = rt(t, rn(i, t.min, t.max));
    Se.value(t, o);
  }, setValue(t, r) {
    var _a2, _b;
    const i = (_b = (_a2 = r.target) == null ? void 0 : _a2.value) != null ? _b : r.value;
    Se.value(t, i);
  }, clearValue(t) {
    Se.value(t, "");
  }, incrementToMax(t) {
    const r = rt(t, t.max);
    Se.value(t, r);
  }, decrementToMin(t) {
    const r = rt(t, t.min);
    Se.value(t, r);
  }, setHint(t, r) {
    t.hint = r.hint;
  }, clearHint(t) {
    t.hint = null;
  }, setHintToSet(t) {
    t.hint = "set";
  }, invokeOnFocus(t) {
    var _a2;
    (_a2 = t.onFocusChange) == null ? void 0 : _a2.call(t, { focused: true, value: t.formattedValue, valueAsNumber: t.valueAsNumber });
  }, invokeOnBlur(t) {
    var _a2;
    (_a2 = t.onFocusChange) == null ? void 0 : _a2.call(t, { focused: false, value: t.formattedValue, valueAsNumber: t.valueAsNumber });
  }, invokeOnInvalid(t) {
    var _a2;
    if (!t.isOutOfRange) return;
    const r = t.valueAsNumber > t.max ? "rangeOverflow" : "rangeUnderflow";
    (_a2 = t.onValueInvalid) == null ? void 0 : _a2.call(t, { reason: r, value: t.formattedValue, valueAsNumber: t.valueAsNumber });
  }, syncInputElement(t, r) {
    const i = r.type.endsWith("CHANGE") ? t.value : t.formattedValue;
    Qu.input(t, i);
  }, setFormattedValue(t) {
    Se.value(t, t.formattedValue);
  }, setCursorPoint(t, r) {
    t.scrubberCursorPoint = r.point;
  }, clearCursorPoint(t) {
    t.scrubberCursorPoint = null;
  }, setVirtualCursorPosition(t) {
    const r = D.getCursorEl(t);
    if (!r || !t.scrubberCursorPoint) return;
    const { x: i, y: o } = t.scrubberCursorPoint;
    r.style.transform = `translate3d(${i}px, ${o}px, 0px)`;
  }, setFormatterAndParser(t) {
    t.locale && (t.formatter = ci(t.locale, t.formatOptions), t.parser = ui(t.locale, t.formatOptions));
  } }, compareFns: { formatOptions: (t, r) => fe(t, r), scrubberCursorPoint: (t, r) => fe(t, r) } });
}
var Qu = { input(e, n) {
  const t = D.getInputEl(e);
  if (!t) return;
  const r = Yu(t);
  se(() => {
    Yi(t, n), Zu(t, r);
  });
} }, ed = { onChange: (e) => {
  var _a2;
  (_a2 = e.onValueChange) == null ? void 0 : _a2.call(e, { value: e.value, valueAsNumber: e.valueAsNumber });
} }, Se = { value: (e, n) => {
  fe(e.value, n) || (e.value = n, ed.onChange(e));
} }, [xo, Qe] = te({ hookName: "useNumberInputContext", providerName: "<NumberInputProvider />" }), td = (e) => e.children(Qe()), nd = (e) => {
  const n = Qe(), t = I(() => n().getControlProps(), e);
  return createComponent(w.div, t);
}, rd = (e) => {
  const n = Qe(), t = I(() => n().getDecrementTriggerProps(), e);
  return createComponent(w.button, t);
}, id = (e) => {
  const n = Qe(), t = I(() => n().getIncrementTriggerProps(), e);
  return createComponent(w.button, t);
}, od = (e) => {
  const n = Qe(), t = I(() => n().getInputProps(), e), r = ne();
  return createComponent(w.input, mergeProps({ get "aria-describedby"() {
    return r == null ? void 0 : r().ariaDescribedby;
  } }, t));
}, sd = (e) => {
  const n = Qe(), t = I(() => n().getLabelProps(), e);
  return createComponent(w.label, t);
}, ad = (e = {}) => {
  const n = createUniqueId(), t = Nt(), r = Ot(), i = ne(), o = createMemo(() => ({ id: n, ids: { label: i == null ? void 0 : i().ids.label, input: i == null ? void 0 : i().ids.control }, disabled: i == null ? void 0 : i().disabled, readOnly: i == null ? void 0 : i().readOnly, required: i == null ? void 0 : i().required, invalid: i == null ? void 0 : i().invalid, dir: t().dir, locale: t().locale, getRootNode: r().getRootNode, value: e.defaultValue, ...e })), [s, a] = pt(Ju(o()), { context: o });
  return createMemo(() => Xu(s, a, Ct));
}, ld = (e) => {
  const [n, t] = W()(e, ["allowMouseWheel", "allowOverflow", "clampValueOnBlur", "defaultValue", "disabled", "focusInputOnChange", "form", "formatOptions", "id", "ids", "inputMode", "invalid", "locale", "max", "min", "name", "onFocusChange", "onValueChange", "onValueInvalid", "pattern", "readOnly", "required", "spinOnPress", "step", "translations", "value"]), r = ad(n), i = I(() => r().getRootProps(), t);
  return createComponent(xo, { value: r, get children() {
    return createComponent(w.div, i);
  } });
}, cd = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(xo, { value: n, get children() {
    return createComponent(w.div, r);
  } });
}, ud = (e) => {
  const n = Qe(), t = I(() => n().getScrubberProps(), e);
  return createComponent(w.div, t);
}, dd = (e) => {
  const n = Qe(), t = I(() => n().getValueTextProps(), e);
  return createComponent(w.span, t);
}, Pt = {};
Ze(Pt, { Context: () => td, Control: () => nd, DecrementTrigger: () => rd, IncrementTrigger: () => id, Input: () => od, Label: () => sd, Root: () => ld, RootProvider: () => cd, Scrubber: () => ud, ValueText: () => dd });
var gd = Object.defineProperty, fd = (e, n, t) => n in e ? gd(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t, hd = (e, n, t) => fd(e, n + "", t), Pn = { itemToValue(e) {
  return typeof e == "string" ? e : ct(e) && Bt(e, "value") ? e.value : "";
}, itemToString(e) {
  return typeof e == "string" ? e : ct(e) && Bt(e, "label") ? e.label : Pn.itemToValue(e);
}, isItemDisabled(e) {
  return ct(e) && Bt(e, "disabled") ? !!e.disabled : false;
} }, xr = class {
  constructor(e) {
    this.options = e, hd(this, "items"), this.items = [...e.items];
  }
  isEqual(e) {
    return fe(this.items, e.items);
  }
  setItems(e) {
    this.items = Array.from(e);
  }
  getValues(e = this.items) {
    return Array.from(e).map((n) => this.getItemValue(n)).filter(Boolean);
  }
  find(e) {
    if (e == null) return null;
    const n = this.items.findIndex((t) => this.getItemValue(t) === e);
    return n != null ? this.items[n] : null;
  }
  findMany(e) {
    return Array.from(e).map((n) => this.find(n)).filter(Boolean);
  }
  at(e) {
    var _a2;
    return (_a2 = this.items[e]) != null ? _a2 : null;
  }
  sortFn(e, n) {
    const t = this.indexOf(e), r = this.indexOf(n);
    return (t != null ? t : 0) - (r != null ? r : 0);
  }
  sort(e) {
    return [...e].sort(this.sortFn.bind(this));
  }
  getItemValue(e) {
    var _a2, _b, _c2;
    return e == null ? null : (_c2 = (_b = (_a2 = this.options).itemToValue) == null ? void 0 : _b.call(_a2, e)) != null ? _c2 : Pn.itemToValue(e);
  }
  getItemDisabled(e) {
    var _a2, _b, _c2;
    return e == null ? false : (_c2 = (_b = (_a2 = this.options).isItemDisabled) == null ? void 0 : _b.call(_a2, e)) != null ? _c2 : Pn.isItemDisabled(e);
  }
  stringifyItem(e) {
    var _a2, _b, _c2;
    return e == null ? null : (_c2 = (_b = (_a2 = this.options).itemToString) == null ? void 0 : _b.call(_a2, e)) != null ? _c2 : Pn.itemToString(e);
  }
  stringify(e) {
    return e == null ? null : this.stringifyItem(this.find(e));
  }
  stringifyItems(e, n = ", ") {
    return Array.from(e).map((t) => this.stringifyItem(t)).filter(Boolean).join(n);
  }
  stringifyMany(e, n) {
    return this.stringifyItems(this.findMany(e), n);
  }
  has(e) {
    return this.indexOf(e) !== -1;
  }
  hasItem(e) {
    return e == null ? false : this.has(this.getItemValue(e));
  }
  get size() {
    return this.items.length;
  }
  get firstValue() {
    let e = 0;
    for (; this.getItemDisabled(this.at(e)); ) e++;
    return this.getItemValue(this.at(e));
  }
  get lastValue() {
    let e = this.size - 1;
    for (; this.getItemDisabled(this.at(e)); ) e--;
    return this.getItemValue(this.at(e));
  }
  getNextValue(e, n = 1, t = false) {
    let r = this.indexOf(e);
    if (r === -1) return null;
    for (r = t ? Math.min(r + n, this.size - 1) : r + n; r <= this.size && this.getItemDisabled(this.at(r)); ) r++;
    return this.getItemValue(this.at(r));
  }
  getPreviousValue(e, n = 1, t = false) {
    let r = this.indexOf(e);
    if (r === -1) return null;
    for (r = t ? Math.max(r - n, 0) : r - n; r >= 0 && this.getItemDisabled(this.at(r)); ) r--;
    return this.getItemValue(this.at(r));
  }
  indexOf(e) {
    return e == null ? -1 : this.items.findIndex((n) => this.getItemValue(n) === e);
  }
  getByText(e, n) {
    let t = n != null ? pd(this.items, this.indexOf(n)) : this.items;
    return e.length === 1 && (t = t.filter((i) => this.getItemValue(i) !== n)), t.find((i) => md(this.stringifyItem(i), e));
  }
  search(e, n) {
    const { state: t, currentValue: r, timeout: i = 350 } = n, o = t.keysSoFar + e, a = o.length > 1 && Array.from(o).every((f) => f === o[0]) ? o[0] : o, c = this.getByText(a, r), u = this.getItemValue(c);
    function d() {
      clearTimeout(t.timer), t.timer = -1;
    }
    function g(f) {
      t.keysSoFar = f, d(), f !== "" && (t.timer = +setTimeout(() => {
        g(""), d();
      }, i));
    }
    return g(o), u;
  }
  *[Symbol.iterator]() {
    yield* this.items;
  }
  insertBefore(e, n) {
    const t = this.indexOf(e);
    t !== -1 && this.items.splice(t, 0, n);
  }
  insertAfter(e, n) {
    const t = this.indexOf(e);
    t !== -1 && this.items.splice(t + 1, 0, n);
  }
  reorder(e, n) {
    if (e === -1 || n === -1 || e === n) return;
    const [t] = this.items.splice(e, 1);
    this.items.splice(n, 0, t);
  }
  json() {
    return { size: this.size, first: this.firstValue, last: this.lastValue };
  }
}, md = (e, n) => !!(e == null ? void 0 : e.toLowerCase().startsWith(n.toLowerCase())), pd = (e, n) => e.map((t, r) => e[(Math.max(n, 0) + r) % e.length]);
const vd = ["top", "right", "bottom", "left"], Xe = Math.min, de = Math.max, Rn = Math.round, pn = Math.floor, Ne = (e) => ({ x: e, y: e }), bd = { left: "right", right: "left", bottom: "top", top: "bottom" }, yd = { start: "end", end: "start" };
function fr(e, n, t) {
  return de(e, Xe(n, t));
}
function _e(e, n) {
  return typeof e == "function" ? e(n) : e;
}
function Ge(e) {
  return e.split("-")[0];
}
function Rt(e) {
  return e.split("-")[1];
}
function wr(e) {
  return e === "x" ? "y" : "x";
}
function Tr(e) {
  return e === "y" ? "height" : "width";
}
const Ed = /* @__PURE__ */ new Set(["top", "bottom"]);
function Oe(e) {
  return Ed.has(Ge(e)) ? "y" : "x";
}
function Cr(e) {
  return wr(Oe(e));
}
function Pd(e, n, t) {
  t === void 0 && (t = false);
  const r = Rt(e), i = Cr(e), o = Tr(i);
  let s = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return n.reference[o] > n.floating[o] && (s = kn(s)), [s, kn(s)];
}
function Id(e) {
  const n = kn(e);
  return [hr(e), n, hr(n)];
}
function hr(e) {
  return e.replace(/start|end/g, (n) => yd[n]);
}
const gi = ["left", "right"], fi = ["right", "left"], xd = ["top", "bottom"], wd = ["bottom", "top"];
function Td(e, n, t) {
  switch (e) {
    case "top":
    case "bottom":
      return t ? n ? fi : gi : n ? gi : fi;
    case "left":
    case "right":
      return n ? xd : wd;
    default:
      return [];
  }
}
function Cd(e, n, t, r) {
  const i = Rt(e);
  let o = Td(Ge(e), t === "start", r);
  return i && (o = o.map((s) => s + "-" + i), n && (o = o.concat(o.map(hr)))), o;
}
function kn(e) {
  return e.replace(/left|right|bottom|top/g, (n) => bd[n]);
}
function Sd(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function wo(e) {
  return typeof e != "number" ? Sd(e) : { top: e, right: e, bottom: e, left: e };
}
function An(e) {
  const { x: n, y: t, width: r, height: i } = e;
  return { width: r, height: i, top: t, left: n, right: n + r, bottom: t + i, x: n, y: t };
}
function hi(e, n, t) {
  let { reference: r, floating: i } = e;
  const o = Oe(n), s = Cr(n), a = Tr(s), c = Ge(n), u = o === "y", d = r.x + r.width / 2 - i.width / 2, g = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
  let h;
  switch (c) {
    case "top":
      h = { x: d, y: r.y - i.height };
      break;
    case "bottom":
      h = { x: d, y: r.y + r.height };
      break;
    case "right":
      h = { x: r.x + r.width, y: g };
      break;
    case "left":
      h = { x: r.x - i.width, y: g };
      break;
    default:
      h = { x: r.x, y: r.y };
  }
  switch (Rt(n)) {
    case "start":
      h[s] -= f * (t && u ? -1 : 1);
      break;
    case "end":
      h[s] += f * (t && u ? -1 : 1);
      break;
  }
  return h;
}
const Od = async (e, n, t) => {
  const { placement: r = "bottom", strategy: i = "absolute", middleware: o = [], platform: s } = t, a = o.filter(Boolean), c = await (s.isRTL == null ? void 0 : s.isRTL(n));
  let u = await s.getElementRects({ reference: e, floating: n, strategy: i }), { x: d, y: g } = hi(u, r, c), f = r, h = {}, m = 0;
  for (let b = 0; b < a.length; b++) {
    const { name: P, fn: E } = a[b], { x: p, y: v, data: C, reset: O } = await E({ x: d, y: g, initialPlacement: r, placement: f, strategy: i, middlewareData: h, rects: u, platform: s, elements: { reference: e, floating: n } });
    d = p != null ? p : d, g = v != null ? v : g, h = { ...h, [P]: { ...h[P], ...C } }, O && m <= 50 && (m++, typeof O == "object" && (O.placement && (f = O.placement), O.rects && (u = O.rects === true ? await s.getElementRects({ reference: e, floating: n, strategy: i }) : O.rects), { x: d, y: g } = hi(u, f, c)), b = -1);
  }
  return { x: d, y: g, placement: f, strategy: i, middlewareData: h };
};
async function qt(e, n) {
  var t;
  n === void 0 && (n = {});
  const { x: r, y: i, platform: o, rects: s, elements: a, strategy: c } = e, { boundary: u = "clippingAncestors", rootBoundary: d = "viewport", elementContext: g = "floating", altBoundary: f = false, padding: h = 0 } = _e(n, e), m = wo(h), P = a[f ? g === "floating" ? "reference" : "floating" : g], E = An(await o.getClippingRect({ element: (t = await (o.isElement == null ? void 0 : o.isElement(P))) == null || t ? P : P.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)), boundary: u, rootBoundary: d, strategy: c })), p = g === "floating" ? { x: r, y: i, width: s.floating.width, height: s.floating.height } : s.reference, v = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), C = await (o.isElement == null ? void 0 : o.isElement(v)) ? await (o.getScale == null ? void 0 : o.getScale(v)) || { x: 1, y: 1 } : { x: 1, y: 1 }, O = An(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({ elements: a, rect: p, offsetParent: v, strategy: c }) : p);
  return { top: (E.top - O.top + m.top) / C.y, bottom: (O.bottom - E.bottom + m.bottom) / C.y, left: (E.left - O.left + m.left) / C.x, right: (O.right - E.right + m.right) / C.x };
}
const Nd = (e) => ({ name: "arrow", options: e, async fn(n) {
  const { x: t, y: r, placement: i, rects: o, platform: s, elements: a, middlewareData: c } = n, { element: u, padding: d = 0 } = _e(e, n) || {};
  if (u == null) return {};
  const g = wo(d), f = { x: t, y: r }, h = Cr(i), m = Tr(h), b = await s.getDimensions(u), P = h === "y", E = P ? "top" : "left", p = P ? "bottom" : "right", v = P ? "clientHeight" : "clientWidth", C = o.reference[m] + o.reference[h] - f[h] - o.floating[m], O = f[h] - o.reference[h], M = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u));
  let S = M ? M[v] : 0;
  (!S || !await (s.isElement == null ? void 0 : s.isElement(M))) && (S = a.floating[v] || o.floating[m]);
  const L = C / 2 - O / 2, $ = S / 2 - b[m] / 2 - 1, R = Xe(g[E], $), G = Xe(g[p], $), K = R, ce = S - b[m] - G, z = S / 2 - b[m] / 2 + L, et = fr(K, z, ce), $e = !c.arrow && Rt(i) != null && z !== et && o.reference[m] / 2 - (z < K ? R : G) - b[m] / 2 < 0, be = $e ? z < K ? z - K : z - ce : 0;
  return { [h]: f[h] + be, data: { [h]: et, centerOffset: z - et - be, ...$e && { alignmentOffset: be } }, reset: $e };
} }), Rd = function(e) {
  return e === void 0 && (e = {}), { name: "flip", options: e, async fn(n) {
    var t, r;
    const { placement: i, middlewareData: o, rects: s, initialPlacement: a, platform: c, elements: u } = n, { mainAxis: d = true, crossAxis: g = true, fallbackPlacements: f, fallbackStrategy: h = "bestFit", fallbackAxisSideDirection: m = "none", flipAlignment: b = true, ...P } = _e(e, n);
    if ((t = o.arrow) != null && t.alignmentOffset) return {};
    const E = Ge(i), p = Oe(a), v = Ge(a) === a, C = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)), O = f || (v || !b ? [kn(a)] : Id(a)), M = m !== "none";
    !f && M && O.push(...Cd(a, b, m, C));
    const S = [a, ...O], L = await qt(n, P), $ = [];
    let R = ((r = o.flip) == null ? void 0 : r.overflows) || [];
    if (d && $.push(L[E]), g) {
      const z = Pd(i, s, C);
      $.push(L[z[0]], L[z[1]]);
    }
    if (R = [...R, { placement: i, overflows: $ }], !$.every((z) => z <= 0)) {
      var G, K;
      const z = (((G = o.flip) == null ? void 0 : G.index) || 0) + 1, et = S[z];
      if (et && (!(g === "alignment" ? p !== Oe(et) : false) || R.every((ye) => Oe(ye.placement) === p ? ye.overflows[0] > 0 : true))) return { data: { index: z, overflows: R }, reset: { placement: et } };
      let $e = (K = R.filter((be) => be.overflows[0] <= 0).sort((be, ye) => be.overflows[1] - ye.overflows[1])[0]) == null ? void 0 : K.placement;
      if (!$e) switch (h) {
        case "bestFit": {
          var ce;
          const be = (ce = R.filter((ye) => {
            if (M) {
              const Be = Oe(ye.placement);
              return Be === p || Be === "y";
            }
            return true;
          }).map((ye) => [ye.placement, ye.overflows.filter((Be) => Be > 0).reduce((Be, Bo) => Be + Bo, 0)]).sort((ye, Be) => ye[1] - Be[1])[0]) == null ? void 0 : ce[0];
          be && ($e = be);
          break;
        }
        case "initialPlacement":
          $e = a;
          break;
      }
      if (i !== $e) return { reset: { placement: $e } };
    }
    return {};
  } };
};
function mi(e, n) {
  return { top: e.top - n.height, right: e.right - n.width, bottom: e.bottom - n.height, left: e.left - n.width };
}
function pi(e) {
  return vd.some((n) => e[n] >= 0);
}
const kd = function(e) {
  return e === void 0 && (e = {}), { name: "hide", options: e, async fn(n) {
    const { rects: t } = n, { strategy: r = "referenceHidden", ...i } = _e(e, n);
    switch (r) {
      case "referenceHidden": {
        const o = await qt(n, { ...i, elementContext: "reference" }), s = mi(o, t.reference);
        return { data: { referenceHiddenOffsets: s, referenceHidden: pi(s) } };
      }
      case "escaped": {
        const o = await qt(n, { ...i, altBoundary: true }), s = mi(o, t.floating);
        return { data: { escapedOffsets: s, escaped: pi(s) } };
      }
      default:
        return {};
    }
  } };
}, To = /* @__PURE__ */ new Set(["left", "top"]);
async function Ad(e, n) {
  const { placement: t, platform: r, elements: i } = e, o = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), s = Ge(t), a = Rt(t), c = Oe(t) === "y", u = To.has(s) ? -1 : 1, d = o && c ? -1 : 1, g = _e(n, e);
  let { mainAxis: f, crossAxis: h, alignmentAxis: m } = typeof g == "number" ? { mainAxis: g, crossAxis: 0, alignmentAxis: null } : { mainAxis: g.mainAxis || 0, crossAxis: g.crossAxis || 0, alignmentAxis: g.alignmentAxis };
  return a && typeof m == "number" && (h = a === "end" ? m * -1 : m), c ? { x: h * d, y: f * u } : { x: f * u, y: h * d };
}
const Ld = function(e) {
  return e === void 0 && (e = 0), { name: "offset", options: e, async fn(n) {
    var t, r;
    const { x: i, y: o, placement: s, middlewareData: a } = n, c = await Ad(n, e);
    return s === ((t = a.offset) == null ? void 0 : t.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : { x: i + c.x, y: o + c.y, data: { ...c, placement: s } };
  } };
}, $d = function(e) {
  return e === void 0 && (e = {}), { name: "shift", options: e, async fn(n) {
    const { x: t, y: r, placement: i } = n, { mainAxis: o = true, crossAxis: s = false, limiter: a = { fn: (P) => {
      let { x: E, y: p } = P;
      return { x: E, y: p };
    } }, ...c } = _e(e, n), u = { x: t, y: r }, d = await qt(n, c), g = Oe(Ge(i)), f = wr(g);
    let h = u[f], m = u[g];
    if (o) {
      const P = f === "y" ? "top" : "left", E = f === "y" ? "bottom" : "right", p = h + d[P], v = h - d[E];
      h = fr(p, h, v);
    }
    if (s) {
      const P = g === "y" ? "top" : "left", E = g === "y" ? "bottom" : "right", p = m + d[P], v = m - d[E];
      m = fr(p, m, v);
    }
    const b = a.fn({ ...n, [f]: h, [g]: m });
    return { ...b, data: { x: b.x - t, y: b.y - r, enabled: { [f]: o, [g]: s } } };
  } };
}, Dd = function(e) {
  return e === void 0 && (e = {}), { options: e, fn(n) {
    const { x: t, y: r, placement: i, rects: o, middlewareData: s } = n, { offset: a = 0, mainAxis: c = true, crossAxis: u = true } = _e(e, n), d = { x: t, y: r }, g = Oe(i), f = wr(g);
    let h = d[f], m = d[g];
    const b = _e(a, n), P = typeof b == "number" ? { mainAxis: b, crossAxis: 0 } : { mainAxis: 0, crossAxis: 0, ...b };
    if (c) {
      const v = f === "y" ? "height" : "width", C = o.reference[f] - o.floating[v] + P.mainAxis, O = o.reference[f] + o.reference[v] - P.mainAxis;
      h < C ? h = C : h > O && (h = O);
    }
    if (u) {
      var E, p;
      const v = f === "y" ? "width" : "height", C = To.has(Ge(i)), O = o.reference[g] - o.floating[v] + (C && ((E = s.offset) == null ? void 0 : E[g]) || 0) + (C ? 0 : P.crossAxis), M = o.reference[g] + o.reference[v] + (C ? 0 : ((p = s.offset) == null ? void 0 : p[g]) || 0) - (C ? P.crossAxis : 0);
      m < O ? m = O : m > M && (m = M);
    }
    return { [f]: h, [g]: m };
  } };
}, Fd = function(e) {
  return e === void 0 && (e = {}), { name: "size", options: e, async fn(n) {
    var t, r;
    const { placement: i, rects: o, platform: s, elements: a } = n, { apply: c = () => {
    }, ...u } = _e(e, n), d = await qt(n, u), g = Ge(i), f = Rt(i), h = Oe(i) === "y", { width: m, height: b } = o.floating;
    let P, E;
    g === "top" || g === "bottom" ? (P = g, E = f === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (E = g, P = f === "end" ? "top" : "bottom");
    const p = b - d.top - d.bottom, v = m - d.left - d.right, C = Xe(b - d[P], p), O = Xe(m - d[E], v), M = !n.middlewareData.shift;
    let S = C, L = O;
    if ((t = n.middlewareData.shift) != null && t.enabled.x && (L = v), (r = n.middlewareData.shift) != null && r.enabled.y && (S = p), M && !f) {
      const R = de(d.left, 0), G = de(d.right, 0), K = de(d.top, 0), ce = de(d.bottom, 0);
      h ? L = m - 2 * (R !== 0 || G !== 0 ? R + G : de(d.left, d.right)) : S = b - 2 * (K !== 0 || ce !== 0 ? K + ce : de(d.top, d.bottom));
    }
    await c({ ...n, availableWidth: L, availableHeight: S });
    const $ = await s.getDimensions(a.floating);
    return m !== $.width || b !== $.height ? { reset: { rects: true } } : {};
  } };
};
function kt(e) {
  return "#document";
}
function he(e) {
  var n;
  return (e == null || (n = e.ownerDocument) == null ? void 0 : n.defaultView) || window;
}
function Le(e) {
  var n;
  return (n = (e.document) || window.document) == null ? void 0 : n.documentElement;
}
function we(e) {
  return false;
}
function Re(e) {
  return false;
}
function vi(e) {
  return false ;
}
const Vd = /* @__PURE__ */ new Set(["inline", "contents"]);
function en(e) {
  const { overflow: n, overflowX: t, overflowY: r, display: i } = Te(e);
  return /auto|scroll|overlay|hidden|clip/.test(n + r + t) && !Vd.has(i);
}
const Gd = [":popover-open", ":modal"];
function Wn(e) {
  return Gd.some((n) => {
    try {
      return e.matches(n);
    } catch {
      return false;
    }
  });
}
const Hd = ["transform", "translate", "scale", "rotate", "perspective"], Bd = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Wd = ["paint", "layout", "strict", "content"];
function Sr(e) {
  const n = Or(), t = e;
  return Hd.some((r) => t[r] ? t[r] !== "none" : false) || (t.containerType ? t.containerType !== "normal" : false) || !n && (t.backdropFilter ? t.backdropFilter !== "none" : false) || !n && (t.filter ? t.filter !== "none" : false) || Bd.some((r) => (t.willChange || "").includes(r)) || Wd.some((r) => (t.contain || "").includes(r));
}
function Or() {
  return typeof CSS > "u" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter", "none");
}
const jd = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Tt(e) {
  return jd.has(kt());
}
function Te(e) {
  return he(e).getComputedStyle(e);
}
function Un(e) {
  return { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function Ye(e) {
  const n = e.assignedSlot || e.parentNode || vi() || Le(e);
  return n;
}
function So(e) {
  const n = Ye(e);
  return Tt() ? e.ownerDocument ? e.ownerDocument.body : e.body : So(n);
}
function zt(e, n, t) {
  var r;
  n === void 0 && (n = []), t === void 0 && (t = true);
  const i = So(e), o = i === ((r = e.ownerDocument) == null ? void 0 : r.body), s = he(i);
  if (o) {
    const a = mr(s);
    return n.concat(s, s.visualViewport || [], en(i) ? i : [], a && t ? zt(a) : []);
  }
  return n.concat(i, zt(i, [], t));
}
function mr(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Oo(e) {
  const n = Te(e);
  let t = parseFloat(n.width) || 0, r = parseFloat(n.height) || 0;
  const o = t, s = r, a = Rn(t) !== o || Rn(r) !== s;
  return a && (t = o, r = s), { width: t, height: r, $: a };
}
function Nr(e) {
  return e.contextElement;
}
function xt(e) {
  Nr(e);
  return Ne(1);
}
const Kd = Ne(0);
function No(e) {
  const n = he(e);
  return !Or() || !n.visualViewport ? Kd : { x: n.visualViewport.offsetLeft, y: n.visualViewport.offsetTop };
}
function qd(e, n, t) {
  return n === void 0 && (n = false), !t || n && t !== he(e) ? false : n;
}
function ht(e, n, t, r) {
  n === void 0 && (n = false), t === void 0 && (t = false);
  const i = e.getBoundingClientRect(), o = Nr(e);
  let s = Ne(1);
  n && (r ? we() : s = xt(e));
  const a = qd(o, t, r) ? No(o) : Ne(0);
  let c = (i.left + a.x) / s.x, u = (i.top + a.y) / s.y, d = i.width / s.x, g = i.height / s.y;
  if (o) {
    const f = he(o), h = r && we() ? he(r) : r;
    let m = f, b = mr(m);
    for (; b && r && h !== m; ) {
      const P = xt(b), E = b.getBoundingClientRect(), p = Te(b), v = E.left + (b.clientLeft + parseFloat(p.paddingLeft)) * P.x, C = E.top + (b.clientTop + parseFloat(p.paddingTop)) * P.y;
      c *= P.x, u *= P.y, d *= P.x, g *= P.y, c += v, u += C, m = he(b), b = mr(m);
    }
  }
  return An({ width: d, height: g, x: c, y: u });
}
function Rr(e, n) {
  const t = Un(e).scrollLeft;
  return n ? n.left + t : ht(Le(e)).left + t;
}
function Ro(e, n, t) {
  t === void 0 && (t = false);
  const r = e.getBoundingClientRect(), i = r.left + n.scrollLeft - (t ? 0 : Rr(e, r)), o = r.top + n.scrollTop;
  return { x: i, y: o };
}
function zd(e) {
  let { elements: n, rect: t, offsetParent: r, strategy: i } = e;
  const o = i === "fixed", s = Le(r), a = n ? Wn(n.floating) : false;
  if (r === s || a && o) return t;
  let c = { scrollLeft: 0, scrollTop: 0 }, u = Ne(1);
  const d = Ne(0);
  if ((!o) && ((c = Un(r)), Re())) ;
  const f = s && true && !o ? Ro(s, c, true) : Ne(0);
  return { width: t.width * u.x, height: t.height * u.y, x: t.x * u.x - c.scrollLeft * u.x + d.x + f.x, y: t.y * u.y - c.scrollTop * u.y + d.y + f.y };
}
function Xd(e) {
  return Array.from(e.getClientRects());
}
function Yd(e) {
  const n = Le(e), t = Un(e), r = e.ownerDocument.body, i = de(n.scrollWidth, n.clientWidth, r.scrollWidth, r.clientWidth), o = de(n.scrollHeight, n.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -t.scrollLeft + Rr(e);
  const a = -t.scrollTop;
  return Te(r).direction === "rtl" && (s += de(n.clientWidth, r.clientWidth) - i), { width: i, height: o, x: s, y: a };
}
function Zd(e, n) {
  const t = he(e), r = Le(e), i = t.visualViewport;
  let o = r.clientWidth, s = r.clientHeight, a = 0, c = 0;
  if (i) {
    o = i.width, s = i.height;
    const u = Or();
    (!u || u && n === "fixed") && (a = i.offsetLeft, c = i.offsetTop);
  }
  return { width: o, height: s, x: a, y: c };
}
function bi(e, n, t) {
  let r;
  if (n === "viewport") r = Zd(e, t);
  else if (n === "document") r = Yd(Le(e));
  else {
    const i = No(e);
    r = { x: n.x - i.x, y: n.y - i.y, width: n.width, height: n.height };
  }
  return An(r);
}
function ko(e, n) {
  Ye(e);
  return false ;
}
function Qd(e, n) {
  const t = n.get(e);
  if (t) return t;
  let r = zt(e, [], false).filter((a) => we()), i = null;
  const o = Te(e).position === "fixed";
  let s = o ? Ye(e) : e;
  for (; we(); ) {
    const a = Te(s), c = Sr(s);
    !c && a.position === "fixed" && (i = null), (o ? !c && !i : !c && a.position === "static" && !!i && ["absolute", "fixed"].includes(i.position) || en(s) && !c && ko(e)) ? r = r.filter((d) => d !== s) : i = a, s = Ye(s);
  }
  return n.set(e, r), r;
}
function eg(e) {
  let { element: n, boundary: t, rootBoundary: r, strategy: i } = e;
  const s = [...t === "clippingAncestors" ? Wn(n) ? [] : Qd(n, this._c) : [].concat(t), r], a = s[0], c = s.reduce((u, d) => {
    const g = bi(n, d, i);
    return u.top = de(g.top, u.top), u.right = Xe(g.right, u.right), u.bottom = Xe(g.bottom, u.bottom), u.left = de(g.left, u.left), u;
  }, bi(n, a, i));
  return { width: c.right - c.left, height: c.bottom - c.top, x: c.left, y: c.top };
}
function tg(e) {
  const { width: n, height: t } = Oo(e);
  return { width: n, height: t };
}
function ng(e, n, t) {
  const r = Re(), i = Le(n), o = t === "fixed", s = ht(e, true, o, n);
  let a = { scrollLeft: 0, scrollTop: 0 };
  const c = Ne(0);
  if (!o) if ((a = Un(n)), r) ; else i && (c.x = Rr(i));
  const u = i && !r && !o ? Ro(i, a) : Ne(0), d = s.left + a.scrollLeft - c.x - u.x, g = s.top + a.scrollTop - c.y - u.y;
  return { x: d, y: g, width: s.width, height: s.height };
}
function Ao(e, n) {
  const t = he(e);
  if (Wn(e)) return t;
  {
    let i = Ye(e);
    for (; i && !Tt(); ) {
      i = Ye(i);
    }
    return t;
  }
}
const rg = async function(e) {
  const n = this.getOffsetParent || Ao, t = this.getDimensions, r = await t(e.floating);
  return { reference: ng(e.reference, await n(e.floating), e.strategy), floating: { x: 0, y: 0, width: r.width, height: r.height } };
};
function ig(e) {
  return Te(e).direction === "rtl";
}
const og = { convertOffsetParentRelativeRectToViewportRelativeRect: zd, getDocumentElement: Le, getClippingRect: eg, getOffsetParent: Ao, getElementRects: rg, getClientRects: Xd, getDimensions: tg, getScale: xt, isElement: we, isRTL: ig };
function Lo(e, n) {
  return e.x === n.x && e.y === n.y && e.width === n.width && e.height === n.height;
}
function sg(e, n) {
  let t = null, r;
  const i = Le(e);
  function o() {
    var a;
    clearTimeout(r), (a = t) == null || a.disconnect(), t = null;
  }
  function s(a, c) {
    a === void 0 && (a = false), c === void 0 && (c = 1), o();
    const u = e.getBoundingClientRect(), { left: d, top: g, width: f, height: h } = u;
    if (a || n(), !f || !h) return;
    const m = pn(g), b = pn(i.clientWidth - (d + f)), P = pn(i.clientHeight - (g + h)), E = pn(d), v = { rootMargin: -m + "px " + -b + "px " + -P + "px " + -E + "px", threshold: de(0, Xe(1, c)) || 1 };
    let C = true;
    function O(M) {
      const S = M[0].intersectionRatio;
      if (S !== c) {
        if (!C) return s();
        S ? s(false, S) : r = setTimeout(() => {
          s(false, 1e-7);
        }, 1e3);
      }
      S === 1 && !Lo(u, e.getBoundingClientRect()) && s(), C = false;
    }
    try {
      t = new IntersectionObserver(O, { ...v, root: i.ownerDocument });
    } catch {
      t = new IntersectionObserver(O, v);
    }
    t.observe(e);
  }
  return s(true), o;
}
function ag(e, n, t, r) {
  r === void 0 && (r = {});
  const { ancestorScroll: i = true, ancestorResize: o = true, elementResize: s = typeof ResizeObserver == "function", layoutShift: a = typeof IntersectionObserver == "function", animationFrame: c = false } = r, u = Nr(e), d = i || o ? [...u ? zt(u) : [], ...zt(n)] : [];
  d.forEach((E) => {
    i && E.addEventListener("scroll", t, { passive: true }), o && E.addEventListener("resize", t);
  });
  const g = u && a ? sg(u, t) : null;
  let f = -1, h = null;
  s && (h = new ResizeObserver((E) => {
    let [p] = E;
    p && p.target === u && h && (h.unobserve(n), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var v;
      (v = h) == null || v.observe(n);
    })), t();
  }), u && !c && h.observe(u), h.observe(n));
  let m, b = c ? ht(e) : null;
  c && P();
  function P() {
    const E = ht(e);
    b && !Lo(b, E) && t(), b = E, m = requestAnimationFrame(P);
  }
  return t(), () => {
    var E;
    d.forEach((p) => {
      i && p.removeEventListener("scroll", t), o && p.removeEventListener("resize", t);
    }), g == null ? void 0 : g(), (E = h) == null || E.disconnect(), h = null, c && cancelAnimationFrame(m);
  };
}
const lg = Ld, cg = $d, ug = Rd, dg = Fd, gg = kd, fg = Nd, hg = Dd, mg = (e, n, t) => {
  const r = /* @__PURE__ */ new Map(), i = { platform: og, ...t }, o = { ...i.platform, _c: r };
  return Od(e, n, { ...i, platform: o });
};
function Ei(e = 0, n = 0, t = 0, r = 0) {
  if (typeof DOMRect == "function") return new DOMRect(e, n, t, r);
  const i = { x: e, y: n, width: t, height: r, top: n, right: e + t, bottom: n + r, left: e };
  return { ...i, toJSON: () => i };
}
function pg(e) {
  if (!e) return Ei();
  const { x: n, y: t, width: r, height: i } = e;
  return Ei(n, t, r, i);
}
function vg(e, n) {
  return { contextElement: ee(e) ? e : void 0, getBoundingClientRect: () => {
    const t = e, r = n == null ? void 0 : n(t);
    return r || !t ? pg(r) : t.getBoundingClientRect();
  } };
}
var Mt = (e) => ({ variable: e, reference: `var(${e})` }), Fe = { arrowSize: Mt("--arrow-size"), arrowSizeHalf: Mt("--arrow-size-half"), arrowBg: Mt("--arrow-background"), transformOrigin: Mt("--transform-origin"), arrowOffset: Mt("--arrow-offset") }, bg = (e) => ({ top: "bottom center", "top-start": e ? `${e.x}px bottom` : "left bottom", "top-end": e ? `${e.x}px bottom` : "right bottom", bottom: "top center", "bottom-start": e ? `${e.x}px top` : "top left", "bottom-end": e ? `${e.x}px top` : "top right", left: "right center", "left-start": e ? `right ${e.y}px` : "right top", "left-end": e ? `right ${e.y}px` : "right bottom", right: "left center", "right-start": e ? `left ${e.y}px` : "left top", "right-end": e ? `left ${e.y}px` : "left bottom" }), yg = { name: "transformOrigin", fn({ placement: e, elements: n, middlewareData: t }) {
  const { arrow: r } = t, i = bg(r)[e], { floating: o } = n;
  return o.style.setProperty(Fe.transformOrigin.variable, i), { data: { transformOrigin: i } };
} }, Eg = { name: "rects", fn({ rects: e }) {
  return { data: e };
} }, Pg = (e) => {
  if (e) return { name: "shiftArrow", fn({ placement: n, middlewareData: t }) {
    if (!t.arrow) return {};
    const { x: r, y: i } = t.arrow, o = n.split("-")[0];
    return Object.assign(e.style, { left: r != null ? `${r}px` : "", top: i != null ? `${i}px` : "", [o]: `calc(100% + ${Fe.arrowOffset.reference})` }), {};
  } };
};
function Ig(e) {
  const [n, t] = e.split("-");
  return { side: n, align: t, hasAlign: t != null };
}
var xg = { strategy: "absolute", placement: "bottom", listeners: true, gutter: 8, flip: true, slide: true, overlap: false, sameWidth: false, fitViewport: false, overflowPadding: 8, arrowPadding: 4 };
function Pi(e, n) {
  const t = e.devicePixelRatio || 1;
  return Math.round(n * t) / t;
}
function $o(e) {
  return sr(e.boundary);
}
function wg(e, n) {
  if (e) return fg({ element: e, padding: n.arrowPadding });
}
function Tg(e, n) {
  var _a2;
  if (!Is((_a2 = n.offset) != null ? _a2 : n.gutter)) return lg(({ placement: t }) => {
    var _a3, _b, _c2, _d2;
    const r = ((e == null ? void 0 : e.clientHeight) || 0) / 2, i = (_b = (_a3 = n.offset) == null ? void 0 : _a3.mainAxis) != null ? _b : n.gutter, o = typeof i == "number" ? i + r : i != null ? i : r, { hasAlign: s } = Ig(t), a = s ? void 0 : n.shift, c = (_d2 = (_c2 = n.offset) == null ? void 0 : _c2.crossAxis) != null ? _d2 : a;
    return Ae({ crossAxis: c, mainAxis: o, alignmentAxis: n.shift });
  });
}
function Cg(e) {
  if (e.flip) return ug({ boundary: $o(e), padding: e.overflowPadding, fallbackPlacements: e.flip === true ? void 0 : e.flip });
}
function Sg(e) {
  if (!(!e.slide && !e.overlap)) return cg({ boundary: $o(e), mainAxis: e.slide, crossAxis: e.overlap, padding: e.overflowPadding, limiter: hg() });
}
function Og(e) {
  return dg({ padding: e.overflowPadding, apply({ elements: n, rects: t, availableHeight: r, availableWidth: i }) {
    const o = n.floating, s = Math.round(t.reference.width);
    i = Math.floor(i), r = Math.floor(r), o.style.setProperty("--reference-width", `${s}px`), o.style.setProperty("--available-width", `${i}px`), o.style.setProperty("--available-height", `${r}px`);
  } });
}
function Ng(e) {
  var _a2, _b;
  if (e.hideWhenDetached) return gg({ strategy: "referenceHidden", boundary: (_b = (_a2 = e.boundary) == null ? void 0 : _a2.call(e)) != null ? _b : "clippingAncestors" });
}
function Rg(e) {
  return e ? e === true ? { ancestorResize: true, ancestorScroll: true, elementResize: true, layoutShift: true } : e : {};
}
function kg(e, n, t = {}) {
  const r = vg(e, t.getAnchorRect);
  if (!n || !r) return;
  const i = Object.assign({}, xg, t), o = n.querySelector("[data-part=arrow]"), s = [Tg(o, i), Cg(i), Sg(i), wg(o, i), Pg(o), yg, Og(i), Ng(i), Eg], { placement: a, strategy: c, onComplete: u, onPositioned: d } = i, g = async () => {
    var _a2;
    if (!r || !n) return;
    const b = await mg(r, n, { placement: a, middleware: s, strategy: c });
    u == null ? void 0 : u(b), d == null ? void 0 : d({ placed: true });
    const P = ae(n), E = Pi(P, b.x), p = Pi(P, b.y);
    n.style.setProperty("--x", `${E}px`), n.style.setProperty("--y", `${p}px`), i.hideWhenDetached && (((_a2 = b.middlewareData.hide) == null ? void 0 : _a2.referenceHidden) ? (n.style.setProperty("visibility", "hidden"), n.style.setProperty("pointer-events", "none")) : (n.style.removeProperty("visibility"), n.style.removeProperty("pointer-events")));
    const v = n.firstElementChild;
    if (v) {
      const C = Ui(v);
      n.style.setProperty("--z-index", C.zIndex);
    }
  }, f = async () => {
    t.updatePosition ? (await t.updatePosition({ updatePosition: g }), d == null ? void 0 : d({ placed: true })) : await g();
  }, h = Rg(i.listeners), m = i.listeners ? ag(r, n, f, h) : Ai;
  return f(), () => {
    m == null ? void 0 : m(), d == null ? void 0 : d({ placed: false });
  };
}
function Ii(e, n, t = {}) {
  const { defer: r, ...i } = t, o = r ? se : (a) => a(), s = [];
  return s.push(o(() => {
    const a = typeof e == "function" ? e() : e, c = typeof n == "function" ? n() : n;
    s.push(kg(a, c, i));
  })), () => {
    s.forEach((a) => a == null ? void 0 : a());
  };
}
var Ag = { bottom: "rotate(45deg)", left: "rotate(135deg)", top: "rotate(225deg)", right: "rotate(315deg)" };
function Lg(e = {}) {
  const { placement: n, sameWidth: t, fitViewport: r, strategy: i = "absolute" } = e;
  return { arrow: { position: "absolute", width: Fe.arrowSize.reference, height: Fe.arrowSize.reference, [Fe.arrowSizeHalf.variable]: `calc(${Fe.arrowSize.reference} / 2)`, [Fe.arrowOffset.variable]: `calc(${Fe.arrowSizeHalf.reference} * -1)` }, arrowTip: { transform: n ? Ag[n.split("-")[0]] : void 0, background: Fe.arrowBg.reference, top: "0", left: "0", width: "100%", height: "100%", position: "absolute", zIndex: "inherit" }, floating: { position: i, isolation: "isolate", minWidth: t ? void 0 : "max-content", width: t ? "var(--reference-width)" : void 0, maxWidth: r ? "var(--available-width)" : void 0, maxHeight: r ? "var(--available-height)" : void 0, top: "0px", left: "0px", transform: n ? "translate3d(var(--x), var(--y), 0)" : "translate3d(0, -100vh, 0)", zIndex: "var(--z-index)" } };
}
var $g = xe("select").parts("label", "positioner", "trigger", "indicator", "clearTrigger", "item", "itemText", "itemIndicator", "itemGroup", "itemGroupLabel", "list", "content", "root", "control", "valueText"), ie = $g.build(), Do = (e) => ze(new xr(e));
Do.empty = () => ze(new xr({ items: [] }));
var N = St({ getRootId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.root) != null ? _b : `select:${e.id}`;
}, getContentId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.content) != null ? _b : `select:${e.id}:content`;
}, getTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.trigger) != null ? _b : `select:${e.id}:trigger`;
}, getClearTriggerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.clearTrigger) != null ? _b : `select:${e.id}:clear-trigger`;
}, getLabelId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.label) != null ? _b : `select:${e.id}:label`;
}, getControlId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.control) != null ? _b : `select:${e.id}:control`;
}, getItemId: (e, n) => {
  var _a2, _b, _c2;
  return (_c2 = (_b = (_a2 = e.ids) == null ? void 0 : _a2.item) == null ? void 0 : _b.call(_a2, n)) != null ? _c2 : `select:${e.id}:option:${n}`;
}, getHiddenSelectId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.hiddenSelect) != null ? _b : `select:${e.id}:select`;
}, getPositionerId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.positioner) != null ? _b : `select:${e.id}:positioner`;
}, getItemGroupId: (e, n) => {
  var _a2, _b, _c2;
  return (_c2 = (_b = (_a2 = e.ids) == null ? void 0 : _a2.itemGroup) == null ? void 0 : _b.call(_a2, n)) != null ? _c2 : `select:${e.id}:optgroup:${n}`;
}, getItemGroupLabelId: (e, n) => {
  var _a2, _b, _c2;
  return (_c2 = (_b = (_a2 = e.ids) == null ? void 0 : _a2.itemGroupLabel) == null ? void 0 : _b.call(_a2, n)) != null ? _c2 : `select:${e.id}:optgroup-label:${n}`;
}, getHiddenSelectEl: (e) => N.getById(e, N.getHiddenSelectId(e)), getContentEl: (e) => N.getById(e, N.getContentId(e)), getControlEl: (e) => N.getById(e, N.getControlId(e)), getTriggerEl: (e) => N.getById(e, N.getTriggerId(e)), getClearTriggerEl: (e) => N.getById(e, N.getClearTriggerId(e)), getPositionerEl: (e) => N.getById(e, N.getPositionerId(e)), getHighlightedOptionEl(e) {
  return e.highlightedValue ? N.getById(e, N.getItemId(e, e.highlightedValue)) : null;
} });
function Dg(e, n, t) {
  const r = e.context.isDisabled, i = e.context.invalid, o = e.context.readOnly, s = e.context.isInteractive, a = e.context.composite, c = e.hasTag("open"), u = e.matches("focused"), d = e.context.highlightedValue, g = e.context.highlightedItem, f = e.context.selectedItems, h = e.context.isTypingAhead, m = e.context.collection, b = d ? N.getItemId(e.context, d) : void 0;
  function P(p) {
    const v = m.getItemDisabled(p.item), C = m.getItemValue(p.item);
    return { value: C, disabled: !!(r || v), highlighted: d === C, selected: e.context.value.includes(C) };
  }
  const E = Lg({ ...e.context.positioning, placement: e.context.currentPlacement });
  return { open: c, focused: u, empty: e.context.value.length === 0, highlightedItem: g, highlightedValue: d, selectedItems: f, hasSelectedItems: e.context.hasSelectedItems, value: e.context.value, valueAsString: e.context.valueAsString, collection: m, multiple: !!e.context.multiple, disabled: !!r, setCollection(p) {
    n({ type: "COLLECTION.SET", value: p });
  }, reposition(p = {}) {
    n({ type: "POSITIONING.SET", options: p });
  }, focus() {
    var _a2;
    (_a2 = N.getTriggerEl(e.context)) == null ? void 0 : _a2.focus({ preventScroll: true });
  }, setOpen(p) {
    p !== c && n(p ? "OPEN" : "CLOSE");
  }, selectValue(p) {
    n({ type: "ITEM.SELECT", value: p });
  }, setValue(p) {
    n({ type: "VALUE.SET", value: p });
  }, selectAll() {
    n({ type: "VALUE.SET", value: m.getValues() });
  }, highlightValue(p) {
    n({ type: "HIGHLIGHTED_VALUE.SET", value: p });
  }, clearValue(p) {
    n(p ? { type: "ITEM.CLEAR", value: p } : { type: "VALUE.CLEAR" });
  }, getItemState: P, getRootProps() {
    return t.element({ ...ie.root.attrs, dir: e.context.dir, id: N.getRootId(e.context), "data-invalid": x(i), "data-readonly": x(o) });
  }, getLabelProps() {
    return t.label({ dir: e.context.dir, id: N.getLabelId(e.context), ...ie.label.attrs, "data-disabled": x(r), "data-invalid": x(i), "data-readonly": x(o), htmlFor: N.getHiddenSelectId(e.context), onClick(p) {
      var _a2;
      p.defaultPrevented || r || ((_a2 = N.getTriggerEl(e.context)) == null ? void 0 : _a2.focus({ preventScroll: true }));
    } });
  }, getControlProps() {
    return t.element({ ...ie.control.attrs, dir: e.context.dir, id: N.getControlId(e.context), "data-state": c ? "open" : "closed", "data-focus": x(u), "data-disabled": x(r), "data-invalid": x(i) });
  }, getValueTextProps() {
    return t.element({ ...ie.valueText.attrs, dir: e.context.dir, "data-disabled": x(r), "data-invalid": x(i), "data-focus": x(u) });
  }, getTriggerProps() {
    return t.button({ id: N.getTriggerId(e.context), disabled: r, dir: e.context.dir, type: "button", role: "combobox", "aria-controls": N.getContentId(e.context), "aria-expanded": c, "aria-haspopup": "listbox", "data-state": c ? "open" : "closed", "aria-invalid": i, "aria-labelledby": N.getLabelId(e.context), ...ie.trigger.attrs, "data-disabled": x(r), "data-invalid": x(i), "data-readonly": x(o), "data-placement": e.context.currentPlacement, "data-placeholder-shown": x(!e.context.hasSelectedItems), onClick(p) {
      s && (p.defaultPrevented || n({ type: "TRIGGER.CLICK" }));
    }, onFocus() {
      n("TRIGGER.FOCUS");
    }, onBlur() {
      n("TRIGGER.BLUR");
    }, onKeyDown(p) {
      if (p.defaultPrevented || !s) return;
      const C = { ArrowUp() {
        n({ type: "TRIGGER.ARROW_UP" });
      }, ArrowDown(O) {
        n({ type: O.altKey ? "OPEN" : "TRIGGER.ARROW_DOWN" });
      }, ArrowLeft() {
        n({ type: "TRIGGER.ARROW_LEFT" });
      }, ArrowRight() {
        n({ type: "TRIGGER.ARROW_RIGHT" });
      }, Home() {
        n({ type: "TRIGGER.HOME" });
      }, End() {
        n({ type: "TRIGGER.END" });
      }, Enter() {
        n({ type: "TRIGGER.ENTER" });
      }, Space(O) {
        n(h ? { type: "TRIGGER.TYPEAHEAD", key: O.key } : { type: "TRIGGER.ENTER" });
      } }[Ur(p, e.context)];
      if (C) {
        C(p), p.preventDefault();
        return;
      }
      lr.isValidEvent(p) && (n({ type: "TRIGGER.TYPEAHEAD", key: p.key }), p.preventDefault());
    } });
  }, getIndicatorProps() {
    return t.element({ ...ie.indicator.attrs, dir: e.context.dir, "aria-hidden": true, "data-state": c ? "open" : "closed", "data-disabled": x(r), "data-invalid": x(i), "data-readonly": x(o) });
  }, getItemProps(p) {
    const v = P(p);
    return t.element({ id: N.getItemId(e.context, v.value), role: "option", ...ie.item.attrs, dir: e.context.dir, "data-value": v.value, "aria-selected": v.selected, "data-state": v.selected ? "checked" : "unchecked", "data-highlighted": x(v.highlighted), "data-disabled": x(v.disabled), "aria-disabled": Tn(v.disabled), onPointerMove(C) {
      v.disabled || C.pointerType !== "mouse" || v.value !== e.context.highlightedValue && n({ type: "ITEM.POINTER_MOVE", value: v.value });
    }, onClick(C) {
      C.defaultPrevented || v.disabled || n({ type: "ITEM.CLICK", src: "pointerup", value: v.value });
    }, onPointerLeave(C) {
      v.disabled || p.persistFocus || C.pointerType !== "mouse" || !e.previousEvent.type.includes("POINTER") || n({ type: "ITEM.POINTER_LEAVE" });
    } });
  }, getItemTextProps(p) {
    const v = P(p);
    return t.element({ ...ie.itemText.attrs, "data-state": v.selected ? "checked" : "unchecked", "data-disabled": x(v.disabled), "data-highlighted": x(v.highlighted) });
  }, getItemIndicatorProps(p) {
    const v = P(p);
    return t.element({ "aria-hidden": true, ...ie.itemIndicator.attrs, "data-state": v.selected ? "checked" : "unchecked", hidden: !v.selected });
  }, getItemGroupLabelProps(p) {
    const { htmlFor: v } = p;
    return t.element({ ...ie.itemGroupLabel.attrs, id: N.getItemGroupLabelId(e.context, v), role: "group", dir: e.context.dir });
  }, getItemGroupProps(p) {
    const { id: v } = p;
    return t.element({ ...ie.itemGroup.attrs, "data-disabled": x(r), id: N.getItemGroupId(e.context, v), "aria-labelledby": N.getItemGroupLabelId(e.context, v), dir: e.context.dir });
  }, getClearTriggerProps() {
    return t.button({ ...ie.clearTrigger.attrs, id: N.getClearTriggerId(e.context), type: "button", "aria-label": "Clear value", "data-invalid": x(i), disabled: r, hidden: !e.context.hasSelectedItems, dir: e.context.dir, onClick(p) {
      p.defaultPrevented || n("CLEAR.CLICK");
    } });
  }, getHiddenSelectProps() {
    return t.select({ name: e.context.name, form: e.context.form, disabled: r, multiple: e.context.multiple, required: e.context.required, "aria-hidden": true, id: N.getHiddenSelectId(e.context), defaultValue: e.context.multiple ? e.context.value : e.context.value[0], style: Pr, tabIndex: -1, onFocus() {
      var _a2;
      (_a2 = N.getTriggerEl(e.context)) == null ? void 0 : _a2.focus({ preventScroll: true });
    }, "aria-labelledby": N.getLabelId(e.context) });
  }, getPositionerProps() {
    return t.element({ ...ie.positioner.attrs, dir: e.context.dir, id: N.getPositionerId(e.context), style: E.floating });
  }, getContentProps() {
    return t.element({ hidden: !c, dir: e.context.dir, id: N.getContentId(e.context), role: a ? "listbox" : "dialog", ...ie.content.attrs, "data-state": c ? "open" : "closed", "data-placement": e.context.currentPlacement, "data-activedescendant": b, "aria-activedescendant": a ? b : void 0, "aria-multiselectable": e.context.multiple && a ? true : void 0, "aria-labelledby": N.getLabelId(e.context), tabIndex: 0, onKeyDown(p) {
      if (!s || !La(p)) return;
      if (p.key === "Tab" && !Za(p)) {
        p.preventDefault();
        return;
      }
      const v = { ArrowUp() {
        n({ type: "CONTENT.ARROW_UP" });
      }, ArrowDown() {
        n({ type: "CONTENT.ARROW_DOWN" });
      }, Home() {
        n({ type: "CONTENT.HOME" });
      }, End() {
        n({ type: "CONTENT.END" });
      }, Enter() {
        n({ type: "ITEM.CLICK", src: "keydown.enter" });
      }, Space(M) {
        var _a2;
        h ? n({ type: "CONTENT.TYPEAHEAD", key: M.key }) : (_a2 = v.Enter) == null ? void 0 : _a2.call(v, M);
      } }, C = v[Ur(p)];
      if (C) {
        C(p), p.preventDefault();
        return;
      }
      const O = oe(p);
      Bi(O) || lr.isValidEvent(p) && (n({ type: "CONTENT.TYPEAHEAD", key: p.key }), p.preventDefault());
    } });
  }, getListProps() {
    return t.element({ ...ie.list.attrs, tabIndex: 0, role: a ? void 0 : "listbox", "aria-labelledby": N.getTriggerId(e.context), "aria-activedescendant": a ? void 0 : b, "aria-multiselectable": !a && e.context.multiple ? true : void 0 });
  } };
}
var { and: _t, not: it, or: Fg } = Dn;
function Vg(e) {
  var _a2;
  const n = Ae(e);
  return mt({ id: "select", context: { value: [], highlightedValue: null, loopFocus: false, closeOnSelect: !n.multiple, disabled: false, readOnly: false, composite: true, ...n, highlightedItem: null, selectedItems: [], valueAsString: "", collection: (_a2 = n.collection) != null ? _a2 : Do.empty(), typeahead: lr.defaultOptions, fieldsetDisabled: false, positioning: { placement: "bottom-start", gutter: 8, ...n.positioning } }, computed: { hasSelectedItems: (t) => t.value.length > 0, isTypingAhead: (t) => t.typeahead.keysSoFar !== "", isDisabled: (t) => !!t.disabled || t.fieldsetDisabled, isInteractive: (t) => !(t.isDisabled || t.readOnly) }, initial: n.open ? "open" : "idle", created: ["syncCollection"], entry: ["syncSelectElement"], watch: { open: ["toggleVisibility"], value: ["syncSelectedItems", "syncSelectElement"], highlightedValue: ["syncHighlightedItem"], collection: ["syncCollection"] }, on: { "HIGHLIGHTED_VALUE.SET": { actions: ["setHighlightedItem"] }, "ITEM.SELECT": { actions: ["selectItem"] }, "ITEM.CLEAR": { actions: ["clearItem"] }, "VALUE.SET": { actions: ["setSelectedItems"] }, "VALUE.CLEAR": { actions: ["clearSelectedItems"] }, "CLEAR.CLICK": { actions: ["clearSelectedItems", "focusTriggerEl"] }, "COLLECTION.SET": { actions: ["setCollection"] } }, activities: ["trackFormControlState"], states: { idle: { tags: ["closed"], on: { "CONTROLLED.OPEN": [{ guard: "isTriggerClickEvent", target: "open", actions: ["setInitialFocus", "highlightFirstSelectedItem"] }, { target: "open", actions: ["setInitialFocus"] }], "TRIGGER.CLICK": [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["invokeOnOpen", "setInitialFocus", "highlightFirstSelectedItem"] }], "TRIGGER.FOCUS": { target: "focused" }, OPEN: [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen"] }] } }, focused: { tags: ["closed"], on: { "CONTROLLED.OPEN": [{ guard: "isTriggerClickEvent", target: "open", actions: ["setInitialFocus", "highlightFirstSelectedItem"] }, { guard: "isTriggerArrowUpEvent", target: "open", actions: ["setInitialFocus", "highlightComputedLastItem"] }, { guard: Fg("isTriggerArrowDownEvent", "isTriggerEnterEvent"), target: "open", actions: ["setInitialFocus", "highlightComputedFirstItem"] }, { target: "open", actions: ["setInitialFocus"] }], OPEN: [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen"] }], "TRIGGER.BLUR": { target: "idle" }, "TRIGGER.CLICK": [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen", "highlightFirstSelectedItem"] }], "TRIGGER.ENTER": [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen", "highlightComputedFirstItem"] }], "TRIGGER.ARROW_UP": [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen", "highlightComputedLastItem"] }], "TRIGGER.ARROW_DOWN": [{ guard: "isOpenControlled", actions: ["invokeOnOpen"] }, { target: "open", actions: ["setInitialFocus", "invokeOnOpen", "highlightComputedFirstItem"] }], "TRIGGER.ARROW_LEFT": [{ guard: _t(it("multiple"), "hasSelectedItems"), actions: ["selectPreviousItem"] }, { guard: it("multiple"), actions: ["selectLastItem"] }], "TRIGGER.ARROW_RIGHT": [{ guard: _t(it("multiple"), "hasSelectedItems"), actions: ["selectNextItem"] }, { guard: it("multiple"), actions: ["selectFirstItem"] }], "TRIGGER.HOME": { guard: it("multiple"), actions: ["selectFirstItem"] }, "TRIGGER.END": { guard: it("multiple"), actions: ["selectLastItem"] }, "TRIGGER.TYPEAHEAD": { guard: it("multiple"), actions: ["selectMatchingItem"] } } }, open: { tags: ["open"], exit: ["scrollContentToTop"], activities: ["trackDismissableElement", "computePlacement", "scrollToHighlightedItem"], on: { "CONTROLLED.CLOSE": { target: "focused", actions: ["focusTriggerEl", "clearHighlightedItem"] }, CLOSE: [{ guard: "isOpenControlled", actions: ["invokeOnClose"] }, { target: "focused", actions: ["invokeOnClose", "focusTriggerEl", "clearHighlightedItem"] }], "TRIGGER.CLICK": [{ guard: "isOpenControlled", actions: ["invokeOnClose"] }, { target: "focused", actions: ["invokeOnClose", "clearHighlightedItem"] }], "ITEM.CLICK": [{ guard: _t("closeOnSelect", "isOpenControlled"), actions: ["selectHighlightedItem", "invokeOnClose"] }, { guard: "closeOnSelect", target: "focused", actions: ["selectHighlightedItem", "invokeOnClose", "focusTriggerEl", "clearHighlightedItem"] }, { actions: ["selectHighlightedItem"] }], "CONTENT.HOME": { actions: ["highlightFirstItem"] }, "CONTENT.END": { actions: ["highlightLastItem"] }, "CONTENT.ARROW_DOWN": [{ guard: _t("hasHighlightedItem", "loop", "isLastItemHighlighted"), actions: ["highlightFirstItem"] }, { guard: "hasHighlightedItem", actions: ["highlightNextItem"] }, { actions: ["highlightFirstItem"] }], "CONTENT.ARROW_UP": [{ guard: _t("hasHighlightedItem", "loop", "isFirstItemHighlighted"), actions: ["highlightLastItem"] }, { guard: "hasHighlightedItem", actions: ["highlightPreviousItem"] }, { actions: ["highlightLastItem"] }], "CONTENT.TYPEAHEAD": { actions: ["highlightMatchingItem"] }, "ITEM.POINTER_MOVE": { actions: ["highlightItem"] }, "ITEM.POINTER_LEAVE": { actions: ["clearHighlightedItem"] }, "POSITIONING.SET": { actions: ["reposition"] } } } } }, { guards: { loop: (t) => !!t.loopFocus, multiple: (t) => !!t.multiple, hasSelectedItems: (t) => !!t.hasSelectedItems, hasHighlightedItem: (t) => t.highlightedValue != null, isFirstItemHighlighted: (t) => t.highlightedValue === t.collection.firstValue, isLastItemHighlighted: (t) => t.highlightedValue === t.collection.lastValue, closeOnSelect: (t, r) => {
    var _a3;
    return !!((_a3 = r.closeOnSelect) != null ? _a3 : t.closeOnSelect);
  }, isOpenControlled: (t) => !!t["open.controlled"], isTriggerClickEvent: (t, r) => {
    var _a3;
    return ((_a3 = r.previousEvent) == null ? void 0 : _a3.type) === "TRIGGER.CLICK";
  }, isTriggerEnterEvent: (t, r) => {
    var _a3;
    return ((_a3 = r.previousEvent) == null ? void 0 : _a3.type) === "TRIGGER.ENTER";
  }, isTriggerArrowUpEvent: (t, r) => {
    var _a3;
    return ((_a3 = r.previousEvent) == null ? void 0 : _a3.type) === "TRIGGER.ARROW_UP";
  }, isTriggerArrowDownEvent: (t, r) => {
    var _a3;
    return ((_a3 = r.previousEvent) == null ? void 0 : _a3.type) === "TRIGGER.ARROW_DOWN";
  } }, activities: { trackFormControlState(t, r, { initialContext: i }) {
    return Vn(N.getHiddenSelectEl(t), { onFieldsetDisabledChange(o) {
      t.fieldsetDisabled = o;
    }, onFormReset() {
      U.selectedItems(t, i.value);
    } });
  }, trackDismissableElement(t, r, { send: i }) {
    const o = () => N.getContentEl(t);
    let s = true;
    return bo(o, { defer: true, exclude: [N.getTriggerEl(t), N.getClearTriggerEl(t)], onFocusOutside: t.onFocusOutside, onPointerDownOutside: t.onPointerDownOutside, onInteractOutside(a) {
      var _a3;
      (_a3 = t.onInteractOutside) == null ? void 0 : _a3.call(t, a), s = !(a.detail.focusable || a.detail.contextmenu);
    }, onDismiss() {
      i({ type: "CLOSE", src: "interact-outside", restoreFocus: s });
    } });
  }, computePlacement(t) {
    return t.currentPlacement = t.positioning.placement, Ii(() => N.getTriggerEl(t), () => N.getPositionerEl(t), { defer: true, ...t.positioning, onComplete(o) {
      t.currentPlacement = o.placement;
    } });
  }, scrollToHighlightedItem(t, r, { getState: i }) {
    const o = (a) => {
      if (t.highlightedValue == null || i().event.type.includes("POINTER")) return;
      const u = N.getHighlightedOptionEl(t), d = N.getContentEl(t);
      if (t.scrollToIndexFn) {
        const g = t.collection.indexOf(t.highlightedValue);
        t.scrollToIndexFn({ index: g, immediate: a });
        return;
      }
      tl(u, { rootEl: d, block: "nearest" });
    };
    return se(() => o(true)), to(() => N.getContentEl(t), { defer: true, attributes: ["data-activedescendant"], callback() {
      o(false);
    } });
  } }, actions: { reposition(t, r) {
    const i = () => N.getPositionerEl(t);
    Ii(N.getTriggerEl(t), i, { ...t.positioning, ...r.options, defer: true, listeners: false, onComplete(o) {
      t.currentPlacement = o.placement;
    } });
  }, toggleVisibility(t, r, { send: i }) {
    i({ type: t.open ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE", previousEvent: r });
  }, highlightPreviousItem(t) {
    if (t.highlightedValue == null) return;
    const r = t.collection.getPreviousValue(t.highlightedValue);
    U.highlightedItem(t, r);
  }, highlightNextItem(t) {
    if (t.highlightedValue == null) return;
    const r = t.collection.getNextValue(t.highlightedValue);
    U.highlightedItem(t, r);
  }, highlightFirstItem(t) {
    const r = t.collection.firstValue;
    U.highlightedItem(t, r);
  }, highlightLastItem(t) {
    const r = t.collection.lastValue;
    U.highlightedItem(t, r);
  }, setInitialFocus(t) {
    se(() => {
      var _a3;
      (_a3 = Ya({ root: N.getContentEl(t) })) == null ? void 0 : _a3.focus({ preventScroll: true });
    });
  }, focusTriggerEl(t, r) {
    var _a3, _b;
    const i = (_b = r.restoreFocus) != null ? _b : (_a3 = r.previousEvent) == null ? void 0 : _a3.restoreFocus;
    i != null && !i || se(() => {
      var _a4;
      (_a4 = N.getTriggerEl(t)) == null ? void 0 : _a4.focus({ preventScroll: true });
    });
  }, selectHighlightedItem(t, r) {
    var _a3;
    let i = (_a3 = r.value) != null ? _a3 : t.highlightedValue;
    if (i == null) return;
    const o = t.deselectable && !t.multiple && t.value.includes(i);
    i = o ? null : i, U.selectedItem(t, i, o);
  }, highlightComputedFirstItem(t) {
    const r = t.hasSelectedItems ? t.collection.sort(t.value)[0] : t.collection.firstValue;
    U.highlightedItem(t, r);
  }, highlightComputedLastItem(t) {
    const r = t.hasSelectedItems ? t.collection.sort(t.value)[0] : t.collection.lastValue;
    U.highlightedItem(t, r);
  }, highlightFirstSelectedItem(t) {
    if (!t.hasSelectedItems) return;
    const [r] = t.collection.sort(t.value);
    U.highlightedItem(t, r);
  }, highlightItem(t, r) {
    U.highlightedItem(t, r.value);
  }, highlightMatchingItem(t, r) {
    const i = t.collection.search(r.key, { state: t.typeahead, currentValue: t.highlightedValue });
    i != null && U.highlightedItem(t, i);
  }, setHighlightedItem(t, r) {
    U.highlightedItem(t, r.value);
  }, clearHighlightedItem(t) {
    U.highlightedItem(t, null, true);
  }, selectItem(t, r) {
    const i = t.deselectable && !t.multiple && t.value.includes(r.value), o = i ? null : r.value;
    U.selectedItem(t, o, i);
  }, clearItem(t, r) {
    const i = t.value.filter((o) => o !== r.value);
    U.selectedItems(t, i);
  }, setSelectedItems(t, r) {
    U.selectedItems(t, r.value);
  }, clearSelectedItems(t) {
    U.selectedItems(t, []);
  }, selectPreviousItem(t) {
    const r = t.collection.getPreviousValue(t.value[0]);
    U.selectedItem(t, r);
  }, selectNextItem(t) {
    const r = t.collection.getNextValue(t.value[0]);
    U.selectedItem(t, r);
  }, selectFirstItem(t) {
    const r = t.collection.firstValue;
    U.selectedItem(t, r);
  }, selectLastItem(t) {
    const r = t.collection.lastValue;
    U.selectedItem(t, r);
  }, selectMatchingItem(t, r) {
    const i = t.collection.search(r.key, { state: t.typeahead, currentValue: t.value[0] });
    i != null && U.selectedItem(t, i);
  }, scrollContentToTop(t) {
    var _a3;
    t.scrollToIndexFn ? t.scrollToIndexFn({ index: 0, immediate: true }) : (_a3 = N.getContentEl(t)) == null ? void 0 : _a3.scrollTo(0, 0);
  }, invokeOnOpen(t) {
    var _a3;
    (_a3 = t.onOpenChange) == null ? void 0 : _a3.call(t, { open: true });
  }, invokeOnClose(t) {
    var _a3;
    (_a3 = t.onOpenChange) == null ? void 0 : _a3.call(t, { open: false });
  }, syncSelectElement(t) {
    const r = N.getHiddenSelectEl(t);
    if (r) {
      if (t.value.length === 0 && !t.multiple) {
        r.selectedIndex = -1;
        return;
      }
      for (const i of r.options) i.selected = t.value.includes(i.value);
    }
  }, setCollection(t, r) {
    t.collection = r.value;
  }, syncCollection(t) {
    const r = t.collection.findMany(t.value), i = t.collection.stringifyItems(r);
    t.highlightedItem = t.collection.find(t.highlightedValue), t.selectedItems = r, t.valueAsString = i;
  }, syncSelectedItems(t) {
    Ln.valueChange(t);
  }, syncHighlightedItem(t) {
    Ln.highlightChange(t);
  } } });
}
function Mg(e) {
  se(() => {
    const n = N.getHiddenSelectEl(e);
    if (!n) return;
    const t = N.getWin(e), r = new t.Event("change", { bubbles: true, composed: true });
    n.dispatchEvent(r);
  });
}
var Ln = { valueChange: (e) => {
  const n = e.selectedItems;
  e.selectedItems = e.value.map((t) => {
    const r = n.find((i) => e.collection.getItemValue(i) === t);
    return r || e.collection.find(t);
  }), e.valueAsString = e.collection.stringifyItems(e.selectedItems);
}, highlightChange: (e) => {
  e.highlightedItem = e.collection.find(e.highlightedValue);
} }, vn = { valueChange: (e) => {
  var _a2;
  Ln.valueChange(e), (_a2 = e.onValueChange) == null ? void 0 : _a2.call(e, { value: Array.from(e.value), items: Array.from(e.selectedItems) }), Mg(e);
}, highlightChange: (e) => {
  var _a2;
  Ln.highlightChange(e), (_a2 = e.onHighlightChange) == null ? void 0 : _a2.call(e, { highlightedValue: e.highlightedValue, highlightedItem: e.highlightedItem, highlightedIndex: e.collection.indexOf(e.highlightedValue) });
} }, U = { selectedItem: (e, n, t = false) => {
  if (!fe(e.value, n) && !(n == null && !t)) {
    if (n == null && t) {
      e.value = [], vn.valueChange(e);
      return;
    }
    e.value = e.multiple ? bs(e.value, n) : [n], vn.valueChange(e);
  }
}, selectedItems: (e, n) => {
  fe(e.value, n) || (e.value = n, vn.valueChange(e));
}, highlightedItem: (e, n, t = false) => {
  fe(e.highlightedValue, n) || n == null && !t || (e.highlightedValue = n != null ? n : null, vn.highlightChange(e));
} };
Ce()(["closeOnSelect", "collection", "dir", "disabled", "deselectable", "form", "getRootNode", "highlightedValue", "id", "ids", "invalid", "loopFocus", "multiple", "name", "onFocusOutside", "onHighlightChange", "onInteractOutside", "onOpenChange", "onPointerDownOutside", "onValueChange", "open.controlled", "open", "composite", "positioning", "required", "readOnly", "scrollToIndexFn", "value"]);
Ce()(["item", "persistFocus"]);
Ce()(["id"]);
Ce()(["htmlFor"]);
var _g = ["<option", " value></option>"], Gg = ["<option", "", ">", "</option>"], [Fo, re] = te({ hookName: "useSelectContext", providerName: "<SelectProvider />" }), Hg = (e) => {
  const n = re(), t = I(() => n().getClearTriggerProps(), e);
  return createComponent(w.button, t);
}, Bg = (e) => {
  const n = re(), t = Jt(), r = I(() => n().getContentProps(), () => t().presenceProps, e);
  return createComponent(Show, { get when() {
    return !t().unmounted;
  }, get children() {
    return createComponent(w.div, r);
  } });
}, Wg = (e) => e.children(re()), Ug = (e) => {
  const n = re(), t = I(() => n().getControlProps(), e);
  return createComponent(w.div, t);
}, jg = (e) => {
  const n = re(), t = I(() => n().getHiddenSelectProps(), e), r = createMemo(() => n().value.length === 0), i = ne();
  return createComponent(w.select, mergeProps({ get "aria-describedby"() {
    return i == null ? void 0 : i().ariaDescribedby;
  } }, t, { get children() {
    return [createComponent(Show, { get when() {
      return r();
    }, get children() {
      return ssr(_g, ssrHydrationKey());
    } }), createComponent(Index$1, { get each() {
      return n().collection.items;
    }, children: (o) => {
      var _a2;
      return ssr(Gg, ssrHydrationKey() + ssrAttribute("value", (_a2 = escape(n().collection.getItemValue(o()), true)) != null ? _a2 : "", false), ssrAttribute("disabled", n().collection.getItemDisabled(o()), true), escape(n().collection.stringifyItem(o())));
    } })];
  } }));
}, Kg = (e) => {
  const n = re(), t = I(() => n().getIndicatorProps(), e);
  return createComponent(w.div, t);
}, [qg, zg] = te({ hookName: "useSelectItemContext", providerName: "<SelectItemProvider />" }), [Xg, Vo] = te({ hookName: "useSelectItemPropsContext", providerName: "<SelectItemPropsProvider />" }), Yg = (e) => {
  const [n, t] = W()(e, ["item", "persistFocus"]), r = re(), i = I(() => r().getItemProps(n), t), o = createMemo(() => r().getItemState(n));
  return createComponent(Xg, { value: n, get children() {
    return createComponent(qg, { value: o, get children() {
      return createComponent(w.div, i);
    } });
  } });
}, Zg = (e) => e.children(zg()), [Jg, Qg] = te({ hookName: "useSelectItemGroupPropsContext", providerName: "<SelectItemGroupPropsProvider />" }), ef = (e) => {
  const [n, t] = W()(e, ["id"]), r = re(), i = I({ id: createUniqueId() }, n), o = I(() => r().getItemGroupProps(i), t);
  return createComponent(Jg, { value: i, get children() {
    return createComponent(w.div, o);
  } });
}, tf = (e) => {
  const n = re(), t = Qg(), r = I(() => n().getItemGroupLabelProps({ htmlFor: t.id }), e);
  return createComponent(w.div, r);
}, nf = (e) => {
  const n = re(), t = Vo(), r = I(() => n().getItemIndicatorProps(t), e);
  return createComponent(w.div, r);
}, rf = (e) => {
  const n = re(), t = Vo(), r = I(() => n().getItemTextProps(t), e);
  return createComponent(w.span, r);
}, of = (e) => {
  const n = re(), t = I(() => n().getLabelProps(), e);
  return createComponent(w.label, t);
}, sf = (e) => {
  const n = re(), t = I(() => n().getListProps(), e);
  return createComponent(w.div, t);
}, af = (e) => {
  const n = re(), t = Jt(), r = I(() => n().getPositionerProps(), e);
  return createComponent(Show, { get when() {
    return !t().unmounted;
  }, get children() {
    return createComponent(w.div, r);
  } });
}, lf = (e) => {
  const n = Nt(), t = Ot(), r = createUniqueId(), i = ne(), o = createMemo(() => ({ id: r, ids: { label: i == null ? void 0 : i().ids.label, hiddenSelect: i == null ? void 0 : i().ids.control }, disabled: i == null ? void 0 : i().disabled, readOnly: i == null ? void 0 : i().readOnly, invalid: i == null ? void 0 : i().invalid, required: i == null ? void 0 : i().required, dir: n().dir, getRootNode: t().getRootNode, open: e.defaultOpen, value: e.defaultValue, "open.controlled": e.open !== void 0, ...e })), s = createMemo(() => {
    const [, d] = splitProps(o(), ["collection"]);
    return d;
  }), [a, c, u] = pt(Vg(o()), { context: s });
  return createEffect(() => {
    u.setContext({ collection: e.collection });
  }), createMemo(() => Dg(a, c, Ct));
}, cf = (e) => {
  const [n, t] = Gn(e), [r, i] = W()(t, ["closeOnSelect", "composite", "collection", "defaultOpen", "defaultValue", "deselectable", "disabled", "form", "highlightedValue", "id", "ids", "invalid", "loopFocus", "multiple", "name", "onFocusOutside", "onHighlightChange", "onInteractOutside", "onOpenChange", "onPointerDownOutside", "onValueChange", "open", "positioning", "readOnly", "required", "scrollToIndexFn", "value"]), o = lf(r), s = Zt(I(() => ({ present: o().open }), n)), a = I(() => o().getRootProps(), i);
  return createComponent(Fo, { value: o, get children() {
    return createComponent(Hn, { value: s, get children() {
      return createComponent(w.div, a);
    } });
  } });
}, uf = (e) => {
  const [n, t] = Gn(e), [{ value: r }, i] = W()(t, ["value"]), o = Zt(I(() => ({ present: r().open }), n)), s = I(() => r().getRootProps(), i);
  return createComponent(Fo, { value: r, get children() {
    return createComponent(Hn, { value: o, get children() {
      return createComponent(w.div, s);
    } });
  } });
}, df = (e) => {
  const n = re(), t = I(() => n().getTriggerProps(), e);
  return createComponent(w.button, t);
}, gf = (e) => {
  const n = re(), t = I(() => n().getValueTextProps(), e);
  return createComponent(w.span, mergeProps(t, { get children() {
    return n().valueAsString || e.placeholder;
  } }));
}, ue = {};
Ze(ue, { ClearTrigger: () => Hg, Content: () => Bg, Context: () => Wg, Control: () => Ug, HiddenSelect: () => jg, Indicator: () => Kg, Item: () => Yg, ItemContext: () => Zg, ItemGroup: () => ef, ItemGroupLabel: () => tf, ItemIndicator: () => nf, ItemText: () => rf, Label: () => of, List: () => sf, Positioner: () => af, Root: () => cf, RootProvider: () => uf, Trigger: () => df, ValueText: () => gf });
function ff() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof self < "u") return self;
  if (typeof global < "u") return global;
}
function Mo(e, n) {
  const t = ff();
  return t ? (t[e] || (t[e] = n()), t[e]) : n();
}
var hf = Mo("__zag__refSet", () => /* @__PURE__ */ new WeakSet());
Mo("__zag__proxyStateMap", () => /* @__PURE__ */ new WeakMap());
function mf(e) {
  return hf.add(e), e;
}
var pf = (e) => mf(new xr(e)), vf = xe("switch").parts("root", "label", "control", "thumb"), bn = vf.build(), X = St({ getRootId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.root) != null ? _b : `switch:${e.id}`;
}, getLabelId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.label) != null ? _b : `switch:${e.id}:label`;
}, getThumbId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.thumb) != null ? _b : `switch:${e.id}:thumb`;
}, getControlId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.control) != null ? _b : `switch:${e.id}:control`;
}, getHiddenInputId: (e) => {
  var _a2, _b;
  return (_b = (_a2 = e.ids) == null ? void 0 : _a2.hiddenInput) != null ? _b : `switch:${e.id}:input`;
}, getRootEl: (e) => X.getById(e, X.getRootId(e)), getHiddenInputEl: (e) => X.getById(e, X.getHiddenInputId(e)) });
function bf(e, n, t) {
  const r = e.context.isDisabled, i = e.context.readOnly, o = e.context.checked, s = !r && e.context.focused, a = !r && e.context.focusVisible, c = { "data-active": x(e.context.active), "data-focus": x(s), "data-focus-visible": x(a), "data-readonly": x(i), "data-hover": x(e.context.hovered), "data-disabled": x(r), "data-state": e.context.checked ? "checked" : "unchecked", "data-invalid": x(e.context.invalid) };
  return { checked: o, disabled: r, focused: s, setChecked(u) {
    n({ type: "CHECKED.SET", checked: u, isTrusted: false });
  }, toggleChecked() {
    n({ type: "CHECKED.TOGGLE", checked: o, isTrusted: false });
  }, getRootProps() {
    return t.label({ ...bn.root.attrs, ...c, dir: e.context.dir, id: X.getRootId(e.context), htmlFor: X.getHiddenInputId(e.context), onPointerMove() {
      r || n({ type: "CONTEXT.SET", context: { hovered: true } });
    }, onPointerLeave() {
      r || n({ type: "CONTEXT.SET", context: { hovered: false } });
    }, onClick(u) {
      if (r) return;
      oe(u) === X.getHiddenInputEl(e.context) && u.stopPropagation();
    } });
  }, getLabelProps() {
    return t.element({ ...bn.label.attrs, ...c, dir: e.context.dir, id: X.getLabelId(e.context) });
  }, getThumbProps() {
    return t.element({ ...bn.thumb.attrs, ...c, dir: e.context.dir, id: X.getThumbId(e.context), "aria-hidden": true });
  }, getControlProps() {
    return t.element({ ...bn.control.attrs, ...c, dir: e.context.dir, id: X.getControlId(e.context), "aria-hidden": true });
  }, getHiddenInputProps() {
    return t.input({ id: X.getHiddenInputId(e.context), type: "checkbox", required: e.context.required, defaultChecked: o, disabled: r, "aria-labelledby": X.getLabelId(e.context), "aria-invalid": e.context.invalid, name: e.context.name, form: e.context.form, value: e.context.value, style: Pr, onFocus() {
      const u = On();
      n({ type: "CONTEXT.SET", context: { focused: true, focusVisible: u } });
    }, onBlur() {
      n({ type: "CONTEXT.SET", context: { focused: false, focusVisible: false } });
    }, onClick(u) {
      if (i) {
        u.preventDefault();
        return;
      }
      const d = u.currentTarget.checked;
      n({ type: "CHECKED.SET", checked: d, isTrusted: true });
    } });
  } };
}
var { not: xi } = Dn;
function yf(e) {
  const n = Ae(e);
  return mt({ id: "switch", initial: "ready", context: { checked: false, label: "switch", value: "on", disabled: false, ...n, fieldsetDisabled: false, focusVisible: false }, computed: { isDisabled: (t) => t.disabled || t.fieldsetDisabled }, watch: { disabled: "removeFocusIfNeeded", checked: "syncInputElement" }, activities: ["trackFormControlState", "trackPressEvent", "trackFocusVisible"], on: { "CHECKED.TOGGLE": [{ guard: xi("isTrusted"), actions: ["toggleChecked", "dispatchChangeEvent"] }, { actions: ["toggleChecked"] }], "CHECKED.SET": [{ guard: xi("isTrusted"), actions: ["setChecked", "dispatchChangeEvent"] }, { actions: ["setChecked"] }], "CONTEXT.SET": { actions: ["setContext"] } }, states: { ready: {} } }, { guards: { isTrusted: (t, r) => !!r.isTrusted }, activities: { trackPressEvent(t) {
    if (!t.isDisabled) return ro({ pointerNode: X.getRootEl(t), keyboardNode: X.getHiddenInputEl(t), isValidKey: (r) => r.key === " ", onPress: () => t.active = false, onPressStart: () => t.active = true, onPressEnd: () => t.active = false });
  }, trackFocusVisible(t) {
    if (!t.isDisabled) return uo({ root: X.getRootNode(t) });
  }, trackFormControlState(t, r, { send: i, initialContext: o }) {
    return Vn(X.getHiddenInputEl(t), { onFieldsetDisabledChange(s) {
      t.fieldsetDisabled = s;
    }, onFormReset() {
      i({ type: "CHECKED.SET", checked: !!o.checked, src: "form-reset" });
    } });
  } }, actions: { setContext(t, r) {
    Object.assign(t, r.context);
  }, syncInputElement(t) {
    const r = X.getHiddenInputEl(t);
    r && (r.checked = !!t.checked);
  }, removeFocusIfNeeded(t) {
    t.disabled && t.focused && (t.focused = false);
  }, setChecked(t, r) {
    wi.checked(t, r.checked);
  }, toggleChecked(t, r) {
    wi.checked(t, !t.checked);
  }, dispatchChangeEvent(t) {
    const r = X.getHiddenInputEl(t);
    Ji(r, { checked: t.checked });
  } } });
}
var Ef = { change: (e) => {
  var _a2;
  (_a2 = e.onCheckedChange) == null ? void 0 : _a2.call(e, { checked: e.checked });
} }, wi = { checked: (e, n) => {
  fe(e.checked, n) || (e.checked = n, Ef.change(e));
} };
Ce()(["checked", "dir", "disabled", "form", "getRootNode", "id", "ids", "invalid", "label", "name", "onCheckedChange", "readOnly", "required", "value"]);
var [_o, tn] = te({ hookName: "useSwitchContext", providerName: "<SwitchProvider />" }), Pf = (e) => e.children(tn()), If = (e) => {
  const n = tn(), t = I(() => n().getControlProps(), e);
  return createComponent(w.span, t);
}, xf = (e) => {
  const n = tn(), t = I(() => n().getHiddenInputProps(), e), r = ne();
  return createComponent(w.input, mergeProps({ get "aria-describedby"() {
    return r == null ? void 0 : r().ariaDescribedby;
  } }, t));
}, wf = (e) => {
  const n = tn(), t = I(() => n().getLabelProps(), e);
  return createComponent(w.span, t);
}, Tf = (e = {}) => {
  const n = Nt(), t = Ot(), r = createUniqueId(), i = ne(), o = createMemo(() => ({ id: r, ids: { label: i == null ? void 0 : i().ids.label, hiddenInput: i == null ? void 0 : i().ids.control }, disabled: i == null ? void 0 : i().disabled, readOnly: i == null ? void 0 : i().readOnly, invalid: i == null ? void 0 : i().invalid, required: i == null ? void 0 : i().required, dir: n().dir, getRootNode: t().getRootNode, checked: e.defaultChecked, ...e })), [s, a] = pt(yf(o()), { context: o });
  return createMemo(() => bf(s, a, Ct));
}, Cf = (e) => {
  const [n, t] = W()(e, ["checked", "defaultChecked", "disabled", "form", "id", "ids", "invalid", "label", "name", "onCheckedChange", "readOnly", "required", "value"]), r = Tf(n), i = I(() => r().getRootProps(), t);
  return createComponent(_o, { value: r, get children() {
    return createComponent(w.label, i);
  } });
}, Sf = (e) => {
  const [{ value: n }, t] = W()(e, ["value"]), r = I(() => n().getRootProps(), t);
  return createComponent(_o, { value: n, get children() {
    return createComponent(w.label, r);
  } });
}, Of = (e) => {
  const n = tn(), t = I(() => n().getThumbProps(), e);
  return createComponent(w.span, t);
}, Gt = {};
Ze(Gt, { Context: () => Pf, Control: () => If, HiddenInput: () => xf, Label: () => wf, Root: () => Cf, RootProvider: () => Sf, Thumb: () => Of });
var Nf = ["<div", ' class="flex"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], Rf = ["<img", ' alt class="max-w-48 max-h-48 rounded-md">'], kf = ["<div", ' class="flex flex-col gap-2"><input type="file"', "", ' class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"><!--$-->', "<!--/--></div>"];
const Af = (e) => createComponent(Switch, { get fallback() {
  return createComponent(Ti, e);
}, get children() {
  return [createComponent(Match, { get when() {
    return e.field.kind === "text";
  }, get children() {
    return createComponent(Ti, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "longText" || e.field.kind === "json";
  }, get children() {
    return createComponent(Lf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "number" || e.field.kind === "currency" || e.field.kind === "percent";
  }, get children() {
    return createComponent($f, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "boolean";
  }, get children() {
    return createComponent(Df, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "enum" || e.field.kind === "status";
  }, get children() {
    return createComponent(Ci, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "relation";
  }, get children() {
    return createComponent(Ci, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "date";
  }, get children() {
    return createComponent(Ff, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "datetime";
  }, get children() {
    return createComponent(Vf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "time";
  }, get children() {
    return createComponent(Mf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "email";
  }, get children() {
    return createComponent(_f, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "url";
  }, get children() {
    return createComponent(Gf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "tel";
  }, get children() {
    return createComponent(Hf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "password";
  }, get children() {
    return createComponent(Bf, e);
  } }), createComponent(Match, { get when() {
    return e.field.kind === "file" || e.field.kind === "image";
  }, get children() {
    return createComponent(Wf, e);
  } })];
} }), Ti = (e) => {
  const n = () => e.field.errors.length > 0;
  return createComponent(q.Root, { get invalid() {
    return n();
  }, get disabled() {
    return e.field.readonly;
  }, get required() {
    return e.field.required;
  }, get children() {
    return createComponent(q.Input, { get value() {
      var _a2;
      return String((_a2 = e.value) != null ? _a2 : "");
    }, get placeholder() {
      return e.field.placeholder;
    }, onInput: (t) => e.onChange(e.field.name, t.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 data-[invalid]:border-red-500" });
  } });
}, Lf = (e) => {
  const n = () => e.field.errors.length > 0;
  return createComponent(q.Root, { get invalid() {
    return n();
  }, get disabled() {
    return e.field.readonly;
  }, get required() {
    return e.field.required;
  }, get children() {
    return createComponent(q.Textarea, { get value() {
      var _a2;
      return String((_a2 = e.value) != null ? _a2 : "");
    }, get placeholder() {
      return e.field.placeholder;
    }, rows: 4, onInput: (t) => e.onChange(e.field.name, t.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 data-[invalid]:border-red-500" });
  } });
}, $f = (e) => createComponent(Pt.Root, { get value() {
  return e.value != null ? String(e.value) : "";
}, onValueChange: (n) => e.onChange(e.field.name, Number.isNaN(n.valueAsNumber) ? void 0 : n.valueAsNumber), get disabled() {
  return e.field.readonly;
}, get min() {
  var _a2;
  return (_a2 = e.field.validation) == null ? void 0 : _a2.min;
}, get max() {
  var _a2;
  return (_a2 = e.field.validation) == null ? void 0 : _a2.max;
}, get children() {
  return ssr(Nf, ssrHydrationKey(), escape(createComponent(Pt.Input, { class: "flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" })), escape(createComponent(Pt.Control, { class: "flex flex-col border border-l-0 border-gray-300 rounded-r-md", get children() {
    return [createComponent(Pt.IncrementTrigger, { class: "px-2 py-1 hover:bg-gray-100 border-b border-gray-300", children: "\u25B2" }), createComponent(Pt.DecrementTrigger, { class: "px-2 py-1 hover:bg-gray-100", children: "\u25BC" })];
  } })));
} }), Df = (e) => createComponent(Gt.Root, { get checked() {
  return !!e.value;
}, onCheckedChange: (n) => e.onChange(e.field.name, n.checked), get disabled() {
  return e.field.readonly;
}, get children() {
  return [createComponent(Gt.Control, { class: "inline-flex items-center w-11 h-6 rounded-full bg-gray-300 data-[state=checked]:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", get children() {
    return createComponent(Gt.Thumb, { class: "w-5 h-5 rounded-full bg-white shadow-sm transform translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" });
  } }), createComponent(Gt.HiddenInput, {})];
} }), Ci = (e) => {
  const n = () => {
    var _a2;
    return pf({ items: (_a2 = e.field.options) != null ? _a2 : [], itemToString: (t) => t.label, itemToValue: (t) => t.value });
  };
  return createComponent(ue.Root, { get collection() {
    return n();
  }, get value() {
    return e.value != null ? [String(e.value)] : [];
  }, onValueChange: (t) => e.onChange(e.field.name, t.value[0]), get disabled() {
    return e.field.readonly;
  }, get children() {
    return [createComponent(ue.Control, { get children() {
      return createComponent(ue.Trigger, { class: "flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed", get children() {
        return [createComponent(ue.ValueText, { get placeholder() {
          var _a2;
          return (_a2 = e.field.placeholder) != null ? _a2 : "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
        } }), createComponent(ue.Indicator, { children: "\u25BC" })];
      } });
    } }), createComponent(Portal, { get children() {
      return createComponent(ue.Positioner, { get children() {
        return createComponent(ue.Content, { class: "bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-60 overflow-auto", get children() {
          return createComponent(ue.ItemGroup, { get children() {
            return createComponent(Index, { get each() {
              return n().items;
            }, children: (t) => createComponent(ue.Item, { get item() {
              return t();
            }, class: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 data-[highlighted]:bg-blue-50", get children() {
              return [createComponent(ue.ItemText, { get children() {
                return t().label;
              } }), createComponent(ue.ItemIndicator, { children: "\u2713" })];
            } }) });
          } });
        } });
      } });
    } }), createComponent(ue.HiddenSelect, {})];
  } });
}, Ff = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "date", get value() {
    return e.value ? String(e.value).split("T")[0] : "";
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Vf = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "datetime-local", get value() {
    return e.value ? String(e.value).slice(0, 16) : "";
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Mf = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "time", get value() {
    var _a2;
    return String((_a2 = e.value) != null ? _a2 : "");
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), _f = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "email", get value() {
    var _a2;
    return String((_a2 = e.value) != null ? _a2 : "");
  }, get placeholder() {
    return e.field.placeholder;
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Gf = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "url", get value() {
    var _a2;
    return String((_a2 = e.value) != null ? _a2 : "");
  }, get placeholder() {
    return e.field.placeholder;
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Hf = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "tel", get value() {
    var _a2;
    return String((_a2 = e.value) != null ? _a2 : "");
  }, get placeholder() {
    return e.field.placeholder;
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Bf = (e) => createComponent(q.Root, { get disabled() {
  return e.field.readonly;
}, get required() {
  return e.field.required;
}, get children() {
  return createComponent(q.Input, { type: "password", get value() {
    var _a2;
    return String((_a2 = e.value) != null ? _a2 : "");
  }, get placeholder() {
    return e.field.placeholder;
  }, onInput: (n) => e.onChange(e.field.name, n.currentTarget.value), class: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" });
} }), Wf = (e) => {
  const n = () => e.field.kind === "image";
  return ssr(kf, ssrHydrationKey(), ssrAttribute("accept", n() ? "image/*" : escape(void 0, true), false), ssrAttribute("disabled", e.field.readonly, true), escape(createComponent(Show, { get when() {
    return n() && e.value && typeof e.value == "string";
  }, get children() {
    return ssr(Rf, ssrHydrationKey() + ssrAttribute("src", escape(e.value, true), false));
  } })));
};
var Uf = ["<span", ' class="text-red-500 ml-1">*</span>'], jf = ["<p", ' class="text-sm text-gray-500">', "</p>"], Kf = ["<div", ' class="flex flex-col gap-1.5"><label', ' class="text-sm font-medium text-gray-700"><!--$-->', "<!--/--><!--$-->", "<!--/--></label><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], qf = ["<p", ' class="text-sm text-red-500">', "</p>"];
const Go = (e) => {
  const n = () => le.hasError(e.vm, e.field.name), t = () => le.fieldErrors(e.vm, e.field.name);
  return ssr(Kf, ssrHydrationKey(), ssrAttribute("for", escape(e.field.name, true), false), escape(e.field.label), escape(createComponent(Show, { get when() {
    return e.field.required;
  }, get children() {
    return ssr(Uf, ssrHydrationKey());
  } })), escape(createComponent(Af, { get field() {
    return e.field;
  }, get value() {
    return e.value;
  }, get onChange() {
    return e.onChange;
  } })), escape(createComponent(Show, { get when() {
    return e.field.hint;
  }, get children() {
    return ssr(jf, ssrHydrationKey(), escape(e.field.hint));
  } })), escape(createComponent(Show, { get when() {
    return n();
  }, get children() {
    return createComponent(For, { get each() {
      return t();
    }, children: (r) => ssr(qf, ssrHydrationKey(), escape(r)) });
  } })));
};
var zf = ["<legend", ' class="px-2 text-lg font-semibold text-gray-800">', "</legend>"], Xf = ["<fieldset", ' class="border border-gray-200 rounded-lg p-4"><!--$-->', '<!--/--><div class="flex flex-col gap-5">', "</div></fieldset>"];
const Yf = (e) => ssr(Xf, ssrHydrationKey(), escape(createComponent(Show, { get when() {
  return e.group;
}, get children() {
  return ssr(zf, ssrHydrationKey(), escape(e.group.label));
} })), escape(createComponent(For, { get each() {
  return e.fields;
}, children: (n) => createComponent(Go, { field: n, get vm() {
  return e.vm;
}, get value() {
  return e.values[n.name];
}, get onChange() {
  return e.onChange;
} }) })));
var Zf = ["<div", ' class="flex gap-2">', "</div>"];
const Jf = (e) => ssr(Zf, ssrHydrationKey(), escape(createComponent(For, { get each() {
  return e.actions;
}, children: (n) => createComponent(Kt, { action: n, get onExecute() {
  return e.onAction;
} }) })));
var Qf = ["<div", ' class="text-center py-8 text-gray-500">\u8AAD\u307F\u8FBC\u307F\u4E2D...</div>'], eh = ["<div", ' class="p-4 bg-red-50 text-red-700 rounded">', "</div>"], th = ["<div", ' class="flex flex-col gap-6">', "</div>"], nh = ["<div", ' class="flex justify-end gap-3"><button type="submit"', ' class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">', "</button></div>"], rh = ["<form", ' class="', '"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">', "</h1><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></form>"], ih = ["<div", ' class="flex flex-col gap-5">', "</div>"];
const Ph = (e) => {
  var _a2;
  const n = () => le.groups(e.vm), t = () => n().length > 0, r = () => le.values(e.vm);
  return ssr(rh, ssrHydrationKey(), `flex flex-col gap-6 ${(_a2 = escape(e.class, true)) != null ? _a2 : ""}`, escape(le.label(e.vm)), escape(createComponent(Show, { get when() {
    return e.onAction;
  }, get children() {
    return createComponent(Jf, { get actions() {
      return le.allowedActions(e.vm);
    }, get onAction() {
      return e.onAction;
    } });
  } })), escape(createComponent(Show, { get when() {
    return le.loading(e.vm);
  }, get children() {
    return ssr(Qf, ssrHydrationKey());
  } })), escape(createComponent(Show, { get when() {
    return le.error(e.vm);
  }, get children() {
    return ssr(eh, ssrHydrationKey(), escape(le.error(e.vm)));
  } })), escape(createComponent(Show, { get when() {
    return !le.loading(e.vm);
  }, get children() {
    return [createComponent(Show, { get when() {
      return t();
    }, get fallback() {
      return ssr(ih, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return le.visibleFields(e.vm);
      }, children: (i) => createComponent(Go, { field: i, get vm() {
        return e.vm;
      }, get value() {
        return r()[i.name];
      }, get onChange() {
        return e.onChange;
      } }) })));
    }, get children() {
      return ssr(th, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return n();
      }, children: (i) => createComponent(Yf, { group: i, get fields() {
        return le.fieldsInGroup(e.vm, i.id);
      }, get vm() {
        return e.vm;
      }, get values() {
        return r();
      }, get onChange() {
        return e.onChange;
      } }) })));
    } }), ssr(nh, ssrHydrationKey(), ssrAttribute("disabled", !le.canSubmit(e.vm), true), le.submitting(e.vm) ? "\u9001\u4FE1\u4E2D..." : "\u4FDD\u5B58")];
  } })));
};
var oh = ["<div", ' class="flex flex-col gap-1"><dt class="text-sm font-medium text-gray-500">', '</dt><dd class="text-base text-gray-900">', "</dd></div>"];
const Ho = (e) => ssr(oh, ssrHydrationKey(), escape(e.field.label), escape(createComponent(ho, { get field() {
  return e.field;
}, get value() {
  return e.value;
} })));
var sh = ["<h3", ' class="text-lg font-semibold text-gray-800 mb-4">', "</h3>"], ah = ["<div", ' class="border border-gray-200 rounded-lg p-4"><!--$-->', '<!--/--><dl class="grid grid-cols-1 md:grid-cols-2 gap-4">', "</dl></div>"];
const lh = (e) => ssr(ah, ssrHydrationKey(), escape(createComponent(Show, { get when() {
  return e.group;
}, get children() {
  return ssr(sh, ssrHydrationKey(), escape(e.group.label));
} })), escape(createComponent(For, { get each() {
  return e.fields;
}, children: (n) => createComponent(Ho, { field: n, get value() {
  return Pe.value(e.vm, n.name);
} }) })));
var ch = ["<div", ' class="flex gap-2">', "</div>"], uh = ["<div", ' class="text-center py-8 text-gray-500">\u8AAD\u307F\u8FBC\u307F\u4E2D...</div>'], dh = ["<div", ' class="p-4 bg-red-50 text-red-700 rounded">', "</div>"], gh = ["<div", ' class="flex flex-col gap-6">', "</div>"], fh = ["<div", ' class="', '"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">', "</h1><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], hh = ["<dl", ' class="grid grid-cols-1 md:grid-cols-2 gap-4">', "</dl>"];
const Ih = (e) => {
  var _a2;
  const n = () => Pe.groups(e.vm), t = () => n().length > 0;
  return ssr(fh, ssrHydrationKey(), `flex flex-col gap-6 ${(_a2 = escape(e.class, true)) != null ? _a2 : ""}`, escape(Pe.label(e.vm)), escape(createComponent(Show, { get when() {
    return e.onAction;
  }, get children() {
    return ssr(ch, ssrHydrationKey(), escape(createComponent(For, { get each() {
      return Pe.allowedActions(e.vm);
    }, children: (r) => createComponent(Kt, { action: r, get onExecute() {
      return e.onAction;
    } }) })));
  } })), escape(createComponent(Show, { get when() {
    return Pe.loading(e.vm);
  }, get children() {
    return ssr(uh, ssrHydrationKey());
  } })), escape(createComponent(Show, { get when() {
    return Pe.error(e.vm);
  }, get children() {
    return ssr(dh, ssrHydrationKey(), escape(Pe.error(e.vm)));
  } })), escape(createComponent(Show, { get when() {
    return !Pe.loading(e.vm);
  }, get children() {
    return createComponent(Show, { get when() {
      return t();
    }, get fallback() {
      return ssr(hh, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return Pe.fields(e.vm);
      }, children: (r) => createComponent(Ho, { field: r, get value() {
        return Pe.value(e.vm, r.name);
      } }) })));
    }, get children() {
      return ssr(gh, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return n();
      }, children: (r) => createComponent(lh, { group: r, get fields() {
        return Pe.fieldsInGroup(e.vm, r.id);
      }, get vm() {
        return e.vm;
      } }) })));
    } });
  } })));
};

export { Eh as E, Ih as I, Ph as P };
//# sourceMappingURL=Show-CkBOW0P5.mjs.map
