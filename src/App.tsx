import { Fragment, useState } from "react";
import { CardHoverContext } from "./contexts/CardHoverContext";
import type { CardId } from "./lib/deck";
import CardHover from "./components/cardHover";
import { Outlet, ScrollRestoration } from "react-router";
import "./App.scss";

export default function App() {
  const [hoverCard, setHoverCard] = useState<CardId | null>(null);

  return (
    <Fragment>
      <CardHover cardId={hoverCard} />
      <CardHoverContext.Provider value={[hoverCard, setHoverCard]}>
        <Outlet />
        <ScrollRestoration />
      </CardHoverContext.Provider>
    </Fragment>
  );
}
