import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	{ path: "login", file: "routes/login.tsx" },
	{ path: "register", file: "routes/register.tsx" },
	{ path: "articles", file: "routes/articles.tsx" },
	{ path: "articles/new", file: "routes/articles.new.tsx" },
] satisfies RouteConfig;
