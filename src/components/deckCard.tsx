import { useMemo } from "react";
import cards from "../resources/cards";
import sets from "../resources/sets";

interface Props extends Record<string, any> {
  cardId: string;
  amount: number;
  add?: () => any;
  remove?: () => any;
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => any;
}

export default function DeckCard(props: Props) {
  const { cardId, amount, add, remove, onClick, ...restProps } = props;

  const card = useMemo(() => cards[cardId], [cardId]);
  const text = `${card.name} [${card.pioId.toUpperCase()}]`;

  return (
    <div className="flow flex items-center p-1 even:bg-slate-100">
      <span
        className="mr-4 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onClick && onClick(e);
        }}
        title={`${text} (click to view)`}
      >
        {text}
      </span>
      <div className="ml-auto flex gap-1">
        <span>x{amount}</span>
        <button className="border px-1" onClick={() => remove && remove()}>
          -
        </button>
        <button className="border px-1" onClick={() => add && add()}>
          +
        </button>
      </div>
    </div>
  );
}
