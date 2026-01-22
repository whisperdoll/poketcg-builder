import { useMemo } from "react";
import cards from "../resources/cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";

interface Props extends Record<string, unknown> {
  cardId: string;
  amount: number;
  add?: () => unknown;
  remove?: () => unknown;
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => unknown;
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
        {remove && (
          <button className="border w-6" onClick={() => remove()}>
            <FontAwesomeIcon icon={faMinus} size="2xs" />
          </button>
        )}
        {add && (
          <button className="border w-6" onClick={() => add()}>
            <FontAwesomeIcon icon={faAdd} size="2xs" />
          </button>
        )}
      </div>
    </div>
  );
}
