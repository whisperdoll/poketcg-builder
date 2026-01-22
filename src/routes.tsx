import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

const Index = lazy(() => import('./pages/index'));
const DraftSetup = lazy(() => import('./pages/draft-setup'));
const Draft = lazy(() => import('./pages/draft'));
const Notfound = lazy(() => import('./pages/404'));
const Battle = lazy(() => import('./pages/battle'));

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
    path: 'battle',
    element: (
      <Suspense>
        <Battle />
      </Suspense>
    ),
  },
  {
    path: 'draft-setup',
    element: (
      <Suspense>
        <DraftSetup />
      </Suspense>
    ),
  },
  {
    path: 'draft',
    element: (
      <Suspense>
        <Draft />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense>
        <Notfound />
      </Suspense>
    ),
  },
];

export default routes;
