import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";

const Index = lazy(() => import("@/pages/index"));
const DraftSetup = lazy(() => import("@/pages/draft-setup"));
const Draft = lazy(() => import("@/pages/draft"));
const Notfound = lazy(() => import("@/pages/404"));

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: (
      <Suspense>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "draft",
    element: (
      <Suspense>
        <DraftSetup />
      </Suspense>
    ),
  },
  {
    path: "draft/:format/:seed",
    element: (
      <Suspense>
        <Draft />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense>
        <Notfound />
      </Suspense>
    ),
  },
];

export default routes;
