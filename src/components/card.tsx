import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ICard } from "../resources/cards";
import cards from "../resources/cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { CardId } from "@/lib/deck";
import { mergeRefs } from "@/lib/react-utils";
import cx from "@/lib/cx";

export const CardWidth = 225;
export const CardHeight = 314;

export type CardProps = {
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  cardProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  large?: boolean;
  id?: string;
  back?: boolean;
  onHoverChange?: (
    hovering: boolean,
    cardElement: HTMLImageElement,
    containerElement: HTMLDivElement,
  ) => unknown;
  hideFavIcon?: boolean;
  containerRef?: React.MutableRefObject<HTMLDivElement | undefined>;
};

export default function Card(
  props: React.PropsWithRef<React.PropsWithChildren<CardProps>>,
) {
  const [hovering, _setHovering] = useState(false);
  const card = useMemo<ICard | undefined>(
    () => (props.id ? cards[props.id] : undefined),
    [props.id],
  );
  const showTooltip = false;
  const [_favorites, setFavorites] = useLocalStorage<CardId[]>("favorites", []);
  const favorites = _favorites || [];
  const isFavorited = !!props.id && favorites.includes(props.id);
  const showFavIcon =
    !props.hideFavIcon && !props.back && (isFavorited || hovering);
  const containerRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLImageElement>(null);

  if (!card && !props.back) {
    throw new Error("bad id for card: " + props.id);
  }

  const { onHoverChange } = props;

  const setHovering = useCallback(
    (hovering: boolean) => {
      _setHovering(hovering);

      if (cardRef.current && containerRef.current) {
        onHoverChange &&
          onHoverChange(hovering, cardRef.current, containerRef.current);
      }
    },
    [_setHovering, onHoverChange],
  );

  function toggleFavorite() {
    if (!props.id) return;

    if (isFavorited) {
      const copy = favorites.slice(0);
      copy.splice(copy.indexOf(props.id), 1);
      setFavorites(copy);
    } else {
      setFavorites([...favorites, props.id]);
    }
  }

  const cardText =
    showTooltip && card && !props.back
      ? `
    ${card.name} [${card.superType}] ${
      card.subTypes && `[${card.subTypes.join(", ")}]`
    }

    ${card.text && card.text.join("\n\n")}
  `.replace(/^[ \t]+(.+)$/gm, "$1")
      : undefined;

  return (
    <div
      {...props.containerProps}
      ref={mergeRefs(containerRef, props.containerRef)}
      className={cx("card", props.containerProps?.className)}
      style={{
        ...props.containerProps?.style,
      }}
    >
      <img
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        ref={cardRef}
        src={
          !card || props.back
            ? `/poketcg-builder/cards/back.jpg`
            : `/poketcg-builder/cards/${false ? "large/" : "webp/"}${
                card.id
              }.${false ? "jpg" : "webp"}`
        }
        title={cardText}
        draggable={false}
        {...props.cardProps}
      ></img>
      <button
        onMouseEnter={() => setHovering(true)}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleFavorite();
        }}
        className="favorite"
        title="Toggle Favorite"
        style={{ display: showFavIcon ? undefined : "none" }}
      >
        <FontAwesomeIcon
          icon={isFavorited ? solidStar : outlineStar}
          size="lg"
        />
      </button>
      {props.children}
    </div>
  );
}
