import { Deck, exportDeck } from "@/lib/deck";
import { useMemo, useState } from "react";
import cards from "../resources/cards";
import sets from "../resources/sets";
import Card from "./card";

interface Props {
  cardId: string;
  onClose: () => any;
}

export default function CardCloseup(props: Props) {
  const { cardId, onClose } = props;

  return (
    <div
      onClick={onClose}
      className="absolute left-0 top-0 z-10 flex h-[100%] w-[100%] flex-col bg-[rgba(0,0,0,0.5)] p-8"
    >
      <Card
        containerClassName="grow"
        className="grow"
        id={cardId}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
