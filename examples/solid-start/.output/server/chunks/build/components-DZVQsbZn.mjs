import { ssrElement, mergeProps as mergeProps$1 } from 'solid-js/web';
import { mergeProps, splitProps, createMemo } from 'solid-js';
import { I as Ie, M as Me, W as We, $ as $e, E } from '../nitro/nitro.mjs';

function y(t) {
  t = mergeProps({ inactiveClass: "inactive", activeClass: "active" }, t);
  const [, e] = splitProps(t, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), n = We(() => t.href), s = $e(n), c = Me(), a = createMemo(() => {
    const o = n();
    if (o === void 0) return [false, false];
    const r = E(o.split(/[?#]/, 1)[0]).toLowerCase(), i = decodeURI(E(c.pathname).toLowerCase());
    return [t.end ? r === i : i.startsWith(r + "/") || i === r, r === i];
  });
  return ssrElement("a", mergeProps$1(e, { get href() {
    return s() || t.href;
  }, get state() {
    return JSON.stringify(t.state);
  }, get classList() {
    return { ...t.class && { [t.class]: true }, [t.inactiveClass]: !a()[0], [t.activeClass]: a()[0], ...e.classList };
  }, link: true, get "aria-current"() {
    return a()[1] ? "page" : void 0;
  } }), void 0, true);
}
function A(t) {
  const e = Ie(), n = Me(), { href: s, state: c } = t, a = typeof s == "function" ? s({ navigate: e, location: n }) : s;
  return e(a, { replace: true, state: c }), null;
}

export { A, y };
//# sourceMappingURL=components-DZVQsbZn.mjs.map
