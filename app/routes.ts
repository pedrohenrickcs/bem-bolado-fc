import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("ranking", "routes/ranking.tsx"),
   route("sync", "routes/sync.tsx"),
] satisfies RouteConfig;
