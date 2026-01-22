import "./lib/prototypes.ts";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router";
import routes from "./routes.tsx";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <App />,
      children: routes,
      errorElement: <div>error</div>,
      hydrateFallbackElement: <div>Loading...</div>,
    },
  ],
  { basename: "/" },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
