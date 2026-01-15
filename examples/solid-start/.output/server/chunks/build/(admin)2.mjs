import { createComponent, ssr, ssrHydrationKey, escape } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { M as Me } from '../nitro/nitro.mjs';
import { y } from './components-DZVQsbZn.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';

var m = ["<div", ' class="flex h-screen bg-gray-100"><aside class="', '"><div class="h-16 flex items-center px-4 border-b border-gray-200"><span class="text-xl font-semibold text-gray-900">', '</span></div><nav class="flex-1 py-4">', '</nav><div class="p-4 border-t border-gray-200"><button type="button" class="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">', '</button></div></aside><div class="flex-1 flex flex-col overflow-hidden"><header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"><h1 class="text-lg font-medium text-gray-900">', '</h1><div class="flex items-center gap-4"><span class="text-sm text-gray-500">\u7BA1\u7406\u8005</span><div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">A</div></div></header><main class="flex-1 overflow-auto p-6">', "</main></div></div>"], x = ["<span", ' class="text-lg">', "</span>"], b = ["<span", ">", "</span>"];
const l = [{ href: "/users", label: "\u30E6\u30FC\u30B6\u30FC", icon: "\u{1F464}" }, { href: "/products", label: "\u5546\u54C1", icon: "\u{1F4E6}" }, { href: "/orders", label: "\u6CE8\u6587", icon: "\u{1F6D2}" }, { href: "/posts", label: "\u6295\u7A3F", icon: "\u{1F4DD}" }];
function g(a) {
  var _a, _b;
  const [t, u] = createSignal(true), d = Me(), o = (e) => d.pathname.startsWith(e);
  return ssr(m, ssrHydrationKey(), `${t() ? "w-64" : "w-16"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`, t() ? "Specloom Admin" : "S", escape(l.map((e) => createComponent(y, { get href() {
    return e.href;
  }, get class() {
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${o(e.href) ? "text-primary-600 bg-primary-50 border-r-2 border-primary-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`;
  }, get children() {
    return [ssr(x, ssrHydrationKey(), escape(e.icon)), t() && ssr(b, ssrHydrationKey(), escape(e.label))];
  } }))), t() ? "\u25C0" : "\u25B6", (_b = escape((_a = l.find((e) => o(e.href))) == null ? void 0 : _a.label)) != null ? _b : "Dashboard", escape(a.children));
}
function A(a) {
  return createComponent(g, { get children() {
    return a.children;
  } });
}

export { A as default };
//# sourceMappingURL=(admin)2.mjs.map
