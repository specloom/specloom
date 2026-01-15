import { createComponent, ssr, ssrHydrationKey, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { F as Fo } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, untrack, Show, on, createRoot } from 'solid-js';
import { O as Oe, U as Ue, C as Ce, v as ve, D as De, z as ze, a as I$1, e as ee, g as ge, B as Be, Q, q as qe } from './routing-vMheQ2Vk.mjs';
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

const I = (t) => (n) => {
  const { base: a } = n, r = children(() => n.children), e = createMemo(() => Oe(r(), n.base || ""));
  let i;
  const u = Ue(t, e, () => i, { base: a, singleFlight: n.singleFlight, transformUrl: n.transformUrl });
  return t.create && t.create(u), createComponent(Ce.Provider, { value: u, get children() {
    return createComponent(et, { routerState: u, get root() {
      return n.root;
    }, get preload() {
      return n.rootPreload || n.rootLoad;
    }, get children() {
      return [(i = getOwner()) && null, createComponent(nt, { routerState: u, get branches() {
        return e();
      } })];
    } });
  } });
};
function et(t) {
  const n = t.routerState.location, a = t.routerState.params, r = createMemo(() => t.preload && untrack(() => {
    t.preload({ params: a, location: n, intent: De() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (e) => createComponent(e, { params: a, location: n, get data() {
    return r();
  }, get children() {
    return t.children;
  } }) });
}
function nt(t) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      rt(e, t.routerState, t.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = t.routerState.matches().map(({ route: i, path: u, params: m }) => ({ path: i.originalPath, pattern: i.pattern, match: u, params: m, info: i.info }))));
  }
  const n = [];
  let a;
  const r = createMemo(on(t.routerState.matches, (e, i, u) => {
    let m = i && e.length === i.length;
    const h = [];
    for (let l = 0, w = e.length; l < w; l++) {
      const b = i && i[l], g = e[l];
      u && b && g.route.key === b.route.key ? h[l] = u[l] : (m = false, n[l] && n[l](), createRoot((R) => {
        n[l] = R, h[l] = ze(t.routerState, h[l - 1] || t.routerState.base, C(() => r()[l + 1]), () => {
          var _a;
          const p = t.routerState.matches();
          return (_a = p[l]) != null ? _a : p[0];
        });
      }));
    }
    return n.splice(e.length).forEach((l) => l()), u && m ? u : (a = h[0], h);
  }));
  return C(() => r() && a)();
}
const C = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (n) => createComponent(ee.Provider, { value: n, get children() {
  return n.outlet();
} }) });
function rt(t, n, a) {
  const r = new URL(t.request.url), e = I$1(a, new URL(t.router.previousUrl || t.request.url).pathname), i = I$1(a, r.pathname);
  for (let u = 0; u < i.length; u++) {
    (!e[u] || i[u].route !== e[u].route) && (t.router.dataOnly = true);
    const { route: m, params: h } = i[u];
    m.preload && m.preload({ params: h, location: n.location, intent: "preload" });
  }
}
function at([t, n], a, r) {
  return [t, r ? (e) => n(r(e)) : n];
}
function ot(t) {
  let n = false;
  const a = (e) => typeof e == "string" ? { value: e } : e, r = at(createSignal(a(t.get()), { equals: (e, i) => e.value === i.value && e.state === i.state }), void 0, (e) => (!n && t.set(e), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), e));
  return t.init && onCleanup(t.init((e = t.get()) => {
    n = true, r[1](a(e)), n = false;
  })), I({ signal: r, create: t.create, utils: t.utils });
}
function st(t, n, a) {
  return t.addEventListener(n, a), () => t.removeEventListener(n, a);
}
function it(t, n) {
  const a = t && document.getElementById(t);
  a ? a.scrollIntoView() : n && window.scrollTo(0, 0);
}
function ut(t) {
  const n = new URL(t);
  return n.pathname + n.search;
}
function ct(t) {
  let n;
  const a = { value: t.url || (n = getRequestEvent()) && ut(n.request.url) || "" };
  return I({ signal: [() => a, (r) => Object.assign(a, r)] })(t);
}
const lt = /* @__PURE__ */ new Map();
function dt(t = true, n = false, a = "/_server", r) {
  return (e) => {
    const i = e.base.path(), u = e.navigatorFactory(e.base);
    let m, h;
    function l(o) {
      return o.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function w(o) {
      if (o.defaultPrevented || o.button !== 0 || o.metaKey || o.altKey || o.ctrlKey || o.shiftKey) return;
      const s = o.composedPath().find((A) => A instanceof Node && A.nodeName.toUpperCase() === "A");
      if (!s || n && !s.hasAttribute("link")) return;
      const d = l(s), c = d ? s.href.baseVal : s.href;
      if ((d ? s.target.baseVal : s.target) || !c && !s.hasAttribute("state")) return;
      const v = (s.getAttribute("rel") || "").split(/\s+/);
      if (s.hasAttribute("download") || v && v.includes("external")) return;
      const y = d ? new URL(c, document.baseURI) : new URL(c);
      if (!(y.origin !== window.location.origin || i && y.pathname && !y.pathname.toLowerCase().startsWith(i.toLowerCase()))) return [s, y];
    }
    function b(o) {
      const s = w(o);
      if (!s) return;
      const [d, c] = s, E = e.parsePath(c.pathname + c.search + c.hash), v = d.getAttribute("state");
      o.preventDefault(), u(E, { resolve: false, replace: d.hasAttribute("replace"), scroll: !d.hasAttribute("noscroll"), state: v ? JSON.parse(v) : void 0 });
    }
    function g(o) {
      const s = w(o);
      if (!s) return;
      const [d, c] = s;
      r && (c.pathname = r(c.pathname)), e.preloadRoute(c, d.getAttribute("preload") !== "false");
    }
    function R(o) {
      clearTimeout(m);
      const s = w(o);
      if (!s) return h = null;
      const [d, c] = s;
      h !== d && (r && (c.pathname = r(c.pathname)), m = setTimeout(() => {
        e.preloadRoute(c, d.getAttribute("preload") !== "false"), h = d;
      }, 20));
    }
    function p(o) {
      if (o.defaultPrevented) return;
      let s = o.submitter && o.submitter.hasAttribute("formaction") ? o.submitter.getAttribute("formaction") : o.target.getAttribute("action");
      if (!s) return;
      if (!s.startsWith("https://action/")) {
        const c = new URL(s, ve);
        if (s = e.parsePath(c.pathname + c.search), !s.startsWith(a)) return;
      }
      if (o.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const d = lt.get(s);
      if (d) {
        o.preventDefault();
        const c = new FormData(o.target, o.submitter);
        d.call({ r: e, f: o.target }, o.target.enctype === "multipart/form-data" ? c : new URLSearchParams(c));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", b), t && (document.addEventListener("mousemove", R, { passive: true }), document.addEventListener("focusin", g, { passive: true }), document.addEventListener("touchstart", g, { passive: true })), document.addEventListener("submit", p), onCleanup(() => {
      document.removeEventListener("click", b), t && (document.removeEventListener("mousemove", R), document.removeEventListener("focusin", g), document.removeEventListener("touchstart", g)), document.removeEventListener("submit", p);
    });
  };
}
function ht(t) {
  if (isServer) return ct(t);
  const n = () => {
    const r = window.location.pathname.replace(/^\/+/, "/") + window.location.search, e = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: r + window.location.hash, state: e };
  }, a = ge();
  return ot({ get: n, set({ value: r, replace: e, scroll: i, state: u }) {
    e ? window.history.replaceState(Be(u), "", r) : window.history.pushState(u, "", r), it(decodeURIComponent(window.location.hash.slice(1)), i), Q();
  }, init: (r) => st(window, "popstate", qe(r, (e) => {
    if (e) return !a.confirm(e);
    {
      const i = n();
      return !a.confirm(i.value, { state: i.state });
    }
  })), create: dt(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (r) => window.history.go(r), beforeLeave: a } })(t);
}
var mt = ["<div", ' class="p-4">Loading...</div>'];
function yt() {
  return createComponent(ht, { root: (t) => createComponent(Suspense, { get fallback() {
    return ssr(mt, ssrHydrationKey());
  }, get children() {
    return t.children;
  } }), get children() {
    return createComponent(Fo, {});
  } });
}

export { yt as default };
//# sourceMappingURL=app-qbLpREiu.mjs.map
