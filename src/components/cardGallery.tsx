import { useWindowSize } from "usehooks-ts";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeGrid as Grid,
  GridItemKeySelector,
  areEqual,
} from "react-window";
import memoize from "memoize-one";

import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";
import Card from "./card";
import { Filters, filteredCards as filterCards } from "@/lib/filters";
import { memo, useMemo, useState } from "react";
import CardCloseup from "./cardCloseup";

const cardWidth = 225;
const cardHeight = 314;

interface Props {
  filters: Filters;
  addCard: (cardId: string) => any;
}

interface GalleryCardProps {
  columnIndex: number;
  rowIndex: number;
  style: any;
  data: {
    columnCount: number;
    onClick: (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      cardId: string,
    ) => any;
    filteredCards: ICard[];
  };
}

const GalleryCard = memo((props: GalleryCardProps) => {
  const index = props.rowIndex * props.data.columnCount + props.columnIndex;
  const card = props.data.filteredCards[index];
  return card ? (
    <Card
      id={card.id}
      style={{ ...props.style }}
      onClick={(e) => props.data.onClick(e, card.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        props.data.onClick(e, card.id);
      }}
      className="transform cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      cardProps={{ width: cardWidth, height: cardHeight }}
    />
  ) : null;
}, areEqual);

const itemKey: GridItemKeySelector<{
  columnCount: number;
  onClick: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    cardId: string,
  ) => any;
  filteredCards: ICard[];
}> = ({ columnIndex, rowIndex, data }) => {
  const index = rowIndex * data.columnCount + columnIndex;
  const card = data.filteredCards[index];
  return card ? card.id : index;
};

const createItemData = memoize((columnCount, onClick, filteredCards) => ({
  columnCount,
  onClick,
  filteredCards,
}));

export default function CardGallery(props: Props) {
  const filteredCards = useMemo(
    () => filterCards(props.filters),
    [cards, props.filters],
  );
  const numCards = filteredCards.length;
  const [popupCardId, setPopupCardId] = useState<string | null>(null);

  function onClick(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    cardId: string,
  ) {
    console.log(e.button);
    if (e.button === 0) {
      props.addCard(cardId);
    } else if (e.button === 2) {
      setPopupCardId(cardId);
    }
  }

  function onPopupCardClose() {
    setPopupCardId(null);
  }

  return (
    <>
      {popupCardId && (
        <CardCloseup cardId={popupCardId} onClose={onPopupCardClose} />
      )}
      <div className="grow border">
        {filteredCards.length === 0 && (
          <div className="p-1">No cards match your filters :c</div>
        )}
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            const cardsThatFit = Math.floor(width / (cardWidth + 16));
            const itemData = createItemData(
              cardsThatFit,
              onClick,
              filteredCards,
            );

            return (
              <Grid
                columnCount={cardsThatFit}
                columnWidth={(width - 16) / cardsThatFit}
                rowCount={Math.floor(numCards / cardsThatFit) + 1}
                rowHeight={cardHeight + 8}
                width={width}
                height={height}
                itemData={itemData}
                itemKey={itemKey}
                style={{ overflowX: "hidden" }}
              >
                {GalleryCard}
              </Grid>
            );
          }}
        </AutoSizer>
      </div>
    </>
  );
}
