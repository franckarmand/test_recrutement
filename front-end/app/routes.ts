import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
	// Make the login page the index (root) route so visiting `/` shows the login
	index("routes/login.tsx"),
	{ path: "register", file: "routes/register.tsx" },
] satisfies RouteConfig;
