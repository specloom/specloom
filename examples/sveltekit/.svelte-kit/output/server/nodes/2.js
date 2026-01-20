

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.Czn-fqAO.js","_app/immutable/chunks/JXG7iNR4.js","_app/immutable/chunks/wgvE3pql.js","_app/immutable/chunks/BcxXhx_Q.js"];
export const stylesheets = [];
export const fonts = [];
