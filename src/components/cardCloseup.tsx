import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import cards from "../resources/cards";
import Card, { CardHeight, CardWidth } from "./card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  cardId: string;
  onClose: () => unknown;
  onNavigatePrev?: () => unknown;
  onNavigateNext?: () => unknown;
}

export default function CardCloseup(props: Props) {
  const { cardId, onClose, onNavigatePrev, onNavigateNext } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardDisplaySize, setCardDisplaySize] = useState({
    width: 0,
    height: 0,
  });

  const card = useMemo(() => cards[cardId], [cardId]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onNavigatePrev && onNavigatePrev();
      } else if (e.key === "ArrowRight") {
        onNavigateNext && onNavigateNext();
      }
    };
    document.addEventListener("keydown", fn);

    return () => document.removeEventListener("keydown", fn);
  }, [onClose, onNavigatePrev, onNavigateNext]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;

      const size = containerRef.current.getBoundingClientRect();
      const heightRatio = size.height / CardHeight;
      const cardDisplayWidth = CardWidth * heightRatio;
      const cardDisplayHeight = size.height;
      setCardDisplaySize({
        width: cardDisplayWidth,
        height: cardDisplayHeight,
      });
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [setCardDisplaySize]);

  return (
    <div ref={containerRef} onClick={onClose} className="cardCloseup">
      {onNavigatePrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigatePrev();
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="4x"
            color="#ddd"
            className="navArrow"
          />
        </button>
      )}
      <Card
        containerProps={{
          className: "shrink-0 relative h-full",
        }}
        cardProps={{
          className: "h-full w-auto",
          onClick: (e) => e.stopPropagation(),
        }}
        id={cardId}
        large
      />
      {onNavigateNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigateNext();
          }}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            size="4x"
            color="#ddd"
            className="navArrow"
          />
        </button>
      )}
    </div>
  );
}
