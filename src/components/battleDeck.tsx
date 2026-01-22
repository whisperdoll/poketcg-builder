import Card from "./card";
import type { CardId } from "@/lib/deck";

interface DeckCard {
  is?: CardId;
  couldBe?: CardId[];
}

interface Props {
  deck: DeckCard[];
  label: string;
}

export default function BattleDeck(props: Props) {
  return (
    <div className="relative flex min-h-0 min-w-0 flex-col">
      <Card
        cardProps={{ className: "min-h-0 min-h-0 h-full" }}
        back
        containerClassName={`min-h-0`}
        align="center"
      />
      <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-75 px-1">
        {props.label} ({props.deck?.length || 0})
      </div>
    </div>
  );
}
