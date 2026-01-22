import AutoSizer from "react-virtualized-auto-sizer";
import type { GridItemKeySelector } from "react-window";
import { FixedSizeGrid as Grid, areEqual } from "react-window";
import memoize from "memoize-one";

import type { ICard } from "../resources/cards";
import Card, { type CardProps } from "./card";
import type { Filters } from "@/lib/filters";
import { filteredCards as filterCards } from "@/lib/filters";
import { memo, useMemo, useState, type CSSProperties } from "react";
import CardCloseup from "./cardCloseup";
import cx from "@/lib/cx";

const cardWidth = 225;
const cardHeight = 314;

interface Props {
  filters: Filters;
  addCard?: (cardId: string, index: number) => unknown;
  cards?: ICard[];
  cardProps?: (
    card: ICard,
    index: number,
  ) => React.PropsWithRef<React.PropsWithChildren<CardProps>>;
}

interface GalleryCardProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: {
    columnCount: number;
    onClick: (
      e: React.MouseEvent<HTMLImageElement, MouseEvent>,
      cardId: string,
      index: number,
    ) => unknown;
    filteredCards: ICard[];
    cardProps?: (
      card: ICard,
      index: number,
    ) => React.PropsWithRef<React.PropsWithChildren<CardProps>>;
  };
}

const GalleryCard = memo((props: GalleryCardProps) => {
  const index = props.rowIndex * props.data.columnCount + props.columnIndex;
  const card = props.data.filteredCards[index];
  const { containerProps, cardProps, ...restCardProps } = props.data.cardProps
    ? props.data.cardProps(card, index)
    : { containerProps: {}, cardProps: {} };

  return card ? (
    <div
      style={{ ...props.style }}
      className="flex flex-col items-center justify-center"
    >
      <Card
        id={card.id}
        containerProps={{
          ...containerProps,
          className: cx("hover", containerProps?.className),
        }}
        cardProps={{
          onClick: (e) => props.data.onClick(e, card.id, index),
          onContextMenu: (e) => {
            e.preventDefault();
            props.data.onClick(e, card.id, index);
          },
          width: cardWidth,
          height: cardHeight,
          ...cardProps,
        }}
        {...restCardProps}
      />
    </div>
  ) : null;
}, areEqual);

const itemKey: GridItemKeySelector<{
  columnCount: number;
  onClick: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    cardId: string,
  ) => unknown;
  filteredCards: ICard[];
  cardProps?: (
    card: ICard,
  ) => React.PropsWithRef<React.PropsWithChildren<CardProps>>;
}> = ({ columnIndex, rowIndex, data }) => {
  const index = rowIndex * data.columnCount + columnIndex;
  const card = data.filteredCards[index];
  return card ? card.id : index;
};

const createItemData = memoize(
  (columnCount, onClick, filteredCards, cardProps) => ({
    columnCount,
    onClick,
    filteredCards,
    cardProps,
  }),
);

export default function CardGallery(props: Props) {
  const filteredCards = useMemo(
    () => filterCards(props.filters, props.cards),
    [props.filters, props.cards],
  );
  const numCards = filteredCards.length;
  const [popupCardId, setPopupCardId] = useState<string | null>(null);

  function onClick(
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    cardId: string,
    index: number,
  ) {
    if (e.button === 0) {
      if (props.addCard) {
        props.addCard(cardId, index);
      } else {
        setPopupCardId(cardId);
      }
    } else if (e.button === 2) {
      setPopupCardId(cardId);
    }
  }

  function navigatePrev() {
    const currentIndex = filteredCards.findIndex((c) => c.id === popupCardId);
    if (currentIndex === -1) return;
    setPopupCardId(filteredCards.at(currentIndex - 1)!.id);
  }

  function navigateNext() {
    const currentIndex = filteredCards.findIndex((c) => c.id === popupCardId);
    if (currentIndex === -1) return;
    setPopupCardId(
      filteredCards.at((currentIndex + 1) % filteredCards.length)!.id,
    );
  }

  function onPopupCardClose() {
    setPopupCardId(null);
  }

  return (
    <>
      {popupCardId && (
        <CardCloseup
          cardId={popupCardId}
          onClose={onPopupCardClose}
          onNavigateNext={navigateNext}
          onNavigatePrev={navigatePrev}
        />
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
              props.cardProps,
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
