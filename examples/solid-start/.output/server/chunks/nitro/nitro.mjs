import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { sharedConfig, lazy, createComponent, useContext, createContext as createContext$1, createMemo, createSignal, createRenderEffect, on as on$2, runWithOwner, getOwner, startTransition, resetErrorBoundaries, batch, untrack, catchError, ErrorBoundary, Suspense, onCleanup, children, Show, createRoot } from 'solid-js';
import { renderToString, getRequestEvent, isServer, ssrElement, escape, mergeProps, ssr, renderToStream, createComponent as createComponent$1, ssrHydrationKey, NoHydration, useAssets, Hydration, ssrAttribute, HydrationScript, delegateEvents } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m$1(e._destroy,t._destroy);}};function _$2(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m$1(...n){return function(...e){for(const t of n)t(...e);}}const g$1=_$2();let A$2 = class A extends g$1{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$2 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}};function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$2=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E$2,t=Array.isArray(n)||H$2(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$2(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$1=new Set([101,204,205,304]);async function b$1(n,e){const t=new y$2,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$1.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$2=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$2;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s$1="base64url";function digest(t){if(e)return e(r,t,s$1);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s$1):o.digest(s$1)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/Volumes/SSD/projects/specloom/examples/solid-start","order":0,"outDir":"/Volumes/SSD/projects/specloom/examples/solid-start/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/Volumes/SSD/projects/specloom/examples/solid-start","base":"/","outDir":"/Volumes/SSD/projects/specloom/examples/solid-start/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/Volumes/SSD/projects/specloom/examples/solid-start","outDir":"/Volumes/SSD/projects/specloom/examples/solid-start/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"../../node_modules/.pnpm/@solidjs+start@1.2.1_solid-js@1.9.10_vinxi@0.5.10_db0@0.3.4_ioredis@5.9.1_jiti@2.6.1_lightnin_syq3dpdxl533scsry2gvxmymmu/node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/Volumes/SSD/projects/specloom/examples/solid-start","outDir":"/Volumes/SSD/projects/specloom/examples/solid-start/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"preset":"node-server"},"root":"/Volumes/SSD/projects/specloom/examples/solid-start"};
					const buildManifest = {"ssr":{"_Show-CkBOW0P5.js":{"file":"assets/Show-CkBOW0P5.js","name":"Show"},"_components-DZVQsbZn.js":{"file":"assets/components-DZVQsbZn.js","name":"components","imports":["_routing-mea0BGAx.js"]},"_routing-mea0BGAx.js":{"file":"assets/routing-mea0BGAx.js","name":"routing"},"src/routes/(admin).tsx?pick=default&pick=$css":{"file":"(admin).js","name":"(admin)","src":"src/routes/(admin).tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-mea0BGAx.js","_components-DZVQsbZn.js"]},"src/routes/(admin)/orders.tsx?pick=default&pick=$css":{"file":"orders.js","name":"orders","src":"src/routes/(admin)/orders.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/posts.tsx?pick=default&pick=$css":{"file":"posts.js","name":"posts","src":"src/routes/(admin)/posts.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/products.tsx?pick=default&pick=$css":{"file":"products.js","name":"products","src":"src/routes/(admin)/products.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/users.tsx?pick=default&pick=$css":{"file":"users.js","name":"users","src":"src/routes/(admin)/users.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-DZVQsbZn.js","_routing-mea0BGAx.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_routing-mea0BGAx.js"],"dynamicImports":["src/routes/(admin)/orders.tsx?pick=default&pick=$css","src/routes/(admin)/orders.tsx?pick=default&pick=$css","src/routes/(admin)/posts.tsx?pick=default&pick=$css","src/routes/(admin)/posts.tsx?pick=default&pick=$css","src/routes/(admin)/products.tsx?pick=default&pick=$css","src/routes/(admin)/products.tsx?pick=default&pick=$css","src/routes/(admin)/users.tsx?pick=default&pick=$css","src/routes/(admin)/users.tsx?pick=default&pick=$css","src/routes/(admin).tsx?pick=default&pick=$css","src/routes/(admin).tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css"],"css":["assets/ssr-DW7bX1Hh.css"]}},"client":{"_Show-DwiAvwvW.js":{"file":"assets/Show-DwiAvwvW.js","name":"Show","imports":["_web-CDnJDCoD.js"]},"_components-ZLuT0TFJ.js":{"file":"assets/components-ZLuT0TFJ.js","name":"components","imports":["_web-CDnJDCoD.js","_routing-Cg4lE7ro.js"]},"_routing-Cg4lE7ro.js":{"file":"assets/routing-Cg4lE7ro.js","name":"routing","imports":["_web-CDnJDCoD.js"]},"_web-CDnJDCoD.js":{"file":"assets/web-CDnJDCoD.js","name":"web"},"src/routes/(admin).tsx?pick=default&pick=$css":{"file":"assets/(admin)-D9WinMCw.js","name":"(admin)","src":"src/routes/(admin).tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_routing-Cg4lE7ro.js","_components-ZLuT0TFJ.js"]},"src/routes/(admin)/orders.tsx?pick=default&pick=$css":{"file":"assets/orders-BJngRjeG.js","name":"orders","src":"src/routes/(admin)/orders.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_Show-DwiAvwvW.js"]},"src/routes/(admin)/posts.tsx?pick=default&pick=$css":{"file":"assets/posts-DA3TeapH.js","name":"posts","src":"src/routes/(admin)/posts.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_Show-DwiAvwvW.js"]},"src/routes/(admin)/products.tsx?pick=default&pick=$css":{"file":"assets/products-CedXrfNq.js","name":"products","src":"src/routes/(admin)/products.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_Show-DwiAvwvW.js"]},"src/routes/(admin)/users.tsx?pick=default&pick=$css":{"file":"assets/users-BgYSQZoA.js","name":"users","src":"src/routes/(admin)/users.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_Show-DwiAvwvW.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-C9snL7LH.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_web-CDnJDCoD.js","_components-ZLuT0TFJ.js","_routing-Cg4lE7ro.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-DfKHps_-.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_web-CDnJDCoD.js","_routing-Cg4lE7ro.js"],"dynamicImports":["src/routes/(admin)/orders.tsx?pick=default&pick=$css","src/routes/(admin)/posts.tsx?pick=default&pick=$css","src/routes/(admin)/products.tsx?pick=default&pick=$css","src/routes/(admin)/users.tsx?pick=default&pick=$css","src/routes/(admin).tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css"],"css":["assets/client-DUogfIl5.css"]}},"server-fns":{"_Show-CkBOW0P5.js":{"file":"assets/Show-CkBOW0P5.js","name":"Show"},"_components-DCP2DDCJ.js":{"file":"assets/components-DCP2DDCJ.js","name":"components","imports":["_routing-vMheQ2Vk.js"]},"_routing-vMheQ2Vk.js":{"file":"assets/routing-vMheQ2Vk.js","name":"routing"},"_server-fns-BEqAC-Go.js":{"file":"assets/server-fns-BEqAC-Go.js","name":"server-fns","dynamicImports":["src/routes/(admin)/orders.tsx?pick=default&pick=$css","src/routes/(admin)/orders.tsx?pick=default&pick=$css","src/routes/(admin)/posts.tsx?pick=default&pick=$css","src/routes/(admin)/posts.tsx?pick=default&pick=$css","src/routes/(admin)/products.tsx?pick=default&pick=$css","src/routes/(admin)/products.tsx?pick=default&pick=$css","src/routes/(admin)/users.tsx?pick=default&pick=$css","src/routes/(admin)/users.tsx?pick=default&pick=$css","src/routes/(admin).tsx?pick=default&pick=$css","src/routes/(admin).tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/app.tsx"]},"src/app.tsx":{"file":"assets/app-qbLpREiu.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_server-fns-BEqAC-Go.js","_routing-vMheQ2Vk.js"],"css":["assets/app-DUogfIl5.css"]},"src/routes/(admin).tsx?pick=default&pick=$css":{"file":"(admin).js","name":"(admin)","src":"src/routes/(admin).tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-vMheQ2Vk.js","_components-DCP2DDCJ.js"]},"src/routes/(admin)/orders.tsx?pick=default&pick=$css":{"file":"orders.js","name":"orders","src":"src/routes/(admin)/orders.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/posts.tsx?pick=default&pick=$css":{"file":"posts.js","name":"posts","src":"src/routes/(admin)/posts.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/products.tsx?pick=default&pick=$css":{"file":"products.js","name":"products","src":"src/routes/(admin)/products.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/(admin)/users.tsx?pick=default&pick=$css":{"file":"users.js","name":"users","src":"src/routes/(admin)/users.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_Show-CkBOW0P5.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_components-DCP2DDCJ.js","_routing-vMheQ2Vk.js"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-BEqAC-Go.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/assets/ssr-DW7bX1Hh.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"2b4e-0Pm55PkBz0+gHLIEoDkDEJIa6wc\"",
    "mtime": "2026-01-15T13:07:34.705Z",
    "size": 11086,
    "path": "../public/assets/ssr-DW7bX1Hh.css"
  },
  "/assets/ssr-DW7bX1Hh.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"a13-g1aGT0WdDr5VRXSxHPFEGs5QEKk\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 2579,
    "path": "../public/assets/ssr-DW7bX1Hh.css.br"
  },
  "/assets/ssr-DW7bX1Hh.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"bab-Zd4JmxP4ivSlfG/yGqHfjy0+FFw\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 2987,
    "path": "../public/assets/ssr-DW7bX1Hh.css.gz"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"c7e-g/dFOs6LhA2FHvSesbD4I/U7c+I\"",
    "mtime": "2026-01-15T13:07:34.707Z",
    "size": 3198,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"1d6-oEhwqa4qL/CAOGvs8QiMpN32/j0\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 470,
    "path": "../public/_build/.vite/manifest.json.br"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"21f-bXP/UkM28HpxkR/eRTHxPkuyavc\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 543,
    "path": "../public/_build/.vite/manifest.json.gz"
  },
  "/_server/assets/app-DUogfIl5.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"4fd3-Ek8OtjS9qQoXfTzvNfCxRRei3LQ\"",
    "mtime": "2026-01-15T13:07:34.707Z",
    "size": 20435,
    "path": "../public/_server/assets/app-DUogfIl5.css"
  },
  "/_server/assets/app-DUogfIl5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"f8a-vrFyamxborn79qAD3QF4rx8DR2g\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 3978,
    "path": "../public/_server/assets/app-DUogfIl5.css.br"
  },
  "/_build/assets/(admin)-D9WinMCw.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"8f8-Hh3wOTM4t1HNo+GuF/AY9NVaD3Q\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 2296,
    "path": "../public/_build/assets/(admin)-D9WinMCw.js"
  },
  "/_build/assets/(admin)-D9WinMCw.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3b0-THdHiZ+D68zwUHP13AO6Q+0x65o\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 944,
    "path": "../public/_build/assets/(admin)-D9WinMCw.js.br"
  },
  "/_server/assets/app-DUogfIl5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"120c-neM1Zr45JNo43WH+npC7TIe61+k\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 4620,
    "path": "../public/_server/assets/app-DUogfIl5.css.gz"
  },
  "/_build/assets/(admin)-D9WinMCw.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"461-wx3wUZYJDsnaZowmT8TDhSxGCVU\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 1121,
    "path": "../public/_build/assets/(admin)-D9WinMCw.js.gz"
  },
  "/_build/assets/Show-DwiAvwvW.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"cb85-pzleqQoqMh8Ll1do6e6CzVysP4Q\"",
    "mtime": "2026-01-15T13:07:34.904Z",
    "size": 52101,
    "path": "../public/_build/assets/Show-DwiAvwvW.js.br"
  },
  "/_build/assets/Show-DwiAvwvW.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"328e9-H9cSU4p1535ZwkUnNFjSe+LWOF4\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 207081,
    "path": "../public/_build/assets/Show-DwiAvwvW.js"
  },
  "/_build/assets/Show-DwiAvwvW.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"f1b6-BgkcsDulDCCVckYlcME7EOQRi9o\"",
    "mtime": "2026-01-15T13:07:34.736Z",
    "size": 61878,
    "path": "../public/_build/assets/Show-DwiAvwvW.js.gz"
  },
  "/_build/assets/client-DUogfIl5.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"4fd3-Ek8OtjS9qQoXfTzvNfCxRRei3LQ\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 20435,
    "path": "../public/_build/assets/client-DUogfIl5.css"
  },
  "/_build/assets/client-DfKHps_-.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"407d-23rgvHqonYzaF8u79XrhSBq0lX4\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 16509,
    "path": "../public/_build/assets/client-DfKHps_-.js"
  },
  "/_build/assets/client-DUogfIl5.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"120c-neM1Zr45JNo43WH+npC7TIe61+k\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 4620,
    "path": "../public/_build/assets/client-DUogfIl5.css.gz"
  },
  "/_build/assets/client-DUogfIl5.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"f8a-vrFyamxborn79qAD3QF4rx8DR2g\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 3978,
    "path": "../public/_build/assets/client-DUogfIl5.css.br"
  },
  "/_build/assets/client-DfKHps_-.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1614-sXeMXNmaY7tdHnCcG5mGaT/mNrE\"",
    "mtime": "2026-01-15T13:07:34.732Z",
    "size": 5652,
    "path": "../public/_build/assets/client-DfKHps_-.js.br"
  },
  "/_build/assets/client-DfKHps_-.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"18b0-zWarrndclp3ijIlQh/F0XOG4200\"",
    "mtime": "2026-01-15T13:07:34.731Z",
    "size": 6320,
    "path": "../public/_build/assets/client-DfKHps_-.js.gz"
  },
  "/_build/assets/components-ZLuT0TFJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3e8-9li0ypkx8fqLpEvwszVE9sWTC7w\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 1000,
    "path": "../public/_build/assets/components-ZLuT0TFJ.js"
  },
  "/_build/assets/index-C9snL7LH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b0-FZnhYNvGgB1W1wE+VDG64+5VeyM\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 176,
    "path": "../public/_build/assets/index-C9snL7LH.js"
  },
  "/_build/assets/orders-BJngRjeG.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1376-MMLIwHHBCR2AR+vnWC27BO65Yho\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 4982,
    "path": "../public/_build/assets/orders-BJngRjeG.js"
  },
  "/_build/assets/orders-BJngRjeG.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6b6-1X8kcU2T2OoU53RP6zwem6QUG4c\"",
    "mtime": "2026-01-15T13:07:34.765Z",
    "size": 1718,
    "path": "../public/_build/assets/orders-BJngRjeG.js.br"
  },
  "/_build/assets/orders-BJngRjeG.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"81c-2dfjS/MRe5RIxMCbogSRlMu4sZY\"",
    "mtime": "2026-01-15T13:07:34.732Z",
    "size": 2076,
    "path": "../public/_build/assets/orders-BJngRjeG.js.gz"
  },
  "/_build/assets/posts-DA3TeapH.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"161e-5v3FhL1A0L1TMAlBf/EFONHqwAY\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 5662,
    "path": "../public/_build/assets/posts-DA3TeapH.js"
  },
  "/_build/assets/posts-DA3TeapH.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"782-mV6iQXfSfcq4DU8M/JJAzdODnaY\"",
    "mtime": "2026-01-15T13:07:34.779Z",
    "size": 1922,
    "path": "../public/_build/assets/posts-DA3TeapH.js.br"
  },
  "/_build/assets/posts-DA3TeapH.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"929-uQNxZrly33aHeAWtyY84+Wd08Fw\"",
    "mtime": "2026-01-15T13:07:34.765Z",
    "size": 2345,
    "path": "../public/_build/assets/posts-DA3TeapH.js.gz"
  },
  "/_build/assets/products-CedXrfNq.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"17c9-04v37s9XnE6MG7SrKvq3tAgzrzA\"",
    "mtime": "2026-01-15T13:07:34.706Z",
    "size": 6089,
    "path": "../public/_build/assets/products-CedXrfNq.js"
  },
  "/_build/assets/products-CedXrfNq.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"774-D1RaRMdIHvFdd5Zq50ifIrKqKBs\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 1908,
    "path": "../public/_build/assets/products-CedXrfNq.js.br"
  },
  "/_build/assets/products-CedXrfNq.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8ff-vYxqDD3Uk7NehpgQfRlUmxvVFt8\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 2303,
    "path": "../public/_build/assets/products-CedXrfNq.js.gz"
  },
  "/_build/assets/routing-Cg4lE7ro.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1d1c-DXDfcsC/s75Wny/MEELlyIxy5T4\"",
    "mtime": "2026-01-15T13:07:34.707Z",
    "size": 7452,
    "path": "../public/_build/assets/routing-Cg4lE7ro.js"
  },
  "/_build/assets/routing-Cg4lE7ro.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"c79-c/Y8Kh1PbOUHz1d/Hz7OCkmq7mM\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 3193,
    "path": "../public/_build/assets/routing-Cg4lE7ro.js.br"
  },
  "/_build/assets/routing-Cg4lE7ro.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"da8-qWX+7T+wwNZIlCOohy8zPxxK0eU\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 3496,
    "path": "../public/_build/assets/routing-Cg4lE7ro.js.gz"
  },
  "/_build/assets/users-BgYSQZoA.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"14ad-17ELB51LxgMkkREBCLvGXeu4Fwc\"",
    "mtime": "2026-01-15T13:07:34.707Z",
    "size": 5293,
    "path": "../public/_build/assets/users-BgYSQZoA.js"
  },
  "/_build/assets/users-BgYSQZoA.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6e5-J5s7YLSJj06OMhzxjW51L6r9nK0\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 1765,
    "path": "../public/_build/assets/users-BgYSQZoA.js.br"
  },
  "/_build/assets/users-BgYSQZoA.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"836-093gxnAbiXKTuKKruhxJQjQzep4\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 2102,
    "path": "../public/_build/assets/users-BgYSQZoA.js.gz"
  },
  "/_build/assets/web-CDnJDCoD.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"748c-5hCkZNdqmDcok4+eQ1CG9NEkVTc\"",
    "mtime": "2026-01-15T13:07:34.707Z",
    "size": 29836,
    "path": "../public/_build/assets/web-CDnJDCoD.js"
  },
  "/_build/assets/web-CDnJDCoD.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"289a-Fm6H43EMeoTk6MMdzq1ZVb44/w0\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 10394,
    "path": "../public/_build/assets/web-CDnJDCoD.js.br"
  },
  "/_build/assets/web-CDnJDCoD.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2cc2-bnYVxMjSHGfLyu6i3Gm3wuN67/8\"",
    "mtime": "2026-01-15T13:07:34.780Z",
    "size": 11458,
    "path": "../public/_build/assets/web-CDnJDCoD.js.gz"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _larMjZ = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function qr(e, t) {
  const r = (e || "").split(";").filter((c) => typeof c == "string" && !!c.trim()), n = r.shift() || "", a = Mr(n), i = a.name;
  let o = a.value;
  try {
    o = (t == null ? void 0 : t.decode) === false ? o : ((t == null ? void 0 : t.decode) || decodeURIComponent)(o);
  } catch {
  }
  const u = { name: i, value: o };
  for (const c of r) {
    const l = c.split("="), p = (l.shift() || "").trimStart().toLowerCase(), d = l.join("=");
    switch (p) {
      case "expires": {
        u.expires = new Date(d);
        break;
      }
      case "max-age": {
        u.maxAge = Number.parseInt(d, 10);
        break;
      }
      case "secure": {
        u.secure = true;
        break;
      }
      case "httponly": {
        u.httpOnly = true;
        break;
      }
      case "samesite": {
        u.sameSite = d;
        break;
      }
      default:
        u[p] = d;
    }
  }
  return u;
}
function Mr(e) {
  let t = "", r = "";
  const n = e.split("=");
  return n.length > 1 ? (t = n.shift(), r = n.join("=")) : r = e, { name: t, value: r };
}
var Br = ((e) => (e[e.AggregateError = 1] = "AggregateError", e[e.ArrowFunction = 2] = "ArrowFunction", e[e.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", e[e.ObjectAssign = 8] = "ObjectAssign", e[e.BigIntTypedArray = 16] = "BigIntTypedArray", e[e.RegExp = 32] = "RegExp", e))(Br || {}), k = Symbol.asyncIterator, yt$1 = Symbol.hasInstance, U = Symbol.isConcatSpreadable, A$1 = Symbol.iterator, bt$1 = Symbol.match, wt$1 = Symbol.matchAll, vt$1 = Symbol.replace, St$1 = Symbol.search, Rt$1 = Symbol.species, Et$1 = Symbol.split, xt$1 = Symbol.toPrimitive, H$1 = Symbol.toStringTag, kt$1 = Symbol.unscopables, Vr = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, At$1 = { [k]: 0, [yt$1]: 1, [U]: 2, [A$1]: 3, [bt$1]: 4, [wt$1]: 5, [vt$1]: 6, [St$1]: 7, [Rt$1]: 8, [Et$1]: 9, [xt$1]: 10, [H$1]: 11, [kt$1]: 12 }, Wr = { 0: k, 1: yt$1, 2: U, 3: A$1, 4: bt$1, 5: wt$1, 6: vt$1, 7: St$1, 8: Rt$1, 9: Et$1, 10: xt$1, 11: H$1, 12: kt$1 }, Xr = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, s = void 0, Gr = { 2: true, 3: false, 1: s, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN }, $t$1 = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, Yr = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function m(e, t, r, n, a, i, o, u, c, l, p, d) {
  return { t: e, i: t, s: r, c: n, m: a, p: i, e: o, a: u, f: c, b: l, o: p, l: d };
}
function z$1(e) {
  return m(2, s, e, s, s, s, s, s, s, s, s, s);
}
var _t$1 = z$1(2), zt$1 = z$1(3), Jr = z$1(1), Kr = z$1(0), Zr = z$1(4), Qr = z$1(5), en$1 = z$1(6), tn$1 = z$1(7);
function rn$1(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return s;
  }
}
function x(e) {
  let t = "", r = 0, n;
  for (let a = 0, i = e.length; a < i; a++) n = rn$1(e[a]), n && (t += e.slice(r, a) + n, r = a + 1);
  return r === 0 ? t = e : t += e.slice(r), t;
}
function nn$1(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function O$1(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, nn$1);
}
var V$2 = "__SEROVAL_REFS__", ie$1 = "$R", ne = `self.${ie$1}`;
function sn$1(e) {
  return e == null ? `${ne}=${ne}||[]` : `(${ne}=${ne}||{})["${x(e)}"]=[]`;
}
var Ct$1 = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
function Pt$1(e) {
  return Ct$1.has(e);
}
function an$1(e) {
  return F.has(e);
}
function on$1(e) {
  if (Pt$1(e)) return Ct$1.get(e);
  throw new Nn(e);
}
function un$1(e) {
  if (an$1(e)) return F.get(e);
  throw new Ln(e);
}
typeof globalThis < "u" ? Object.defineProperty(globalThis, V$2, { value: F, configurable: true, writable: false, enumerable: false }) : typeof self < "u" ? Object.defineProperty(self, V$2, { value: F, configurable: true, writable: false, enumerable: false }) : typeof global < "u" && Object.defineProperty(global, V$2, { value: F, configurable: true, writable: false, enumerable: false });
function Te(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function cn$1(e) {
  let t = $t$1[Te(e)];
  return e.name !== t ? { name: e.name } : e.constructor.name !== t ? { name: e.constructor.name } : {};
}
function It(e, t) {
  let r = cn$1(e), n = Object.getOwnPropertyNames(e);
  for (let a = 0, i = n.length, o; a < i; a++) o = n[a], o !== "name" && o !== "message" && (o === "stack" ? t & 4 && (r = r || {}, r[o] = e[o]) : (r = r || {}, r[o] = e[o]));
  return r;
}
function Tt$1(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function ln$1(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return Qr;
    case Number.NEGATIVE_INFINITY:
      return en$1;
  }
  return e !== e ? tn$1 : Object.is(e, -0) ? Zr : m(0, s, e, s, s, s, s, s, s, s, s, s);
}
function Ot$1(e) {
  return m(1, s, x(e), s, s, s, s, s, s, s, s, s);
}
function fn$1(e) {
  return m(3, s, "" + e, s, s, s, s, s, s, s, s, s);
}
function pn$1(e) {
  return m(4, e, s, s, s, s, s, s, s, s, s, s);
}
function dn$1(e, t) {
  let r = t.valueOf();
  return m(5, e, r !== r ? "" : t.toISOString(), s, s, s, s, s, s, s, s, s);
}
function hn$1(e, t) {
  return m(6, e, s, x(t.source), t.flags, s, s, s, s, s, s, s);
}
function mn$1(e, t) {
  return m(17, e, At$1[t], s, s, s, s, s, s, s, s, s);
}
function gn$1(e, t) {
  return m(18, e, x(on$1(t)), s, s, s, s, s, s, s, s, s);
}
function Nt$1(e, t, r) {
  return m(25, e, r, x(t), s, s, s, s, s, s, s, s);
}
function yn$1(e, t, r) {
  return m(9, e, s, s, s, s, s, r, s, s, Tt$1(t), s);
}
function bn(e, t) {
  return m(21, e, s, s, s, s, s, s, t, s, s, s);
}
function wn$1(e, t, r) {
  return m(15, e, s, t.constructor.name, s, s, s, s, r, t.byteOffset, s, t.length);
}
function vn(e, t, r) {
  return m(16, e, s, t.constructor.name, s, s, s, s, r, t.byteOffset, s, t.byteLength);
}
function Sn(e, t, r) {
  return m(20, e, s, s, s, s, s, s, r, t.byteOffset, s, t.byteLength);
}
function Rn(e, t, r) {
  return m(13, e, Te(t), s, x(t.message), r, s, s, s, s, s, s);
}
function En(e, t, r) {
  return m(14, e, Te(t), s, x(t.message), r, s, s, s, s, s, s);
}
function xn(e, t) {
  return m(7, e, s, s, s, s, s, t, s, s, s, s);
}
function kn(e, t) {
  return m(28, s, s, s, s, s, s, [e, t], s, s, s, s);
}
function An$1(e, t) {
  return m(30, s, s, s, s, s, s, [e, t], s, s, s, s);
}
function $n(e, t, r) {
  return m(31, e, s, s, s, s, s, r, t, s, s, s);
}
function _n(e, t) {
  return m(32, e, s, s, s, s, s, s, t, s, s, s);
}
function zn(e, t) {
  return m(33, e, s, s, s, s, s, s, t, s, s, s);
}
function Cn(e, t) {
  return m(34, e, s, s, s, s, s, s, t, s, s, s);
}
var Pn = { parsing: 1, serialization: 2, deserialization: 3 };
function In(e) {
  return `Seroval Error (step: ${Pn[e]})`;
}
var Tn = (e, t) => In(e), Lt$1 = class Lt extends Error {
  constructor(e, t) {
    super(Tn(e)), this.cause = t;
  }
}, Be$1 = class Be extends Lt$1 {
  constructor(e) {
    super("parsing", e);
  }
}, On = class extends Lt$1 {
  constructor(e) {
    super("deserialization", e);
  }
};
function $$1(e) {
  return `Seroval Error (specific: ${e})`;
}
var ce$1 = class ce extends Error {
  constructor(e) {
    super($$1(1)), this.value = e;
  }
}, N$1 = class N extends Error {
  constructor(e) {
    super($$1(2));
  }
}, jt$1 = class jt extends Error {
  constructor(e) {
    super($$1(3));
  }
}, Q$2 = class Q extends Error {
  constructor(e) {
    super($$1(4));
  }
}, Nn = class extends Error {
  constructor(e) {
    super($$1(5)), this.value = e;
  }
}, Ln = class extends Error {
  constructor(e) {
    super($$1(6));
  }
}, jn = class extends Error {
  constructor(e) {
    super($$1(7));
  }
}, C = class extends Error {
  constructor(t) {
    super($$1(8));
  }
}, Ft$1 = class Ft extends Error {
  constructor(t) {
    super($$1(9));
  }
}, Fn = class {
  constructor(t, r) {
    this.value = t, this.replacement = r;
  }
}, le$1 = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((t, r) => {
    e.s = t, e.f = r;
  }), e;
}, Un = (e, t) => {
  e.s(t), e.p.s = 1, e.p.v = t;
}, Hn = (e, t) => {
  e.f(t), e.p.s = 2, e.p.v = t;
}, Dn = le$1.toString(), qn = Un.toString(), Mn = Hn.toString(), Ut$1 = () => {
  let e = [], t = [], r = true, n = false, a = 0, i = (c, l, p) => {
    for (p = 0; p < a; p++) t[p] && t[p][l](c);
  }, o = (c, l, p, d) => {
    for (l = 0, p = e.length; l < p; l++) d = e[l], !r && l === p - 1 ? c[n ? "return" : "throw"](d) : c.next(d);
  }, u = (c, l) => (r && (l = a++, t[l] = c), o(c), () => {
    r && (t[l] = t[a], t[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (c) => u(c), next: (c) => {
    r && (e.push(c), i(c, "next"));
  }, throw: (c) => {
    r && (e.push(c), i(c, "throw"), r = false, n = false, t.length = 0);
  }, return: (c) => {
    r && (e.push(c), i(c, "return"), r = false, n = true, t.length = 0);
  } };
}, Bn = Ut$1.toString(), Ht$1 = (e) => (t) => () => {
  let r = 0, n = { [e]: () => n, next: () => {
    if (r > t.d) return { done: true, value: void 0 };
    let a = r++, i = t.v[a];
    if (a === t.t) throw i;
    return { done: a === t.d, value: i };
  } };
  return n;
}, Vn = Ht$1.toString(), Dt$1 = (e, t) => (r) => () => {
  let n = 0, a = -1, i = false, o = [], u = [], c = (p = 0, d = u.length) => {
    for (; p < d; p++) u[p].s({ done: true, value: void 0 });
  };
  r.on({ next: (p) => {
    let d = u.shift();
    d && d.s({ done: false, value: p }), o.push(p);
  }, throw: (p) => {
    let d = u.shift();
    d && d.f(p), c(), a = o.length, i = true, o.push(p);
  }, return: (p) => {
    let d = u.shift();
    d && d.s({ done: true, value: p }), c(), a = o.length, o.push(p);
  } });
  let l = { [e]: () => l, next: () => {
    if (a === -1) {
      let v = n++;
      if (v >= o.length) {
        let f = t();
        return u.push(f), f.p;
      }
      return { done: false, value: o[v] };
    }
    if (n > a) return { done: true, value: void 0 };
    let p = n++, d = o[p];
    if (p !== a) return { done: false, value: d };
    if (i) throw d;
    return { done: true, value: d };
  } };
  return l;
}, Wn = Dt$1.toString(), qt$1 = (e) => {
  let t = atob(e), r = t.length, n = new Uint8Array(r);
  for (let a = 0; a < r; a++) n[a] = t.charCodeAt(a);
  return n.buffer;
}, Xn = qt$1.toString(), Gn = {}, Yn = {}, Jn = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, Kn = { 0: "[]", 1: Dn, 2: qn, 3: Mn, 4: Bn, 5: Xn };
function fe(e) {
  return "__SEROVAL_STREAM__" in e;
}
function ee$2() {
  return Ut$1();
}
function Zn(e) {
  let t = ee$2(), r = e[k]();
  async function n() {
    try {
      let a = await r.next();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
var Qn = Dt$1(k, le$1);
function es(e) {
  return Qn(e);
}
function ts(e) {
  let t = [], r = -1, n = -1, a = e[A$1]();
  for (; ; ) try {
    let i = a.next();
    if (t.push(i.value), i.done) {
      n = t.length - 1;
      break;
    }
  } catch (i) {
    r = t.length, t.push(i);
  }
  return { v: t, t: r, d: n };
}
var rs = Ht$1(A$1);
function ns(e) {
  return rs(e);
}
function ss(e, t) {
  return { plugins: t.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (t.disabledFeatures || 0), refs: t.refs || /* @__PURE__ */ new Map(), depthLimit: t.depthLimit || 1e3 };
}
function as(e, t) {
  e.marked.add(t);
}
function Mt$1(e, t) {
  let r = e.refs.size;
  return e.refs.set(t, r), r;
}
function pe(e, t) {
  let r = e.refs.get(t);
  return r != null ? (as(e, r), { type: 1, value: pn$1(r) }) : { type: 0, value: Mt$1(e, t) };
}
function Oe$1(e, t) {
  let r = pe(e, t);
  return r.type === 1 ? r : Pt$1(t) ? { type: 2, value: gn$1(r.value, t) } : r;
}
function P(e, t) {
  let r = Oe$1(e, t);
  if (r.type !== 0) return r.value;
  if (t in At$1) return mn$1(r.value, t);
  throw new ce$1(t);
}
function L(e, t) {
  let r = pe(e, Jn[t]);
  return r.type === 1 ? r.value : m(26, r.value, t, s, s, s, s, s, s, s, s, s);
}
function is(e) {
  let t = pe(e, Gn);
  return t.type === 1 ? t.value : m(27, t.value, s, s, s, s, s, s, P(e, A$1), s, s, s);
}
function os(e) {
  let t = pe(e, Yn);
  return t.type === 1 ? t.value : m(29, t.value, s, s, s, s, s, [L(e, 1), P(e, k)], s, s, s, s);
}
function us(e, t, r, n) {
  return m(r ? 11 : 10, e, s, s, s, n, s, s, s, s, Tt$1(t), s);
}
function cs(e, t, r, n) {
  return m(8, t, s, s, s, s, { k: r, v: n }, s, L(e, 0), s, s, s);
}
function ls(e, t, r) {
  return m(22, t, r, s, s, s, s, s, L(e, 1), s, s, s);
}
function fs(e, t, r) {
  let n = new Uint8Array(r), a = "";
  for (let i = 0, o = n.length; i < o; i++) a += String.fromCharCode(n[i]);
  return m(19, t, x(btoa(a)), s, s, s, s, s, L(e, 5), s, s, s);
}
var ps = ((e) => (e[e.Vanilla = 1] = "Vanilla", e[e.Cross = 2] = "Cross", e))(ps || {});
function Bt$1(e, t) {
  for (let r = 0, n = t.length; r < n; r++) {
    let a = t[r];
    e.has(a) || (e.add(a), a.extends && Bt$1(e, a.extends));
  }
}
function Vt$1(e) {
  if (e) {
    let t = /* @__PURE__ */ new Set();
    return Bt$1(t, e), [...t];
  }
}
function ds(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new jn(e);
  }
}
var hs = 1e6, ms = 1e4, gs = 2e4;
function Wt$1(e, t) {
  switch (t) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var ys = 1e3;
function bs(e, t) {
  var r;
  return { mode: e, plugins: t.plugins, refs: t.refs || /* @__PURE__ */ new Map(), features: (r = t.features) != null ? r : 63 ^ (t.disabledFeatures || 0), depthLimit: t.depthLimit || ys };
}
function ws(e) {
  return { mode: 1, base: bs(1, e), child: s, state: { marked: new Set(e.markedRefs) } };
}
var vs = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  deserialize(e) {
    return y$1(this._p, this.depth, e);
  }
};
function Xt$1(e, t) {
  if (t < 0 || !Number.isFinite(t) || !Number.isInteger(t)) throw new C({ t: 4, i: t });
  if (e.refs.has(t)) throw new Error("Conflicted ref id: " + t);
}
function Ss(e, t, r) {
  return Xt$1(e.base, t), e.state.marked.has(t) && e.base.refs.set(t, r), r;
}
function Rs(e, t, r) {
  return Xt$1(e.base, t), e.base.refs.set(t, r), r;
}
function b(e, t, r) {
  return e.mode === 1 ? Ss(e, t, r) : Rs(e, t, r);
}
function Re$1(e, t, r) {
  if (Object.hasOwn(t, r)) return t[r];
  throw new C(e);
}
function Es(e, t) {
  return b(e, t.i, un$1(O$1(t.s)));
}
function xs(e, t, r) {
  let n = r.a, a = n.length, i = b(e, r.i, new Array(a));
  for (let o = 0, u; o < a; o++) u = n[o], u && (i[o] = y$1(e, t, u));
  return Wt$1(i, r.o), i;
}
function ks(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function As(e) {
  switch (e) {
    case k:
    case U:
    case H$1:
    case A$1:
      return true;
    default:
      return false;
  }
}
function Ve(e, t, r) {
  ks(t) ? e[t] = r : Object.defineProperty(e, t, { value: r, configurable: true, enumerable: true, writable: true });
}
function $s(e, t, r, n, a) {
  if (typeof n == "string") Ve(r, n, y$1(e, t, a));
  else {
    let i = y$1(e, t, n);
    switch (typeof i) {
      case "string":
        Ve(r, i, y$1(e, t, a));
        break;
      case "symbol":
        As(i) && (r[i] = y$1(e, t, a));
        break;
      default:
        throw new C(n);
    }
  }
}
function Gt$1(e, t, r, n) {
  let a = r.k;
  if (a.length > 0) for (let i = 0, o = r.v, u = a.length; i < u; i++) $s(e, t, n, a[i], o[i]);
  return n;
}
function _s(e, t, r) {
  let n = b(e, r.i, r.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return Gt$1(e, t, r.p, n), Wt$1(n, r.o), n;
}
function zs(e, t) {
  return b(e, t.i, new Date(t.s));
}
function Cs(e, t) {
  if (e.base.features & 32) {
    let r = O$1(t.c);
    if (r.length > gs) throw new C(t);
    return b(e, t.i, new RegExp(r, t.m));
  }
  throw new N$1(t);
}
function Ps(e, t, r) {
  let n = b(e, r.i, /* @__PURE__ */ new Set());
  for (let a = 0, i = r.a, o = i.length; a < o; a++) n.add(y$1(e, t, i[a]));
  return n;
}
function Is(e, t, r) {
  let n = b(e, r.i, /* @__PURE__ */ new Map());
  for (let a = 0, i = r.e.k, o = r.e.v, u = i.length; a < u; a++) n.set(y$1(e, t, i[a]), y$1(e, t, o[a]));
  return n;
}
function Ts(e, t) {
  if (t.s.length > hs) throw new C(t);
  return b(e, t.i, qt$1(O$1(t.s)));
}
function Os(e, t, r) {
  var n;
  let a = ds(r.c), i = y$1(e, t, r.f), o = (n = r.b) != null ? n : 0;
  if (o < 0 || o > i.byteLength) throw new C(r);
  return b(e, r.i, new a(i, o, r.l));
}
function Ns(e, t, r) {
  var n;
  let a = y$1(e, t, r.f), i = (n = r.b) != null ? n : 0;
  if (i < 0 || i > a.byteLength) throw new C(r);
  return b(e, r.i, new DataView(a, i, r.l));
}
function Yt$1(e, t, r, n) {
  if (r.p) {
    let a = Gt$1(e, t, r.p, {});
    Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
  }
  return n;
}
function Ls(e, t, r) {
  let n = b(e, r.i, new AggregateError([], O$1(r.m)));
  return Yt$1(e, t, r, n);
}
function js(e, t, r) {
  let n = Re$1(r, Yr, r.s), a = b(e, r.i, new n(O$1(r.m)));
  return Yt$1(e, t, r, a);
}
function Fs(e, t, r) {
  let n = le$1(), a = b(e, r.i, n.p), i = y$1(e, t, r.f);
  return r.s ? n.s(i) : n.f(i), a;
}
function Us(e, t, r) {
  return b(e, r.i, Object(y$1(e, t, r.f)));
}
function Hs(e, t, r) {
  let n = e.base.plugins;
  if (n) {
    let a = O$1(r.c);
    for (let i = 0, o = n.length; i < o; i++) {
      let u = n[i];
      if (u.tag === a) return b(e, r.i, u.deserialize(r.s, new vs(e, t), { id: r.i }));
    }
  }
  throw new jt$1(r.c);
}
function Ds(e, t) {
  return b(e, t.i, b(e, t.s, le$1()).p);
}
function qs(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return n.s(y$1(e, t, r.a[1])), s;
  throw new Q$2("Promise");
}
function Ms(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return n.f(y$1(e, t, r.a[1])), s;
  throw new Q$2("Promise");
}
function Bs(e, t, r) {
  y$1(e, t, r.a[0]);
  let n = y$1(e, t, r.a[1]);
  return ns(n);
}
function Vs(e, t, r) {
  y$1(e, t, r.a[0]);
  let n = y$1(e, t, r.a[1]);
  return es(n);
}
function Ws(e, t, r) {
  let n = b(e, r.i, ee$2()), a = r.a, i = a.length;
  if (i) for (let o = 0; o < i; o++) y$1(e, t, a[o]);
  return n;
}
function Xs(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && fe(n)) return n.next(y$1(e, t, r.f)), s;
  throw new Q$2("Stream");
}
function Gs(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && fe(n)) return n.throw(y$1(e, t, r.f)), s;
  throw new Q$2("Stream");
}
function Ys(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n && fe(n)) return n.return(y$1(e, t, r.f)), s;
  throw new Q$2("Stream");
}
function Js(e, t, r) {
  return y$1(e, t, r.f), s;
}
function Ks(e, t, r) {
  return y$1(e, t, r.a[1]), s;
}
function y$1(e, t, r) {
  if (t > e.base.depthLimit) throw new Ft$1(e.base.depthLimit);
  switch (t += 1, r.t) {
    case 2:
      return Re$1(r, Gr, r.s);
    case 0:
      return Number(r.s);
    case 1:
      return O$1(String(r.s));
    case 3:
      if (String(r.s).length > ms) throw new C(r);
      return BigInt(r.s);
    case 4:
      return e.base.refs.get(r.i);
    case 18:
      return Es(e, r);
    case 9:
      return xs(e, t, r);
    case 10:
    case 11:
      return _s(e, t, r);
    case 5:
      return zs(e, r);
    case 6:
      return Cs(e, r);
    case 7:
      return Ps(e, t, r);
    case 8:
      return Is(e, t, r);
    case 19:
      return Ts(e, r);
    case 16:
    case 15:
      return Os(e, t, r);
    case 20:
      return Ns(e, t, r);
    case 14:
      return Ls(e, t, r);
    case 13:
      return js(e, t, r);
    case 12:
      return Fs(e, t, r);
    case 17:
      return Re$1(r, Wr, r.s);
    case 21:
      return Us(e, t, r);
    case 25:
      return Hs(e, t, r);
    case 22:
      return Ds(e, r);
    case 23:
      return qs(e, t, r);
    case 24:
      return Ms(e, t, r);
    case 28:
      return Bs(e, t, r);
    case 30:
      return Vs(e, t, r);
    case 31:
      return Ws(e, t, r);
    case 32:
      return Xs(e, t, r);
    case 33:
      return Gs(e, t, r);
    case 34:
      return Ys(e, t, r);
    case 27:
      return Js(e, t, r);
    case 29:
      return Ks(e, t, r);
    default:
      throw new N$1(r);
  }
}
function Zs(e, t) {
  try {
    return y$1(e, 0, t);
  } catch (r) {
    throw new On(r);
  }
}
var Qs = () => T, ea = Qs.toString(), Jt$1 = /=>/.test(ea);
function Kt$1(e, t) {
  return Jt$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (t.startsWith("{") ? "(" + t + ")" : t) : "function(" + e.join(",") + "){return " + t + "}";
}
function ta(e, t) {
  return Jt$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + t + "}" : "function(" + e.join(",") + "){" + t + "}";
}
var Zt$1 = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", We$1 = Zt$1.length, Qt$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", Xe = Qt$1.length;
function ra(e) {
  let t = e % We$1, r = Zt$1[t];
  for (e = (e - t) / We$1; e > 0; ) t = e % Xe, r += Qt$1[t], e = (e - t) / Xe;
  return r;
}
var na = /^[$A-Z_][0-9A-Z_$]*$/i;
function er(e) {
  let t = e[0];
  return (t === "$" || t === "_" || t >= "A" && t <= "Z" || t >= "a" && t <= "z") && na.test(e);
}
function W$1(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function sa(e) {
  let t = [], r = e[0];
  for (let n = 1, a = e.length, i, o = r; n < a; n++) i = e[n], i.t === 0 && i.v === o.v ? r = { t: 0, s: i.s, k: s, v: W$1(r) } : i.t === 2 && i.s === o.s ? r = { t: 2, s: W$1(r), k: i.k, v: i.v } : i.t === 1 && i.s === o.s ? r = { t: 1, s: W$1(r), k: s, v: i.v } : i.t === 3 && i.s === o.s ? r = { t: 3, s: W$1(r), k: i.k, v: s } : (t.push(r), r = i), o = i;
  return t.push(r), t;
}
function tr(e) {
  if (e.length) {
    let t = "", r = sa(e);
    for (let n = 0, a = r.length; n < a; n++) t += W$1(r[n]) + ",";
    return t;
  }
  return s;
}
var aa = "Object.create(null)", ia = "new Set", oa = "new Map", ua = "Promise.resolve", ca = "Promise.reject", la = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s };
function fa(e, t) {
  return { mode: e, plugins: t.plugins, features: t.features, marked: new Set(t.markedRefs), stack: [], flags: [], assignments: [] };
}
function pa(e) {
  return { mode: 2, base: fa(2, e), state: e, child: s };
}
var da = class {
  constructor(e) {
    this._p = e;
  }
  serialize(e) {
    return h(this._p, e);
  }
};
function ha(e, t) {
  let r = e.valid.get(t);
  r == null && (r = e.valid.size, e.valid.set(t, r));
  let n = e.vars[r];
  return n == null && (n = ra(r), e.vars[r] = n), n;
}
function ma(e) {
  return ie$1 + "[" + e + "]";
}
function g(e, t) {
  return e.mode === 1 ? ha(e.state, t) : ma(t);
}
function E$1(e, t) {
  e.marked.add(t);
}
function Ee$1(e, t) {
  return e.marked.has(t);
}
function Ne(e, t, r) {
  t !== 0 && (E$1(e.base, r), e.base.flags.push({ type: t, value: g(e, r) }));
}
function ga(e) {
  let t = "";
  for (let r = 0, n = e.flags, a = n.length; r < a; r++) {
    let i = n[r];
    t += la[i.type] + "(" + i.value + "),";
  }
  return t;
}
function ya(e) {
  let t = tr(e.assignments), r = ga(e);
  return t ? r ? t + r : t : r;
}
function rr(e, t, r) {
  e.assignments.push({ t: 0, s: t, k: s, v: r });
}
function ba(e, t, r) {
  e.base.assignments.push({ t: 1, s: g(e, t), k: s, v: r });
}
function B$1(e, t, r, n) {
  e.base.assignments.push({ t: 2, s: g(e, t), k: r, v: n });
}
function Ge(e, t, r) {
  e.base.assignments.push({ t: 3, s: g(e, t), k: r, v: s });
}
function Y$2(e, t, r, n) {
  rr(e.base, g(e, t) + "[" + r + "]", n);
}
function xe$1(e, t, r, n) {
  rr(e.base, g(e, t) + "." + r, n);
}
function _$1(e, t) {
  return t.t === 4 && e.stack.includes(t.i);
}
function M$1(e, t, r) {
  return e.mode === 1 && !Ee$1(e.base, t) ? r : g(e, t) + "=" + r;
}
function wa(e) {
  return V$2 + '.get("' + e.s + '")';
}
function Ye(e, t, r, n) {
  return r ? _$1(e.base, r) ? (E$1(e.base, t), Y$2(e, t, n, g(e, r.i)), "") : h(e, r) : "";
}
function va(e, t) {
  let r = t.i, n = t.a, a = n.length;
  if (a > 0) {
    e.base.stack.push(r);
    let i = Ye(e, r, n[0], 0), o = i === "";
    for (let u = 1, c; u < a; u++) c = Ye(e, r, n[u], u), i += "," + c, o = c === "";
    return e.base.stack.pop(), Ne(e, t.o, t.i), "[" + i + (o ? ",]" : "]");
  }
  return "[]";
}
function Je(e, t, r, n) {
  if (typeof r == "string") {
    let a = Number(r), i = a >= 0 && a.toString() === r || er(r);
    if (_$1(e.base, n)) {
      let o = g(e, n.i);
      return E$1(e.base, t.i), i && a !== a ? xe$1(e, t.i, r, o) : Y$2(e, t.i, i ? r : '"' + r + '"', o), "";
    }
    return (i ? r : '"' + r + '"') + ":" + h(e, n);
  }
  return "[" + h(e, r) + "]:" + h(e, n);
}
function nr(e, t, r) {
  let n = r.k, a = n.length;
  if (a > 0) {
    let i = r.v;
    e.base.stack.push(t.i);
    let o = Je(e, t, n[0], i[0]);
    for (let u = 1, c = o; u < a; u++) c = Je(e, t, n[u], i[u]), o += (c && o && ",") + c;
    return e.base.stack.pop(), "{" + o + "}";
  }
  return "{}";
}
function Sa(e, t) {
  return Ne(e, t.o, t.i), nr(e, t, t.p);
}
function Ra(e, t, r, n) {
  let a = nr(e, t, r);
  return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function Ea(e, t, r, n, a) {
  let i = e.base, o = h(e, a), u = Number(n), c = u >= 0 && u.toString() === n || er(n);
  if (_$1(i, a)) c && u !== u ? xe$1(e, t.i, n, o) : Y$2(e, t.i, c ? n : '"' + n + '"', o);
  else {
    let l = i.assignments;
    i.assignments = r, c && u !== u ? xe$1(e, t.i, n, o) : Y$2(e, t.i, c ? n : '"' + n + '"', o), i.assignments = l;
  }
}
function xa(e, t, r, n, a) {
  if (typeof n == "string") Ea(e, t, r, n, a);
  else {
    let i = e.base, o = i.stack;
    i.stack = [];
    let u = h(e, a);
    i.stack = o;
    let c = i.assignments;
    i.assignments = r, Y$2(e, t.i, h(e, n), u), i.assignments = c;
  }
}
function ka(e, t, r) {
  let n = r.k, a = n.length;
  if (a > 0) {
    let i = [], o = r.v;
    e.base.stack.push(t.i);
    for (let u = 0; u < a; u++) xa(e, t, i, n[u], o[u]);
    return e.base.stack.pop(), tr(i);
  }
  return s;
}
function Le$1(e, t, r) {
  if (t.p) {
    let n = e.base;
    if (n.features & 8) r = Ra(e, t, t.p, r);
    else {
      E$1(n, t.i);
      let a = ka(e, t, t.p);
      if (a) return "(" + M$1(e, t.i, r) + "," + a + g(e, t.i) + ")";
    }
  }
  return r;
}
function Aa(e, t) {
  return Ne(e, t.o, t.i), Le$1(e, t, aa);
}
function $a(e) {
  return 'new Date("' + e.s + '")';
}
function _a(e, t) {
  if (e.base.features & 32) return "/" + t.c + "/" + t.m;
  throw new N$1(t);
}
function Ke(e, t, r) {
  let n = e.base;
  return _$1(n, r) ? (E$1(n, t), ba(e, t, g(e, r.i)), "") : h(e, r);
}
function za(e, t) {
  let r = ia, n = t.a, a = n.length, i = t.i;
  if (a > 0) {
    e.base.stack.push(i);
    let o = Ke(e, i, n[0]);
    for (let u = 1, c = o; u < a; u++) c = Ke(e, i, n[u]), o += (c && o && ",") + c;
    e.base.stack.pop(), o && (r += "([" + o + "])");
  }
  return r;
}
function Ze(e, t, r, n, a) {
  let i = e.base;
  if (_$1(i, r)) {
    let o = g(e, r.i);
    if (E$1(i, t), _$1(i, n)) {
      let c = g(e, n.i);
      return B$1(e, t, o, c), "";
    }
    if (n.t !== 4 && n.i != null && Ee$1(i, n.i)) {
      let c = "(" + h(e, n) + ",[" + a + "," + a + "])";
      return B$1(e, t, o, g(e, n.i)), Ge(e, t, a), c;
    }
    let u = i.stack;
    return i.stack = [], B$1(e, t, o, h(e, n)), i.stack = u, "";
  }
  if (_$1(i, n)) {
    let o = g(e, n.i);
    if (E$1(i, t), r.t !== 4 && r.i != null && Ee$1(i, r.i)) {
      let c = "(" + h(e, r) + ",[" + a + "," + a + "])";
      return B$1(e, t, g(e, r.i), o), Ge(e, t, a), c;
    }
    let u = i.stack;
    return i.stack = [], B$1(e, t, h(e, r), o), i.stack = u, "";
  }
  return "[" + h(e, r) + "," + h(e, n) + "]";
}
function Ca(e, t) {
  let r = oa, n = t.e.k, a = n.length, i = t.i, o = t.f, u = g(e, o.i), c = e.base;
  if (a > 0) {
    let l = t.e.v;
    c.stack.push(i);
    let p = Ze(e, i, n[0], l[0], u);
    for (let d = 1, v = p; d < a; d++) v = Ze(e, i, n[d], l[d], u), p += (v && p && ",") + v;
    c.stack.pop(), p && (r += "([" + p + "])");
  }
  return o.t === 26 && (E$1(c, o.i), r = "(" + h(e, o) + "," + r + ")"), r;
}
function Pa(e, t) {
  return j(e, t.f) + '("' + t.s + '")';
}
function Ia(e, t) {
  return "new " + t.c + "(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Ta(e, t) {
  return "new DataView(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Oa(e, t) {
  let r = t.i;
  e.base.stack.push(r);
  let n = Le$1(e, t, 'new AggregateError([],"' + t.m + '")');
  return e.base.stack.pop(), n;
}
function Na(e, t) {
  return Le$1(e, t, "new " + $t$1[t.s] + '("' + t.m + '")');
}
function La(e, t) {
  let r, n = t.f, a = t.i, i = t.s ? ua : ca, o = e.base;
  if (_$1(o, n)) {
    let u = g(e, n.i);
    r = i + (t.s ? "().then(" + Kt$1([], u) + ")" : "().catch(" + ta([], "throw " + u) + ")");
  } else {
    o.stack.push(a);
    let u = h(e, n);
    o.stack.pop(), r = i + "(" + u + ")";
  }
  return r;
}
function ja(e, t) {
  return "Object(" + h(e, t.f) + ")";
}
function j(e, t) {
  let r = h(e, t);
  return t.t === 4 ? r : "(" + r + ")";
}
function Fa(e, t) {
  if (e.mode === 1) throw new N$1(t);
  return "(" + M$1(e, t.s, j(e, t.f) + "()") + ").p";
}
function Ua(e, t) {
  if (e.mode === 1) throw new N$1(t);
  return j(e, t.a[0]) + "(" + g(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function Ha(e, t) {
  if (e.mode === 1) throw new N$1(t);
  return j(e, t.a[0]) + "(" + g(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function Da(e, t) {
  let r = e.base.plugins;
  if (r) for (let n = 0, a = r.length; n < a; n++) {
    let i = r[n];
    if (i.tag === t.c) return e.child == null && (e.child = new da(e)), i.serialize(t.s, e.child, { id: t.i });
  }
  throw new jt$1(t.c);
}
function qa(e, t) {
  let r = "", n = false;
  return t.f.t !== 4 && (E$1(e.base, t.f.i), r = "(" + h(e, t.f) + ",", n = true), r += M$1(e, t.i, "(" + Vn + ")(" + g(e, t.f.i) + ")"), n && (r += ")"), r;
}
function Ma(e, t) {
  return j(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function Ba(e, t) {
  let r = t.a[0], n = t.a[1], a = e.base, i = "";
  r.t !== 4 && (E$1(a, r.i), i += "(" + h(e, r)), n.t !== 4 && (E$1(a, n.i), i += (i ? "," : "(") + h(e, n)), i && (i += ",");
  let o = M$1(e, t.i, "(" + Wn + ")(" + g(e, n.i) + "," + g(e, r.i) + ")");
  return i ? i + o + ")" : o;
}
function Va(e, t) {
  return j(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function Wa(e, t) {
  let r = M$1(e, t.i, j(e, t.f) + "()"), n = t.a.length;
  if (n) {
    let a = h(e, t.a[0]);
    for (let i = 1; i < n; i++) a += "," + h(e, t.a[i]);
    return "(" + r + "," + a + "," + g(e, t.i) + ")";
  }
  return r;
}
function Xa(e, t) {
  return g(e, t.i) + ".next(" + h(e, t.f) + ")";
}
function Ga(e, t) {
  return g(e, t.i) + ".throw(" + h(e, t.f) + ")";
}
function Ya(e, t) {
  return g(e, t.i) + ".return(" + h(e, t.f) + ")";
}
function Ja(e, t) {
  switch (t.t) {
    case 17:
      return Vr[t.s];
    case 18:
      return wa(t);
    case 9:
      return va(e, t);
    case 10:
      return Sa(e, t);
    case 11:
      return Aa(e, t);
    case 5:
      return $a(t);
    case 6:
      return _a(e, t);
    case 7:
      return za(e, t);
    case 8:
      return Ca(e, t);
    case 19:
      return Pa(e, t);
    case 16:
    case 15:
      return Ia(e, t);
    case 20:
      return Ta(e, t);
    case 14:
      return Oa(e, t);
    case 13:
      return Na(e, t);
    case 12:
      return La(e, t);
    case 21:
      return ja(e, t);
    case 22:
      return Fa(e, t);
    case 25:
      return Da(e, t);
    case 26:
      return Kn[t.s];
    default:
      throw new N$1(t);
  }
}
function h(e, t) {
  switch (t.t) {
    case 2:
      return Xr[t.s];
    case 0:
      return "" + t.s;
    case 1:
      return '"' + t.s + '"';
    case 3:
      return t.s + "n";
    case 4:
      return g(e, t.i);
    case 23:
      return Ua(e, t);
    case 24:
      return Ha(e, t);
    case 27:
      return qa(e, t);
    case 28:
      return Ma(e, t);
    case 29:
      return Ba(e, t);
    case 30:
      return Va(e, t);
    case 31:
      return Wa(e, t);
    case 32:
      return Xa(e, t);
    case 33:
      return Ga(e, t);
    case 34:
      return Ya(e, t);
    default:
      return M$1(e, t.i, Ja(e, t));
  }
}
function Ka(e, t) {
  let r = h(e, t), n = t.i;
  if (n == null) return r;
  let a = ya(e.base), i = g(e, n), o = e.state.scopeId, u = o == null ? "" : ie$1, c = a ? "(" + r + "," + a + i + ")" : r;
  if (u === "") return t.t === 10 && !a ? "(" + c + ")" : c;
  let l = o == null ? "()" : "(" + ie$1 + '["' + x(o) + '"])';
  return "(" + Kt$1([u], c) + ")" + l;
}
var Za = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return S(this._p, this.depth, e);
  }
}, Qa = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return S(this._p, this.depth, e);
  }
  parseWithError(e) {
    return I$2(this._p, this.depth, e);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    He(this._p);
  }
  popPendingState() {
    J$1(this._p);
  }
  onParse(e) {
    D$1(this._p, e);
  }
  onError(e) {
    Fe$1(this._p, e);
  }
};
function ei(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone };
}
function ti(e) {
  return { type: 2, base: ss(2, e), state: ei(e) };
}
function ri(e, t, r) {
  let n = [];
  for (let a = 0, i = r.length; a < i; a++) a in r ? n[a] = S(e, t, r[a]) : n[a] = 0;
  return n;
}
function ni(e, t, r, n) {
  return yn$1(r, n, ri(e, t, n));
}
function je(e, t, r) {
  let n = Object.entries(r), a = [], i = [];
  for (let o = 0, u = n.length; o < u; o++) a.push(x(n[o][0])), i.push(S(e, t, n[o][1]));
  return A$1 in r && (a.push(P(e.base, A$1)), i.push(kn(is(e.base), S(e, t, ts(r))))), k in r && (a.push(P(e.base, k)), i.push(An$1(os(e.base), S(e, t, e.type === 1 ? ee$2() : Zn(r))))), H$1 in r && (a.push(P(e.base, H$1)), i.push(Ot$1(r[H$1]))), U in r && (a.push(P(e.base, U)), i.push(r[U] ? _t$1 : zt$1)), { k: a, v: i };
}
function de$1(e, t, r, n, a) {
  return us(r, n, a, je(e, t, n));
}
function si(e, t, r, n) {
  return bn(r, S(e, t, n.valueOf()));
}
function ai(e, t, r, n) {
  return wn$1(r, n, S(e, t, n.buffer));
}
function ii(e, t, r, n) {
  return vn(r, n, S(e, t, n.buffer));
}
function oi(e, t, r, n) {
  return Sn(r, n, S(e, t, n.buffer));
}
function Qe(e, t, r, n) {
  let a = It(n, e.base.features);
  return Rn(r, n, a ? je(e, t, a) : s);
}
function ui(e, t, r, n) {
  let a = It(n, e.base.features);
  return En(r, n, a ? je(e, t, a) : s);
}
function ci(e, t, r, n) {
  let a = [], i = [];
  for (let [o, u] of n.entries()) a.push(S(e, t, o)), i.push(S(e, t, u));
  return cs(e.base, r, a, i);
}
function li(e, t, r, n) {
  let a = [];
  for (let i of n.keys()) a.push(S(e, t, i));
  return xn(r, a);
}
function fi(e, t, r, n) {
  let a = $n(r, L(e.base, 4), []);
  return e.type === 1 || (He(e), n.on({ next: (i) => {
    if (e.state.alive) {
      let o = I$2(e, t, i);
      o && D$1(e, _n(r, o));
    }
  }, throw: (i) => {
    if (e.state.alive) {
      let o = I$2(e, t, i);
      o && D$1(e, zn(r, o));
    }
    J$1(e);
  }, return: (i) => {
    if (e.state.alive) {
      let o = I$2(e, t, i);
      o && D$1(e, Cn(r, o));
    }
    J$1(e);
  } })), a;
}
function pi(e, t, r) {
  if (this.state.alive) {
    let n = I$2(this, t, r);
    n && D$1(this, m(23, e, s, s, s, s, s, [L(this.base, 2), n], s, s, s, s)), J$1(this);
  }
}
function di(e, t, r) {
  if (this.state.alive) {
    let n = I$2(this, t, r);
    n && D$1(this, m(24, e, s, s, s, s, s, [L(this.base, 3), n], s, s, s, s));
  }
  J$1(this);
}
function hi(e, t, r, n) {
  let a = Mt$1(e.base, {});
  return e.type === 2 && (He(e), n.then(pi.bind(e, a, t), di.bind(e, a, t))), ls(e.base, r, a);
}
function mi(e, t, r, n, a) {
  for (let i = 0, o = a.length; i < o; i++) {
    let u = a[i];
    if (u.parse.sync && u.test(n)) return Nt$1(r, u.tag, u.parse.sync(n, new Za(e, t), { id: r }));
  }
  return s;
}
function gi(e, t, r, n, a) {
  for (let i = 0, o = a.length; i < o; i++) {
    let u = a[i];
    if (u.parse.stream && u.test(n)) return Nt$1(r, u.tag, u.parse.stream(n, new Qa(e, t), { id: r }));
  }
  return s;
}
function sr(e, t, r, n) {
  let a = e.base.plugins;
  return a ? e.type === 1 ? mi(e, t, r, n, a) : gi(e, t, r, n, a) : s;
}
function yi(e, t, r, n, a) {
  switch (a) {
    case Object:
      return de$1(e, t, r, n, false);
    case s:
      return de$1(e, t, r, n, true);
    case Date:
      return dn$1(r, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return Qe(e, t, r, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return si(e, t, r, n);
    case ArrayBuffer:
      return fs(e.base, r, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return ai(e, t, r, n);
    case DataView:
      return oi(e, t, r, n);
    case Map:
      return ci(e, t, r, n);
    case Set:
      return li(e, t, r, n);
  }
  if (a === Promise || n instanceof Promise) return hi(e, t, r, n);
  let i = e.base.features;
  if (i & 32 && a === RegExp) return hn$1(r, n);
  if (i & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return ii(e, t, r, n);
  }
  if (i & 1 && typeof AggregateError < "u" && (a === AggregateError || n instanceof AggregateError)) return ui(e, t, r, n);
  if (n instanceof Error) return Qe(e, t, r, n);
  if (A$1 in n || k in n) return de$1(e, t, r, n, !!a);
  throw new ce$1(n);
}
function bi(e, t, r, n) {
  if (Array.isArray(n)) return ni(e, t, r, n);
  if (fe(n)) return fi(e, t, r, n);
  let a = n.constructor;
  return a === Fn ? S(e, t, n.replacement) : sr(e, t, r, n) || yi(e, t, r, n, a);
}
function wi(e, t, r) {
  let n = Oe$1(e.base, r);
  if (n.type !== 0) return n.value;
  let a = sr(e, t, n.value, r);
  if (a) return a;
  throw new ce$1(r);
}
function S(e, t, r) {
  if (t >= e.base.depthLimit) throw new Ft$1(e.base.depthLimit);
  switch (typeof r) {
    case "boolean":
      return r ? _t$1 : zt$1;
    case "undefined":
      return Jr;
    case "string":
      return Ot$1(r);
    case "number":
      return ln$1(r);
    case "bigint":
      return fn$1(r);
    case "object": {
      if (r) {
        let n = Oe$1(e.base, r);
        return n.type === 0 ? bi(e, t + 1, n.value, r) : n.value;
      }
      return Kr;
    }
    case "symbol":
      return P(e.base, r);
    case "function":
      return wi(e, t, r);
    default:
      throw new ce$1(r);
  }
}
function D$1(e, t) {
  e.state.initial ? e.state.buffer.push(t) : Ue$1(e, t, false);
}
function Fe$1(e, t) {
  if (e.state.onError) e.state.onError(t);
  else throw t instanceof Be$1 ? t : new Be$1(t);
}
function ar(e) {
  e.state.onDone && e.state.onDone();
}
function Ue$1(e, t, r) {
  try {
    e.state.onParse(t, r);
  } catch (n) {
    Fe$1(e, n);
  }
}
function He(e) {
  e.state.pending++;
}
function J$1(e) {
  --e.state.pending <= 0 && ar(e);
}
function I$2(e, t, r) {
  try {
    return S(e, t, r);
  } catch (n) {
    return Fe$1(e, n), s;
  }
}
function vi(e, t) {
  let r = I$2(e, 0, t);
  r && (Ue$1(e, r, true), e.state.initial = false, Si(e, e.state), e.state.pending <= 0 && ir(e));
}
function Si(e, t) {
  for (let r = 0, n = t.buffer.length; r < n; r++) Ue$1(e, t.buffer[r], false);
}
function ir(e) {
  e.state.alive && (ar(e), e.state.alive = false);
}
function Ri(e, t) {
  let r = Vt$1(t.plugins), n = ti({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, onParse(a, i) {
    let o = pa({ plugins: r, features: n.base.features, scopeId: t.scopeId, markedRefs: n.base.marked }), u;
    try {
      u = Ka(o, a);
    } catch (c) {
      t.onError && t.onError(c);
      return;
    }
    t.onSerialize(u, i);
  }, onError: t.onError, onDone: t.onDone });
  return vi(n, e), ir.bind(null, n);
}
function et(e, t = {}) {
  var r;
  let n = Vt$1(t.plugins), a = t.disabledFeatures || 0, i = (r = e.f) != null ? r : 63, o = ws({ plugins: n, markedRefs: e.m, features: i & ~a, disabledFeatures: a });
  return Zs(o, e.t);
}
function he(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Ei = { tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent > "u" ? false : e instanceof CustomEvent;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(he(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(he(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(he(e)) };
} }, serialize(e, t) {
  return "new CustomEvent(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new CustomEvent(t.deserialize(e.type), t.deserialize(e.options));
} }, ke = Ei, xi = { tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException > "u" ? false : e instanceof DOMException;
}, parse: { sync(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
}, async async(e, t) {
  return { name: await t.parse(e.name), message: await t.parse(e.message) };
}, stream(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
} }, serialize(e, t) {
  return "new DOMException(" + t.serialize(e.message) + "," + t.serialize(e.name) + ")";
}, deserialize(e, t) {
  return new DOMException(t.deserialize(e.message), t.deserialize(e.name));
} }, Ae$1 = xi;
function me(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var ki = { tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event > "u" ? false : e instanceof Event;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(me(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(me(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(me(e)) };
} }, serialize(e, t) {
  return "new Event(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Event(t.deserialize(e.type), t.deserialize(e.options));
} }, $e$1 = ki, Ai = { tag: "seroval-plugins/web/File", test(e) {
  return typeof File > "u" ? false : e instanceof File;
}, parse: { async async(e, t) {
  return { name: await t.parse(e.name), options: await t.parse({ type: e.type, lastModified: e.lastModified }), buffer: await t.parse(await e.arrayBuffer()) };
} }, serialize(e, t) {
  return "new File([" + t.serialize(e.buffer) + "]," + t.serialize(e.name) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new File([t.deserialize(e.buffer)], t.deserialize(e.name), t.deserialize(e.options));
} }, $i = Ai;
function ge$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var X$1 = {}, or = (e, t = new FormData(), r = 0, n = e.length, a) => {
  for (; r < n; r++) a = e[r], t.append(a[0], a[1]);
  return t;
}, _i = { tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === X$1;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize() {
  return or.toString();
}, deserialize() {
  return X$1;
} }, zi = { tag: "seroval-plugins/web/FormData", extends: [$i, _i], test(e) {
  return typeof FormData > "u" ? false : e instanceof FormData;
}, parse: { sync(e, t) {
  return { factory: t.parse(X$1), entries: t.parse(ge$1(e)) };
}, async async(e, t) {
  return { factory: await t.parse(X$1), entries: await t.parse(ge$1(e)) };
}, stream(e, t) {
  return { factory: t.parse(X$1), entries: t.parse(ge$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.entries) + ")";
}, deserialize(e, t) {
  return or(t.deserialize(e.entries));
} }, _e = zi;
function ye$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var Ci = { tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers > "u" ? false : e instanceof Headers;
}, parse: { sync(e, t) {
  return t.parse(ye$1(e));
}, async async(e, t) {
  return await t.parse(ye$1(e));
}, stream(e, t) {
  return t.parse(ye$1(e));
} }, serialize(e, t) {
  return "new Headers(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new Headers(t.deserialize(e));
} }, K$1 = Ci, G$1 = {}, ur = (e) => new ReadableStream({ start: (t) => {
  e.on({ next: (r) => {
    try {
      t.enqueue(r);
    } catch {
    }
  }, throw: (r) => {
    t.error(r);
  }, return: () => {
    try {
      t.close();
    } catch {
    }
  } });
} }), Pi = { tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === G$1;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize() {
  return ur.toString();
}, deserialize() {
  return G$1;
} };
function tt(e) {
  let t = ee$2(), r = e.getReader();
  async function n() {
    try {
      let a = await r.read();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
var Ii = { tag: "seroval/plugins/web/ReadableStream", extends: [Pi], test(e) {
  return typeof ReadableStream > "u" ? false : e instanceof ReadableStream;
}, parse: { sync(e, t) {
  return { factory: t.parse(G$1), stream: t.parse(ee$2()) };
}, async async(e, t) {
  return { factory: await t.parse(G$1), stream: await t.parse(tt(e)) };
}, stream(e, t) {
  return { factory: t.parse(G$1), stream: t.parse(tt(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.stream) + ")";
}, deserialize(e, t) {
  let r = t.deserialize(e.stream);
  return ur(r);
} }, Z$2 = Ii;
function rt(e, t) {
  return { body: t, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var Ti = { tag: "seroval-plugins/web/Request", extends: [Z$2, K$1], test(e) {
  return typeof Request > "u" ? false : e instanceof Request;
}, parse: { async async(e, t) {
  return { url: await t.parse(e.url), options: await t.parse(rt(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, t) {
  return { url: t.parse(e.url), options: t.parse(rt(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, t) {
  return "new Request(" + t.serialize(e.url) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Request(t.deserialize(e.url), t.deserialize(e.options));
} }, ze$1 = Ti;
function nt(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var Oi = { tag: "seroval-plugins/web/Response", extends: [Z$2, K$1], test(e) {
  return typeof Response > "u" ? false : e instanceof Response;
}, parse: { async async(e, t) {
  return { body: await t.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await t.parse(nt(e)) };
}, stream(e, t) {
  return { body: t.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: t.parse(nt(e)) };
} }, serialize(e, t) {
  return "new Response(" + t.serialize(e.body) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Response(t.deserialize(e.body), t.deserialize(e.options));
} }, Ce$1 = Oi, Ni = { tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL > "u" ? false : e instanceof URL;
}, parse: { sync(e, t) {
  return t.parse(e.href);
}, async async(e, t) {
  return await t.parse(e.href);
}, stream(e, t) {
  return t.parse(e.href);
} }, serialize(e, t) {
  return "new URL(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new URL(t.deserialize(e));
} }, Pe$1 = Ni, Li = { tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams > "u" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, t) {
  return t.parse(e.toString());
}, async async(e, t) {
  return await t.parse(e.toString());
}, stream(e, t) {
  return t.parse(e.toString());
} }, serialize(e, t) {
  return "new URLSearchParams(" + t.serialize(e) + ")";
}, deserialize(e, t) {
  return new URLSearchParams(t.deserialize(e));
} }, Ie$1 = Li;
function ji(e = {}) {
  let t, r = false;
  const n = (o) => {
    if (t && t !== o) throw new Error("Context conflict");
  };
  let a;
  if (e.asyncContext) {
    const o = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    o ? a = new o() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const i = () => {
    if (a) {
      const o = a.getStore();
      if (o !== void 0) return o;
    }
    return t;
  };
  return { use: () => {
    const o = i();
    if (o === void 0) throw new Error("Context is not available");
    return o;
  }, tryUse: () => i(), set: (o, u) => {
    u || n(o), t = o, r = true;
  }, unset: () => {
    t = void 0, r = false;
  }, call: (o, u) => {
    n(o), t = o;
    try {
      return a ? a.run(o, u) : u();
    } finally {
      r || (t = void 0);
    }
  }, async callAsync(o, u) {
    t = o;
    const c = () => {
      t = o;
    }, l = () => t === o ? c : void 0;
    it$1.add(l);
    try {
      const p = a ? a.run(o, u) : u();
      return r || (t = void 0), await p;
    } finally {
      it$1.delete(l);
    }
  } };
}
function Fi(e = {}) {
  const t = {};
  return { get(r, n = {}) {
    return t[r] || (t[r] = ji({ ...e, ...n })), t[r];
  } };
}
const oe$1 = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, st = "__unctx__", Ui = oe$1[st] || (oe$1[st] = Fi()), Hi = (e, t = {}) => Ui.get(e, t), at$1 = "__unctx_async_handlers__", it$1 = oe$1[at$1] || (oe$1[at$1] = /* @__PURE__ */ new Set());
function Di(e) {
  let t;
  const r = lr(e), n = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...n, body: e.node.req.body }) : new Request(r, { ...n, get body() {
    return t || (t = Ki(e), t);
  } });
}
function qi(e) {
  var _a2;
  return (_a2 = e.web) != null ? _a2 : e.web = { request: Di(e), url: lr(e) }, e.web.request;
}
function Mi() {
  return to();
}
const cr = /* @__PURE__ */ Symbol("$HTTPEvent");
function Bi(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[cr]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function w(e) {
  return function(...t) {
    var _a2;
    let r = t[0];
    if (Bi(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[cr];
    else {
      if (!((_a2 = globalThis.app.config.server.experimental) == null ? void 0 : _a2.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = Mi(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const lr = w(getRequestURL), Vi = w(getRequestIP), ue$1 = w(setResponseStatus), ot$1 = w(getResponseStatus), Wi = w(getResponseStatusText), se$1 = w(getResponseHeaders), ut$1 = w(getResponseHeader), Xi = w(setResponseHeader), fr = w(appendResponseHeader), Gi = w(parseCookies), Yi = w(getCookie), Ji = w(setCookie), ae$1 = w(setHeader), Ki = w(getRequestWebStream), Zi = w(removeResponseHeader), Qi = w(qi);
function eo() {
  var _a2;
  return Hi("nitro-app", { asyncContext: !!((_a2 = globalThis.app.config.server.experimental) == null ? void 0 : _a2.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function to() {
  return eo().use().event;
}
const be$1 = "Invariant Violation", { setPrototypeOf: ro = function(e, t) {
  return e.__proto__ = t, e;
} } = Object;
let De$1 = class De extends Error {
  constructor(t = be$1) {
    super(typeof t == "number" ? `${be$1}: ${t} (see https://github.com/apollographql/invariant-packages)` : t);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", be$1);
    ro(this, De.prototype);
  }
};
function no(e, t) {
  if (!e) throw new De$1(t);
}
const we$1 = "solidFetchEvent";
function so(e) {
  return { request: Qi(e), response: uo(e), clientAddress: Vi(e), locals: {}, nativeEvent: e };
}
function ao(e) {
  return { ...e };
}
function io(e) {
  if (!e.context[we$1]) {
    const t = so(e);
    e.context[we$1] = t;
  }
  return e.context[we$1];
}
function ct$1(e, t) {
  for (const [r, n] of t.entries()) fr(e, r, n);
}
class oo {
  constructor(t) {
    __publicField$1(this, "event");
    this.event = t;
  }
  get(t) {
    const r = ut$1(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, r) {
    return Xi(this.event, t, r);
  }
  delete(t) {
    return Zi(this.event, t);
  }
  append(t, r) {
    fr(this.event, t, r);
  }
  getSetCookie() {
    const t = ut$1(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(se$1(this.event)).forEach(([r, n]) => t(Array.isArray(n) ? n.join(", ") : n, r, this));
  }
  entries() {
    return Object.entries(se$1(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(se$1(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(se$1(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function uo(e) {
  return { get status() {
    return ot$1(e);
  }, set status(t) {
    ue$1(e, t);
  }, get statusText() {
    return Wi(e);
  }, set statusText(t) {
    ue$1(e, ot$1(e), t);
  }, headers: new oo(e) };
}
const q$1 = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function co(e = {}) {
  const t = { options: e, rootNode: pr(), staticRoutesMap: {} }, r = (n) => e.strictTrailingSlash ? n : n.replace(/\/$/, "") || "/";
  if (e.routes) for (const n in e.routes) lt$1(t, r(n), e.routes[n]);
  return { ctx: t, lookup: (n) => lo(t, r(n)), insert: (n, a) => lt$1(t, r(n), a), remove: (n) => fo(t, r(n)) };
}
function lo(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const n = t.split("/"), a = {};
  let i = false, o = null, u = e.rootNode, c = null;
  for (let l = 0; l < n.length; l++) {
    const p = n[l];
    u.wildcardChildNode !== null && (o = u.wildcardChildNode, c = n.slice(l).join("/"));
    const d = u.children.get(p);
    if (d === void 0) {
      if (u && u.placeholderChildren.length > 1) {
        const v = n.length - l;
        u = u.placeholderChildren.find((f) => f.maxDepth === v) || null;
      } else u = u.placeholderChildren[0] || null;
      if (!u) break;
      u.paramName && (a[u.paramName] = p), i = true;
    } else u = d;
  }
  return (u === null || u.data === null) && o !== null && (u = o, a[u.paramName || "_"] = c, i = true), u ? i ? { ...u.data, params: i ? a : void 0 } : u.data : null;
}
function lt$1(e, t, r) {
  let n = true;
  const a = t.split("/");
  let i = e.rootNode, o = 0;
  const u = [i];
  for (const c of a) {
    let l;
    if (l = i.children.get(c)) i = l;
    else {
      const p = po(c);
      l = pr({ type: p, parent: i }), i.children.set(c, l), p === q$1.PLACEHOLDER ? (l.paramName = c === "*" ? `_${o++}` : c.slice(1), i.placeholderChildren.push(l), n = false) : p === q$1.WILDCARD && (i.wildcardChildNode = l, l.paramName = c.slice(3) || "_", n = false), u.push(l), i = l;
    }
  }
  for (const [c, l] of u.entries()) l.maxDepth = Math.max(u.length - c, l.maxDepth || 0);
  return i.data = r, n === true && (e.staticRoutesMap[t] = i), i;
}
function fo(e, t) {
  let r = false;
  const n = t.split("/");
  let a = e.rootNode;
  for (const i of n) if (a = a.children.get(i), !a) return r;
  if (a.data) {
    const i = n.at(-1) || "";
    a.data = null, Object.keys(a.children).length === 0 && a.parent && (a.parent.children.delete(i), a.parent.wildcardChildNode = null, a.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function pr(e = {}) {
  return { type: e.type || q$1.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function po(e) {
  return e.startsWith("**") ? q$1.WILDCARD : e[0] === ":" || e === "*" ? q$1.PLACEHOLDER : q$1.NORMAL;
}
const dr = [{ page: true, $component: { src: "src/routes/(admin)/orders.tsx?pick=default&pick=$css", build: () => import('../build/orders.mjs'), import: () => import('../build/orders.mjs') }, path: "/(admin)/orders", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/orders.tsx" }, { page: true, $component: { src: "src/routes/(admin)/posts.tsx?pick=default&pick=$css", build: () => import('../build/posts.mjs'), import: () => import('../build/posts.mjs') }, path: "/(admin)/posts", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/posts.tsx" }, { page: true, $component: { src: "src/routes/(admin)/products.tsx?pick=default&pick=$css", build: () => import('../build/products.mjs'), import: () => import('../build/products.mjs') }, path: "/(admin)/products", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/products.tsx" }, { page: true, $component: { src: "src/routes/(admin)/users.tsx?pick=default&pick=$css", build: () => import('../build/users.mjs'), import: () => import('../build/users.mjs') }, path: "/(admin)/users", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/users.tsx" }, { page: true, $component: { src: "src/routes/(admin).tsx?pick=default&pick=$css", build: () => import('../build/(admin).mjs'), import: () => import('../build/(admin).mjs') }, path: "/(admin)", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin).tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index.mjs'), import: () => import('../build/index.mjs') }, path: "/", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/index.tsx" }], ho = mo(dr.filter((e) => e.page));
function mo(e) {
  function t(r, n, a, i) {
    const o = Object.values(r).find((u) => a.startsWith(u.id + "/"));
    return o ? (t(o.children || (o.children = []), n, a.slice(o.id.length)), r) : (r.push({ ...n, id: a, path: a.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, n) => r.path.length - n.path.length).reduce((r, n) => t(r, n, n.path, n.path), []);
}
function go(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
co({ routes: dr.reduce((e, t) => {
  if (!go(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (n, a) => `**:${a}`).split("/").map((n) => n.startsWith(":") || n.startsWith("*") ? n : encodeURIComponent(n)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) });
var bo = " ";
const wo = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(bo), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function vo(e, t) {
  let { tag: r, attrs: { key: n, ...a } = { key: void 0 }, children: i } = e;
  return wo[r]({ attrs: { ...a, nonce: t }, key: n, children: i });
}
function So(e, t, r, n = "default") {
  return lazy(async () => {
    var _a2;
    {
      const i = (await e.import())[n], u = (await ((_a2 = t.inputs) == null ? void 0 : _a2[e.src].assets())).filter((l) => l.tag === "style" || l.attrs.rel === "stylesheet");
      return { default: (l) => [...u.map((p) => vo(p)), createComponent(i, l)] };
    }
  });
}
function hr() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && So(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return ho.map(e);
}
let ft$1;
const Fo = isServer ? () => getRequestEvent().routes : () => ft$1 || (ft$1 = hr());
function Ro(e) {
  const t = Yi(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const n = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], a = r.error ? new Error(r.result) : r.result;
    return { input: n, url: r.url, pending: false, result: r.thrown ? void 0 : a, error: r.thrown ? a : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    Ji(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Eo(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: Ro(e) }, routes: hr(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const xo = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function ko(e) {
  return e.status && xo.has(e.status) ? e.status : 302;
}
const Ao = {};
function $o(e) {
  const t = new TextEncoder().encode(e), r = t.length, n = r.toString(16), a = "00000000".substring(0, 8 - n.length) + n, i = new TextEncoder().encode(`;0x${a};`), o = new Uint8Array(12 + r);
  return o.set(i), o.set(t, 12), o;
}
function pt$1(e, t) {
  return new ReadableStream({ start(r) {
    Ri(t, { scopeId: e, plugins: [ke, Ae$1, $e$1, _e, K$1, Z$2, ze$1, Ce$1, Ie$1, Pe$1], onSerialize(n, a) {
      r.enqueue($o(a ? `(${sn$1(e)},${n})` : n));
    }, onDone() {
      r.close();
    }, onError(n) {
      r.error(n);
    } });
  } });
}
async function _o(e) {
  const t = io(e), r = t.request, n = r.headers.get("X-Server-Id"), a = r.headers.get("X-Server-Instance"), i = r.headers.has("X-Single-Flight"), o = new URL(r.url);
  let u, c;
  if (n) no(typeof n == "string", "Invalid server function"), [u, c] = n.split("#");
  else if (u = o.searchParams.get("id"), c = o.searchParams.get("name"), !u || !c) return new Response(null, { status: 404 });
  const l = Ao[u];
  let p;
  if (!l) return new Response(null, { status: 404 });
  p = await l.importer();
  const d = p[l.functionName];
  let v = [];
  if (!a || e.method === "GET") {
    const f = o.searchParams.get("args");
    if (f) {
      const R = JSON.parse(f);
      (R.t ? et(R, { plugins: [ke, Ae$1, $e$1, _e, K$1, Z$2, ze$1, Ce$1, Ie$1, Pe$1] }) : R).forEach((te) => v.push(te));
    }
  }
  if (e.method === "POST") {
    const f = r.headers.get("content-type"), R = e.node.req, te = R instanceof ReadableStream, mr = R.body instanceof ReadableStream, qe = te && R.locked || mr && R.body.locked, Me = te ? R : R.body;
    if ((f == null ? void 0 : f.startsWith("multipart/form-data")) || (f == null ? void 0 : f.startsWith("application/x-www-form-urlencoded"))) v.push(await (qe ? r : new Request(r, { ...r, body: Me })).formData());
    else if (f == null ? void 0 : f.startsWith("application/json")) {
      const gr = qe ? r : new Request(r, { ...r, body: Me });
      v = et(await gr.json(), { plugins: [ke, Ae$1, $e$1, _e, K$1, Z$2, ze$1, Ce$1, Ie$1, Pe$1] });
    }
  }
  try {
    let f = await provideRequestEvent(t, async () => (sharedConfig.context = { event: t }, t.locals.serverFunctionMeta = { id: u + "#" + c }, d(...v)));
    if (i && a && (f = await ht$1(t, f)), f instanceof Response) {
      if (f.headers && f.headers.has("X-Content-Raw")) return f;
      a && (f.headers && ct$1(e, f.headers), f.status && (f.status < 300 || f.status >= 400) && ue$1(e, f.status), f.customBody ? f = await f.customBody() : f.body == null && (f = null));
    }
    return a ? (ae$1(e, "content-type", "text/javascript"), pt$1(a, f)) : dt$1(f, r, v);
  } catch (f) {
    if (f instanceof Response) i && a && (f = await ht$1(t, f)), f.headers && ct$1(e, f.headers), f.status && (!a || f.status < 300 || f.status >= 400) && ue$1(e, f.status), f.customBody ? f = f.customBody() : f.body == null && (f = null), ae$1(e, "X-Error", "true");
    else if (a) {
      const R = f instanceof Error ? f.message : typeof f == "string" ? f : "true";
      ae$1(e, "X-Error", R.replace(/[\r\n]+/g, ""));
    } else f = dt$1(f, r, v, true);
    return a ? (ae$1(e, "content-type", "text/javascript"), pt$1(a, f)) : f;
  }
}
function dt$1(e, t, r, n) {
  const a = new URL(t.url), i = e instanceof Error;
  let o = 302, u;
  return e instanceof Response ? (u = new Headers(e.headers), e.headers.has("Location") && (u.set("Location", new URL(e.headers.get("Location"), a.origin + "").toString()), o = ko(e))) : u = new Headers({ Location: new URL(t.headers.get("referer")).toString() }), e && u.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: a.pathname + a.search, result: i ? e.message : e, thrown: n, error: i, input: [...r.slice(0, -1), [...r[r.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: o, headers: u });
}
let ve$1;
function zo(e) {
  var _a2;
  const t = new Headers(e.request.headers), r = Gi(e.nativeEvent), n = e.response.headers.getSetCookie();
  t.delete("cookie");
  let a = false;
  return ((_a2 = e.nativeEvent.node) == null ? void 0 : _a2.req) && (a = true, e.nativeEvent.node.req.headers.cookie = ""), n.forEach((i) => {
    if (!i) return;
    const { maxAge: o, expires: u, name: c, value: l } = qr(i);
    if (o != null && o <= 0) {
      delete r[c];
      return;
    }
    if (u != null && u.getTime() <= Date.now()) {
      delete r[c];
      return;
    }
    r[c] = l;
  }), Object.entries(r).forEach(([i, o]) => {
    t.append("cookie", `${i}=${o}`), a && (e.nativeEvent.node.req.headers.cookie += `${i}=${o};`);
  }), t;
}
async function ht$1(e, t) {
  let r, n = new URL(e.request.headers.get("referer")).toString();
  t instanceof Response && (t.headers.has("X-Revalidate") && (r = t.headers.get("X-Revalidate").split(",")), t.headers.has("Location") && (n = new URL(t.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const a = ao(e);
  return a.request = new Request(n, { headers: zo(e) }), await provideRequestEvent(a, async () => {
    await Eo(a), ve$1 || (ve$1 = (await import('../build/app-qbLpREiu.mjs')).default), a.router.dataOnly = r || true, a.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = a, ve$1();
      });
    } catch (u) {
      console.log(u);
    }
    const i = a.router.data;
    if (!i) return t;
    let o = false;
    for (const u in i) i[u] === void 0 ? delete i[u] : o = true;
    return o && (t instanceof Response ? t.customBody && (i._$value = t.customBody()) : (i._$value = t, t = new Response(null, { status: 200 })), t.customBody = () => i, t.headers.set("X-Single-Flight", "true")), t;
  });
}
const Uo = eventHandler(_o);

function ge() {
  let t = /* @__PURE__ */ new Set();
  function e(r) {
    return t.add(r), () => t.delete(r);
  }
  let n = false;
  function s(r, o) {
    if (n) return !(n = false);
    const a = { to: r, options: o, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const c of t) c.listener({ ...a, from: c.location, retry: (f) => {
      f && (n = true), c.navigate(r, { ...o, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: e, confirm: s };
}
let M;
function Q$1() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), M = window.history.state._depth;
}
isServer || Q$1();
function Be(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function qe(t, e) {
  let n = false;
  return () => {
    const s = M;
    Q$1();
    const r = s == null ? null : M - s;
    if (n) {
      n = false;
      return;
    }
    r && e(r) ? (n = true, window.history.go(-r)) : t();
  };
}
const ye = /^(?:[a-z0-9]+:)?\/\//i, we = /^\/+|(\/)\/+$/g, ve = "http://sr";
function E(t, e = false) {
  const n = t.replace(we, "$1");
  return n ? e || /^[?#]/.test(n) ? n : "/" + n : "";
}
function q(t, e, n) {
  if (ye.test(e)) return;
  const s = E(t), r = n && E(n);
  let o = "";
  return !r || e.startsWith("/") ? o = s : r.toLowerCase().indexOf(s.toLowerCase()) !== 0 ? o = s + r : o = r, (o || "/") + E(e, !o);
}
function Re(t, e) {
  if (t == null) throw new Error(e);
  return t;
}
function Pe(t, e) {
  return E(t).replace(/\/*(\*.*)?$/g, "") + E(e);
}
function V$1(t) {
  const e = {};
  return t.searchParams.forEach((n, s) => {
    s in e ? Array.isArray(e[s]) ? e[s].push(n) : e[s] = [e[s], n] : e[s] = n;
  }), e;
}
function xe(t, e, n) {
  const [s, r] = t.split("/*", 2), o = s.split("/").filter(Boolean), a = o.length;
  return (c) => {
    const f = c.split("/").filter(Boolean), h = f.length - a;
    if (h < 0 || h > 0 && r === void 0 && !e) return null;
    const l = { path: a ? "" : "/", params: {} }, m = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < a; d++) {
      const p = o[d], y = p[0] === ":", v = y ? f[d] : f[d].toLowerCase(), C = y ? p.slice(1) : p.toLowerCase();
      if (y && $(v, m(C))) l.params[C] = v;
      else if (y || !$(v, C)) return null;
      l.path += `/${v}`;
    }
    if (r) {
      const d = h ? f.slice(-h).join("/") : "";
      if ($(d, m(r))) l.params[r] = d;
      else return null;
    }
    return l;
  };
}
function $(t, e) {
  const n = (s) => s === t;
  return e === void 0 ? true : typeof e == "string" ? n(e) : typeof e == "function" ? e(t) : Array.isArray(e) ? e.some(n) : e instanceof RegExp ? e.test(t) : false;
}
function be(t) {
  const [e, n] = t.pattern.split("/*", 2), s = e.split("/").filter(Boolean);
  return s.reduce((r, o) => r + (o.startsWith(":") ? 2 : 3), s.length - (n === void 0 ? 0 : 1));
}
function Y$1(t) {
  const e = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(s, r) {
    return e.has(r) || runWithOwner(n, () => e.set(r, createMemo(() => t()[r]))), e.get(r)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(t());
  }, has(s, r) {
    return r in t();
  } });
}
function Z$1(t) {
  let e = /(\/?\:[^\/]+)\?/.exec(t);
  if (!e) return [t];
  let n = t.slice(0, e.index), s = t.slice(e.index + e[0].length);
  const r = [n, n += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(s); ) r.push(n += e[1]), s = s.slice(e[0].length);
  return Z$1(s).reduce((o, a) => [...o, ...r.map((c) => c + a)], []);
}
const Ae = 100, Ce = createContext$1(), ee$1 = createContext$1(), W = () => Re(useContext(Ce), "<A> and 'use' router primitives can be only used inside a Route."), Ee = () => useContext(ee$1) || W().base, We = (t) => {
  const e = Ee();
  return createMemo(() => e.resolvePath(t()));
}, $e = (t) => {
  const e = W();
  return createMemo(() => {
    const n = t();
    return n !== void 0 ? e.renderPath(n) : n;
  });
}, Ie = () => W().navigatorFactory(), Me = () => W().location;
function Le(t, e = "") {
  const { component: n, preload: s, load: r, children: o, info: a } = t, c = !o || Array.isArray(o) && !o.length, f = { key: t, component: n, preload: s || r, info: a };
  return te$1(t.path).reduce((h, l) => {
    for (const m of Z$1(l)) {
      const d = Pe(e, m);
      let p = c ? d : d.split("/*", 1)[0];
      p = p.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), h.push({ ...f, originalPath: l, pattern: p, matcher: xe(p, !c, t.matchFilters) });
    }
    return h;
  }, []);
}
function Se(t, e = 0) {
  return { routes: t, score: be(t[t.length - 1]) * 1e4 - e, matcher(n) {
    const s = [];
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r], a = o.matcher(n);
      if (!a) return null;
      s.unshift({ ...a, route: o });
    }
    return s;
  } };
}
function te$1(t) {
  return Array.isArray(t) ? t : [t];
}
function Oe(t, e = "", n = [], s = []) {
  const r = te$1(t);
  for (let o = 0, a = r.length; o < a; o++) {
    const c = r[o];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const f = Le(c, e);
      for (const h of f) {
        n.push(h);
        const l = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !l) Oe(c.children, h.pattern, n, s);
        else {
          const m = Se([...n], s.length);
          s.push(m);
        }
        n.pop();
      }
    }
  }
  return n.length ? s : s.sort((o, a) => a.score - o.score);
}
function I$1(t, e) {
  for (let n = 0, s = t.length; n < s; n++) {
    const r = t[n].matcher(e);
    if (r) return r;
  }
  return [];
}
function Fe(t, e, n) {
  const s = new URL(ve), r = createMemo((l) => {
    const m = t();
    try {
      return new URL(m, s);
    } catch {
      return console.error(`Invalid path ${m}`), l;
    }
  }, s, { equals: (l, m) => l.href === m.href }), o = createMemo(() => r().pathname), a = createMemo(() => r().search, true), c = createMemo(() => r().hash), f = () => "", h = on$2(a, () => V$1(r()));
  return { get pathname() {
    return o();
  }, get search() {
    return a();
  }, get hash() {
    return c();
  }, get state() {
    return e();
  }, get key() {
    return f();
  }, query: n ? n(h) : Y$1(h) };
}
let R;
function De() {
  return R;
}
function Ue(t, e, n, s = {}) {
  const { signal: [r, o], utils: a = {} } = t, c = a.parsePath || ((i) => i), f = a.renderPath || ((i) => i), h = a.beforeLeave || ge(), l = q("", s.base || "");
  if (l === void 0) throw new Error(`${l} is not a valid base path`);
  l && !r().value && o({ value: l, replace: true, scroll: false });
  const [m, d] = createSignal(false);
  let p;
  const y = (i, u) => {
    u.value === v() && u.state === L() || (p === void 0 && d(true), R = i, p = u, startTransition(() => {
      p === u && (C(p.value), ne(p.state), resetErrorBoundaries(), isServer || U[1]((g) => g.filter((P) => P.pending)));
    }).finally(() => {
      p === u && batch(() => {
        R = void 0, i === "navigate" && ae(p), d(false), p = void 0;
      });
    }));
  }, [v, C] = createSignal(r().value), [L, ne] = createSignal(r().state), S = Fe(v, L, a.queryWrapper), O = [], U = createSignal(isServer ? ce() : []), z = createMemo(() => typeof s.transformUrl == "function" ? I$1(e(), s.transformUrl(S.pathname)) : I$1(e(), S.pathname)), H = () => {
    const i = z(), u = {};
    for (let g = 0; g < i.length; g++) Object.assign(u, i[g].params);
    return u;
  }, re = a.paramsWrapper ? a.paramsWrapper(H, e) : Y$1(H), K = { pattern: l, path: () => l, outlet: () => null, resolvePath(i) {
    return q(l, i);
  } };
  return createRenderEffect(on$2(r, (i) => y("native", i), { defer: true })), { base: K, location: S, params: re, isRouting: m, renderPath: f, parsePath: c, navigatorFactory: oe, matches: z, beforeLeave: h, preloadRoute: ie, singleFlight: s.singleFlight === void 0 ? true : s.singleFlight, submissions: U };
  function se(i, u, g) {
    untrack(() => {
      if (typeof u == "number") {
        u && (a.go ? a.go(u) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const P = !u || u[0] === "?", { replace: F, resolve: x, scroll: _, state: b } = { replace: false, resolve: !P, scroll: true, ...g }, A = x ? i.resolvePath(u) : q(P && S.pathname || "", u);
      if (A === void 0) throw new Error(`Path '${u}' is not a routable path`);
      if (O.length >= Ae) throw new Error("Too many redirects");
      const N = v();
      if (A !== N || b !== L()) if (isServer) {
        const T = getRequestEvent();
        T && (T.response = { status: 302, headers: new Headers({ Location: A }) }), o({ value: A, replace: F, scroll: _, state: b });
      } else h.confirm(A, g) && (O.push({ value: N, replace: F, scroll: _, state: L() }), y("navigate", { value: A, state: b }));
    });
  }
  function oe(i) {
    return i = i || useContext(ee$1) || K, (u, g) => se(i, u, g);
  }
  function ae(i) {
    const u = O[0];
    u && (o({ ...i, replace: u.replace, scroll: u.scroll }), O.length = 0);
  }
  function ie(i, u) {
    const g = I$1(e(), i.pathname), P = R;
    R = "preload";
    for (let F in g) {
      const { route: x, params: _ } = g[F];
      x.component && x.component.preload && x.component.preload();
      const { preload: b } = x;
      u && b && runWithOwner(n(), () => b({ params: _, location: { pathname: i.pathname, search: i.search, hash: i.hash, query: V$1(i), state: null, key: "" }, intent: "preload" }));
    }
    R = P;
  }
  function ce() {
    const i = getRequestEvent();
    return i && i.router && i.router.submission ? [i.router.submission] : [];
  }
}
function ze(t, e, n, s) {
  const { base: r, location: o, params: a } = t, { pattern: c, component: f, preload: h } = s().route, l = createMemo(() => s().path);
  f && f.preload && f.preload();
  const m = h ? h({ params: a, location: o, intent: R || "initial" }) : void 0;
  return { parent: e, pattern: c, path: l, outlet: () => f ? createComponent(f, { params: a, location: o, data: m, get children() {
    return n();
  } }) : n(), resolvePath(p) {
    return q(r.path(), p, l());
  } };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function ot(e = {}) {
  let t, n = false;
  const s = (a) => {
    if (t && t !== a) throw new Error("Context conflict");
  };
  let r;
  if (e.asyncContext) {
    const a = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    a ? r = new a() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const o = () => {
    if (r) {
      const a = r.getStore();
      if (a !== void 0) return a;
    }
    return t;
  };
  return { use: () => {
    const a = o();
    if (a === void 0) throw new Error("Context is not available");
    return a;
  }, tryUse: () => o(), set: (a, i) => {
    i || s(a), t = a, n = true;
  }, unset: () => {
    t = void 0, n = false;
  }, call: (a, i) => {
    s(a), t = a;
    try {
      return r ? r.run(a, i) : i();
    } finally {
      n || (t = void 0);
    }
  }, async callAsync(a, i) {
    t = a;
    const l = () => {
      t = a;
    }, c = () => t === a ? l : void 0;
    K.add(c);
    try {
      const h = r ? r.run(a, i) : i();
      return n || (t = void 0), await h;
    } finally {
      K.delete(c);
    }
  } };
}
function at(e = {}) {
  const t = {};
  return { get(n, s = {}) {
    return t[n] || (t[n] = ot({ ...e, ...s })), t[n];
  } };
}
const H = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, B = "__unctx__", it = H[B] || (H[B] = at()), ct = (e, t = {}) => it.get(e, t), V = "__unctx_async_handlers__", K = H[V] || (H[V] = /* @__PURE__ */ new Set());
function lt(e) {
  let t;
  const n = oe(e), s = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(n, { ...s, body: e.node.req.body }) : new Request(n, { ...s, get body() {
    return t || (t = Rt(e), t);
  } });
}
function ut(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: lt(e), url: oe(e) }, e.web.request;
}
function dt() {
  return $t();
}
const se = /* @__PURE__ */ Symbol("$HTTPEvent");
function pt(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[se]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function y(e) {
  return function(...t) {
    var _a;
    let n = t[0];
    if (pt(n)) t[0] = n instanceof H3Event || n.__is_event__ ? n : n[se];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (n = dt(), !n) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(n);
    }
    return e(...t);
  };
}
const oe = y(getRequestURL), ht = y(getRequestIP), O = y(setResponseStatus), z = y(getResponseStatus), ft = y(getResponseStatusText), N = y(getResponseHeaders), G = y(getResponseHeader), mt = y(setResponseHeader), gt = y(appendResponseHeader), J = y(sendRedirect), yt = y(getCookie), wt = y(setCookie), St = y(setHeader), Rt = y(getRequestWebStream), bt = y(removeResponseHeader), vt = y(ut);
function Et() {
  var _a;
  return ct("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function $t() {
  return Et().use().event;
}
const A = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function At(e = {}) {
  const t = { options: e, rootNode: ae(), staticRoutesMap: {} }, n = (s) => e.strictTrailingSlash ? s : s.replace(/\/$/, "") || "/";
  if (e.routes) for (const s in e.routes) Y(t, n(s), e.routes[s]);
  return { ctx: t, lookup: (s) => Ct(t, n(s)), insert: (s, r) => Y(t, n(s), r), remove: (s) => xt(t, n(s)) };
}
function Ct(e, t) {
  const n = e.staticRoutesMap[t];
  if (n) return n.data;
  const s = t.split("/"), r = {};
  let o = false, a = null, i = e.rootNode, l = null;
  for (let c = 0; c < s.length; c++) {
    const h = s[c];
    i.wildcardChildNode !== null && (a = i.wildcardChildNode, l = s.slice(c).join("/"));
    const R = i.children.get(h);
    if (R === void 0) {
      if (i && i.placeholderChildren.length > 1) {
        const b = s.length - c;
        i = i.placeholderChildren.find((m) => m.maxDepth === b) || null;
      } else i = i.placeholderChildren[0] || null;
      if (!i) break;
      i.paramName && (r[i.paramName] = h), o = true;
    } else i = R;
  }
  return (i === null || i.data === null) && a !== null && (i = a, r[i.paramName || "_"] = l, o = true), i ? o ? { ...i.data, params: o ? r : void 0 } : i.data : null;
}
function Y(e, t, n) {
  let s = true;
  const r = t.split("/");
  let o = e.rootNode, a = 0;
  const i = [o];
  for (const l of r) {
    let c;
    if (c = o.children.get(l)) o = c;
    else {
      const h = Tt(l);
      c = ae({ type: h, parent: o }), o.children.set(l, c), h === A.PLACEHOLDER ? (c.paramName = l === "*" ? `_${a++}` : l.slice(1), o.placeholderChildren.push(c), s = false) : h === A.WILDCARD && (o.wildcardChildNode = c, c.paramName = l.slice(3) || "_", s = false), i.push(c), o = c;
    }
  }
  for (const [l, c] of i.entries()) c.maxDepth = Math.max(i.length - l, c.maxDepth || 0);
  return o.data = n, s === true && (e.staticRoutesMap[t] = o), o;
}
function xt(e, t) {
  let n = false;
  const s = t.split("/");
  let r = e.rootNode;
  for (const o of s) if (r = r.children.get(o), !r) return n;
  if (r.data) {
    const o = s.at(-1) || "";
    r.data = null, Object.keys(r.children).length === 0 && r.parent && (r.parent.children.delete(o), r.parent.wildcardChildNode = null, r.parent.placeholderChildren = []), n = true;
  }
  return n;
}
function ae(e = {}) {
  return { type: e.type || A.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function Tt(e) {
  return e.startsWith("**") ? A.WILDCARD : e[0] === ":" || e === "*" ? A.PLACEHOLDER : A.NORMAL;
}
const ie = [{ page: true, $component: { src: "src/routes/(admin)/orders.tsx?pick=default&pick=$css", build: () => import('../build/orders2.mjs'), import: () => import('../build/orders2.mjs') }, path: "/(admin)/orders", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/orders.tsx" }, { page: true, $component: { src: "src/routes/(admin)/posts.tsx?pick=default&pick=$css", build: () => import('../build/posts2.mjs'), import: () => import('../build/posts2.mjs') }, path: "/(admin)/posts", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/posts.tsx" }, { page: true, $component: { src: "src/routes/(admin)/products.tsx?pick=default&pick=$css", build: () => import('../build/products2.mjs'), import: () => import('../build/products2.mjs') }, path: "/(admin)/products", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/products.tsx" }, { page: true, $component: { src: "src/routes/(admin)/users.tsx?pick=default&pick=$css", build: () => import('../build/users2.mjs'), import: () => import('../build/users2.mjs') }, path: "/(admin)/users", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin)/users.tsx" }, { page: true, $component: { src: "src/routes/(admin).tsx?pick=default&pick=$css", build: () => import('../build/(admin)2.mjs'), import: () => import('../build/(admin)2.mjs') }, path: "/(admin)", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/(admin).tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index2.mjs'), import: () => import('../build/index2.mjs') }, path: "/", filePath: "/Volumes/SSD/projects/specloom/examples/solid-start/src/routes/index.tsx" }], Lt = kt(ie.filter((e) => e.page));
function kt(e) {
  function t(n, s, r, o) {
    const a = Object.values(n).find((i) => r.startsWith(i.id + "/"));
    return a ? (t(a.children || (a.children = []), s, r.slice(a.id.length)), n) : (n.push({ ...s, id: r, path: r.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), n);
  }
  return e.sort((n, s) => n.path.length - s.path.length).reduce((n, s) => t(n, s, s.path, s.path), []);
}
function Pt(e, t) {
  const n = Ht.lookup(e);
  if (n && n.route) {
    const s = n.route, r = t === "HEAD" ? s.$HEAD || s.$GET : s[`$${t}`];
    if (r === void 0) return;
    const o = s.page === true && s.$component !== void 0;
    return { handler: r, params: n.params, isPage: o };
  }
}
function Nt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const Ht = At({ routes: ie.reduce((e, t) => {
  if (!Nt(t)) return e;
  let n = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (s, r) => `**:${r}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
  if (/:[^/]*\?/g.test(n)) throw new Error(`Optional parameters are not supported in API routes: ${n}`);
  if (e[n]) throw new Error(`Duplicate API routes for "${n}" found at "${e[n].route.path}" and "${t.path}"`);
  return e[n] = { route: t }, e;
}, {}) }), _ = "solidFetchEvent";
function _t(e) {
  return { request: vt(e), response: Dt(e), clientAddress: ht(e), locals: {}, nativeEvent: e };
}
function qt(e) {
  if (!e.context[_]) {
    const t = _t(e);
    e.context[_] = t;
  }
  return e.context[_];
}
class Ot {
  constructor(t) {
    __publicField(this, "event");
    this.event = t;
  }
  get(t) {
    const n = G(this.event, t);
    return Array.isArray(n) ? n.join(", ") : n || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, n) {
    return mt(this.event, t, n);
  }
  delete(t) {
    return bt(this.event, t);
  }
  append(t, n) {
    gt(this.event, t, n);
  }
  getSetCookie() {
    const t = G(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(N(this.event)).forEach(([n, s]) => t(Array.isArray(s) ? s.join(", ") : s, n, this));
  }
  entries() {
    return Object.entries(N(this.event)).map(([t, n]) => [t, Array.isArray(n) ? n.join(", ") : n])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(N(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(N(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function Dt(e) {
  return { get status() {
    return z(e);
  }, set status(t) {
    O(e, t);
  }, get statusText() {
    return ft(e);
  }, set statusText(t) {
    O(e, z(e), t);
  }, headers: new Ot(e) };
}
var Mt = " ";
const jt = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Mt), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function D(e, t) {
  let { tag: n, attrs: { key: s, ...r } = { key: void 0 }, children: o } = e;
  return jt[n]({ attrs: { ...r, nonce: t }, key: s, children: o });
}
function Ft(e, t, n, s = "default") {
  return lazy(async () => {
    var _a;
    {
      const o = (await e.import())[s], i = (await ((_a = t.inputs) == null ? void 0 : _a[e.src].assets())).filter((c) => c.tag === "style" || c.attrs.rel === "stylesheet");
      return { default: (c) => [...i.map((h) => D(h)), createComponent(o, c)] };
    }
  });
}
function ce() {
  function e(n) {
    return { ...n, ...n.$$route ? n.$$route.require().route : void 0, info: { ...n.$$route ? n.$$route.require().route.info : {}, filesystem: true }, component: n.$component && Ft(n.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: n.children ? n.children.map(e) : void 0 };
  }
  return Lt.map(e);
}
let Q;
const Ut = isServer ? () => getRequestEvent().routes : () => Q || (Q = ce());
function Wt(e) {
  const t = yt(e.nativeEvent, "flash");
  if (t) try {
    let n = JSON.parse(t);
    if (!n || !n.result) return;
    const s = [...n.input.slice(0, -1), new Map(n.input[n.input.length - 1])], r = n.error ? new Error(n.result) : n.result;
    return { input: s, url: n.url, pending: false, result: n.thrown ? void 0 : r, error: n.thrown ? r : void 0 };
  } catch (n) {
    console.error(n);
  } finally {
    wt(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Bt(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: Wt(e) }, routes: ce(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Vt = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function I(e) {
  return e.status && Vt.has(e.status) ? e.status : 302;
}
function Kt(e, t, n = {}, s) {
  return eventHandler({ handler: (r) => {
    const o = qt(r);
    return provideRequestEvent(o, async () => {
      const a = Pt(new URL(o.request.url).pathname, o.request.method);
      if (a) {
        const m = await a.handler.import(), w = o.request.method === "HEAD" ? m.HEAD || m.GET : m[o.request.method];
        o.params = a.params || {}, sharedConfig.context = { event: o };
        const u = await w(o);
        if (u !== void 0) return u;
        if (o.request.method !== "GET") throw new Error(`API handler for ${o.request.method} "${o.request.url}" did not return a response.`);
        if (!a.isPage) return;
      }
      const i = await t(o), l = typeof n == "function" ? await n(i) : { ...n }, c = l.mode || "stream";
      if (l.nonce && (i.nonce = l.nonce), c === "sync") {
        const m = renderToString(() => (sharedConfig.context.event = i, e(i)), l);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const w = I(i.response);
          return J(r, i.response.headers.get("Location"), w);
        }
        return m;
      }
      if (l.onCompleteAll) {
        const m = l.onCompleteAll;
        l.onCompleteAll = (w) => {
          Z(i)(w), m(w);
        };
      } else l.onCompleteAll = Z(i);
      if (l.onCompleteShell) {
        const m = l.onCompleteShell;
        l.onCompleteShell = (w) => {
          X(i, r)(), m(w);
        };
      } else l.onCompleteShell = X(i, r);
      const h = renderToStream(() => (sharedConfig.context.event = i, e(i)), l);
      if (i.response && i.response.headers.get("Location")) {
        const m = I(i.response);
        return J(r, i.response.headers.get("Location"), m);
      }
      if (c === "async") return h;
      const { writable: R, readable: b } = new TransformStream();
      return h.pipeTo(R), b;
    });
  } });
}
function X(e, t) {
  return () => {
    if (e.response && e.response.headers.get("Location")) {
      const n = I(e.response);
      O(t, n), St(t, "Location", e.response.headers.get("Location"));
    }
  };
}
function Z(e) {
  return ({ write: t }) => {
    e.complete = true;
    const n = e.response && e.response.headers.get("Location");
    n && t(`<script>window.location="${n}"<\/script>`);
  };
}
function zt(e, t, n) {
  return Kt(e, Bt, t);
}
const le = (e) => (t) => {
  const { base: n } = t, s = children(() => t.children), r = createMemo(() => Oe(s(), t.base || ""));
  let o;
  const a = Ue(e, r, () => o, { base: n, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(a), createComponent$1(Ce.Provider, { value: a, get children() {
    return createComponent$1(Gt, { routerState: a, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(o = getOwner()) && null, createComponent$1(Jt, { routerState: a, get branches() {
        return r();
      } })];
    } });
  } });
};
function Gt(e) {
  const t = e.routerState.location, n = e.routerState.params, s = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: n, location: t, intent: De() || "initial" });
  }));
  return createComponent$1(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (r) => createComponent$1(r, { params: n, location: t, get data() {
    return s();
  }, get children() {
    return e.children;
  } }) });
}
function Jt(e) {
  if (isServer) {
    const r = getRequestEvent();
    if (r && r.router && r.router.dataOnly) {
      Yt(r, e.routerState, e.branches);
      return;
    }
    r && ((r.router || (r.router = {})).matches || (r.router.matches = e.routerState.matches().map(({ route: o, path: a, params: i }) => ({ path: o.originalPath, pattern: o.pattern, match: a, params: i, info: o.info }))));
  }
  const t = [];
  let n;
  const s = createMemo(on$2(e.routerState.matches, (r, o, a) => {
    let i = o && r.length === o.length;
    const l = [];
    for (let c = 0, h = r.length; c < h; c++) {
      const R = o && o[c], b = r[c];
      a && R && b.route.key === R.route.key ? l[c] = a[c] : (i = false, t[c] && t[c](), createRoot((m) => {
        t[c] = m, l[c] = ze(e.routerState, l[c - 1] || e.routerState.base, ee(() => s()[c + 1]), () => {
          var _a;
          const w = e.routerState.matches();
          return (_a = w[c]) != null ? _a : w[0];
        });
      }));
    }
    return t.splice(r.length).forEach((c) => c()), a && i ? a : (n = l[0], l);
  }));
  return ee(() => s() && n)();
}
const ee = (e) => () => createComponent$1(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent$1(ee$1.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function Yt(e, t, n) {
  const s = new URL(e.request.url), r = I$1(n, new URL(e.router.previousUrl || e.request.url).pathname), o = I$1(n, s.pathname);
  for (let a = 0; a < o.length; a++) {
    (!r[a] || o[a].route !== r[a].route) && (e.router.dataOnly = true);
    const { route: i, params: l } = o[a];
    i.preload && i.preload({ params: l, location: t.location, intent: "preload" });
  }
}
function Qt([e, t], n, s) {
  return [e, s ? (r) => t(s(r)) : t];
}
function Xt(e) {
  let t = false;
  const n = (r) => typeof r == "string" ? { value: r } : r, s = Qt(createSignal(n(e.get()), { equals: (r, o) => r.value === o.value && r.state === o.state }), void 0, (r) => (!t && e.set(r), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), r));
  return e.init && onCleanup(e.init((r = e.get()) => {
    t = true, s[1](n(r)), t = false;
  })), le({ signal: s, create: e.create, utils: e.utils });
}
function Zt(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function en(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
function tn(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function nn(e) {
  let t;
  const n = { value: e.url || (t = getRequestEvent()) && tn(t.request.url) || "" };
  return le({ signal: [() => n, (s) => Object.assign(n, s)] })(e);
}
const rn = /* @__PURE__ */ new Map();
function sn(e = true, t = false, n = "/_server", s) {
  return (r) => {
    const o = r.base.path(), a = r.navigatorFactory(r.base);
    let i, l;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function h(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const d = u.composedPath().find((U) => U instanceof Node && U.nodeName.toUpperCase() === "A");
      if (!d || t && !d.hasAttribute("link")) return;
      const g = c(d), f = g ? d.href.baseVal : d.href;
      if ((g ? d.target.baseVal : d.target) || !f && !d.hasAttribute("state")) return;
      const C = (d.getAttribute("rel") || "").split(/\s+/);
      if (d.hasAttribute("download") || C && C.includes("external")) return;
      const L = g ? new URL(f, document.baseURI) : new URL(f);
      if (!(L.origin !== window.location.origin || o && L.pathname && !L.pathname.toLowerCase().startsWith(o.toLowerCase()))) return [d, L];
    }
    function R(u) {
      const d = h(u);
      if (!d) return;
      const [g, f] = d, F = r.parsePath(f.pathname + f.search + f.hash), C = g.getAttribute("state");
      u.preventDefault(), a(F, { resolve: false, replace: g.hasAttribute("replace"), scroll: !g.hasAttribute("noscroll"), state: C ? JSON.parse(C) : void 0 });
    }
    function b(u) {
      const d = h(u);
      if (!d) return;
      const [g, f] = d;
      s && (f.pathname = s(f.pathname)), r.preloadRoute(f, g.getAttribute("preload") !== "false");
    }
    function m(u) {
      clearTimeout(i);
      const d = h(u);
      if (!d) return l = null;
      const [g, f] = d;
      l !== g && (s && (f.pathname = s(f.pathname)), i = setTimeout(() => {
        r.preloadRoute(f, g.getAttribute("preload") !== "false"), l = g;
      }, 20));
    }
    function w(u) {
      if (u.defaultPrevented) return;
      let d = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!d) return;
      if (!d.startsWith("https://action/")) {
        const f = new URL(d, ve);
        if (d = r.parsePath(f.pathname + f.search), !d.startsWith(n)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const g = rn.get(d);
      if (g) {
        u.preventDefault();
        const f = new FormData(u.target, u.submitter);
        g.call({ r, f: u.target }, u.target.enctype === "multipart/form-data" ? f : new URLSearchParams(f));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", R), e && (document.addEventListener("mousemove", m, { passive: true }), document.addEventListener("focusin", b, { passive: true }), document.addEventListener("touchstart", b, { passive: true })), document.addEventListener("submit", w), onCleanup(() => {
      document.removeEventListener("click", R), e && (document.removeEventListener("mousemove", m), document.removeEventListener("focusin", b), document.removeEventListener("touchstart", b)), document.removeEventListener("submit", w);
    });
  };
}
function on(e) {
  if (isServer) return nn(e);
  const t = () => {
    const s = window.location.pathname.replace(/^\/+/, "/") + window.location.search, r = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: s + window.location.hash, state: r };
  }, n = ge();
  return Xt({ get: t, set({ value: s, replace: r, scroll: o, state: a }) {
    r ? window.history.replaceState(Be(a), "", s) : window.history.pushState(a, "", s), en(decodeURIComponent(window.location.hash.slice(1)), o), Q$1();
  }, init: (s) => Zt(window, "popstate", qe(s, (r) => {
    if (r) return !n.confirm(r);
    {
      const o = t();
      return !n.confirm(o.value, { state: o.state });
    }
  })), create: sn(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (s) => window.history.go(s), beforeLeave: n } })(e);
}
var an = ["<div", ' class="p-4">Loading...</div>'];
function cn() {
  return createComponent$1(on, { root: (e) => createComponent$1(Suspense, { get fallback() {
    return ssr(an, ssrHydrationKey());
  }, get children() {
    return e.children;
  } }), get children() {
    return createComponent$1(Ut, {});
  } });
}
const ue = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var ln = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], un = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const dn = (e) => {
  const t = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (n) => (console.error(n), [ssr(ln, ssrHydrationKey(), escape(t)), createComponent$1(ue, { code: 500 })]), get children() {
    return e.children;
  } });
}, pn = (e) => {
  let t = false;
  const n = catchError(() => e.children, (s) => {
    console.error(s), t = !!s;
  });
  return t ? [ssr(un, ssrHydrationKey()), createComponent$1(ue, { code: 500 })] : n;
};
var te = ["<script", ">", "<\/script>"], hn = ["<script", ' type="module"', " async", "><\/script>"], fn = ["<script", ' type="module" async', "><\/script>"];
const mn = ssr("<!DOCTYPE html>");
function de(e, t, n = []) {
  for (let s = 0; s < t.length; s++) {
    const r = t[s];
    if (r.path !== e[0].path) continue;
    let o = [...n, r];
    if (r.children) {
      const a = e.slice(1);
      if (a.length === 0 || (o = de(a, r.children, o), !o)) continue;
    }
    return o;
  }
}
function gn(e) {
  const t = getRequestEvent(), n = t.nonce;
  let s = [];
  return Promise.resolve().then(async () => {
    let r = [];
    if (t.router && t.router.matches) {
      const o = [...t.router.matches];
      for (; o.length && (!o[0].info || !o[0].info.filesystem); ) o.shift();
      const a = o.length && de(o, t.routes);
      if (a) {
        const i = globalThis.MANIFEST.client.inputs;
        for (let l = 0; l < a.length; l++) {
          const c = a[l], h = i[c.$component.src];
          r.push(h.assets());
        }
      }
    }
    s = await Promise.all(r).then((o) => [...new Map(o.flat().map((a) => [a.attrs.key, a])).values()].filter((a) => a.attrs.rel === "modulepreload" && !t.assets.find((i) => i.attrs.key === a.attrs.key)));
  }), useAssets(() => s.length ? s.map((r) => D(r)) : void 0), createComponent$1(NoHydration, { get children() {
    return [mn, createComponent$1(pn, { get children() {
      return createComponent$1(e.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), t.assets.map((r) => D(r, n))];
      }, get scripts() {
        return n ? [ssr(te, ssrHydrationKey() + ssrAttribute("nonce", escape(n, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(hn, ssrHydrationKey(), ssrAttribute("nonce", escape(n, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(te, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(fn, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(dn, { get children() {
            return createComponent$1(cn, {});
          } });
        } });
      } });
    } })];
  } });
}
var yn = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.ico">', "</head>"], wn = ["<html", ' lang="ja">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const An = zt(() => createComponent$1(gn, { document: ({ assets: e, children: t, scripts: n }) => ssr(wn, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(yn, escape(e));
} }), escape(t), escape(n)) }));

const handlers = [
  { route: '', handler: _larMjZ, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: Uo, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: An, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $e as $, E, Fo as F, Ie as I, Me as M, We as W, nodeServer as n };
//# sourceMappingURL=nitro.mjs.map
