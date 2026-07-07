import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("artists/:slug", "routes/artists.$slug.tsx"),
] satisfies RouteConfig;
