import { useEffect, useMemo, useRef, useState } from "react";
import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";
import useIsOnScreen from "@/hooks/useIsOnScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as outlineStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CardId } from "@/lib/deck";

export const CardWidth = 225;
export const CardHeight = 314;

interface Props {
  id: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => any;
  onContextMenu?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => any;
  style?: any;
  className?: string;
  containerClassName?: string;
  cardProps?: Record<string, any>;
  large?: boolean;
}

export default function Card(props: Props) {
  const [hovering, setHovering] = useState(false);
  const card = useMemo<ICard | undefined>(() => cards[props.id], [props.id]);
  const showTooltip = false;
  const [_favorites, setFavorites] = useLocalStorage<CardId[]>("favorites", []);
  const favorites = _favorites || [];
  const isFavorited = favorites.includes(props.id);
  const showFavIcon = isFavorited || hovering;

  if (!card) {
    throw new Error("bad id for card: " + props.id);
  }

  function toggleFavorite() {
    if (isFavorited) {
      const copy = favorites.slice(0);
      copy.splice(copy.indexOf(props.id), 1);
      setFavorites(copy);
    } else {
      setFavorites([...favorites, props.id]);
    }
  }

  const cardText = showTooltip
    ? `
    ${card.name} [${card.superType}] ${
      card.subTypes && `[${card.subTypes.join(", ")}]`
    }

    ${card.text && card.text.join("\n\n")}
  `.replace(/^[ \t]+(.+)$/gm, "$1")
    : undefined;

  return (
    <div
      style={props.style}
      className={
        "relative flex flex-col items-end justify-start " +
        (props.containerClassName || "")
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        className={
          `bg-slate-100 aspect-[${CardWidth}/${CardHeight}] ` +
          (props.className || "")
        }
        src={`cards/${props.large ? "large/" : ""}${card.id}.jpg`}
        onClick={props.onClick}
        onContextMenu={props.onContextMenu}
        title={cardText}
        key={card.id}
        {...props.cardProps}
      ></img>
      <FontAwesomeIcon
        icon={isFavorited ? solidStar : outlineStar}
        className="absolute right-1 top-1 cursor-pointer"
        title="Toggle Favorite"
        size="lg"
        style={{ display: showFavIcon ? undefined : "none" }}
        onClick={toggleFavorite}
      />
    </div>
  );
}
