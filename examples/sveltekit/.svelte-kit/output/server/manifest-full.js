export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.1fA_wKEr.js",app:"_app/immutable/entry/app.DQWFI62B.js",imports:["_app/immutable/entry/start.1fA_wKEr.js","_app/immutable/chunks/BM8rOf3A.js","_app/immutable/chunks/wgvE3pql.js","_app/immutable/chunks/CTHtVnDP.js","_app/immutable/entry/app.DQWFI62B.js","_app/immutable/chunks/wgvE3pql.js","_app/immutable/chunks/DpyG9E8e.js","_app/immutable/chunks/JXG7iNR4.js","_app/immutable/chunks/CTHtVnDP.js","_app/immutable/chunks/Cxd7G7E7.js","_app/immutable/chunks/BQ3hyv7o.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/posts",
				pattern: /^\/posts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
