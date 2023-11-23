import { useEffect, useMemo, useRef, useState } from "react";
import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";
import useIsOnScreen from "@/hooks/useIsOnScreen";

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
  const card = useMemo<ICard | undefined>(() => cards[props.id], [props.id]);

  if (!card) {
    throw new Error("bad id for card: " + props.id);
  }

  return (
    <div
      style={props.style}
      className={
        "flex flex-col items-center justify-center " +
        (props.containerClassName || "")
      }
    >
      <img
        className={"bg-slate-100 " + (props.className || "")}
        src={`cards/${props.large ? "large/" : ""}${card.id}.jpg`}
        onClick={props.onClick}
        onContextMenu={props.onContextMenu}
        {...props.cardProps}
      ></img>
    </div>
  );
}
