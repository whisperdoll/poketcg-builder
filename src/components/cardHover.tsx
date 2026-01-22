import type { CardId } from "@/lib/deck";
import { useEffect, useRef } from "react";
import Card from "./card";
import { isNullOrUndefined } from "@/lib/utils";

interface Props {
  cardId: CardId | undefined | null;
}

export default function CardHover(props: Props) {
  const { cardId } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);
  const windowSize = useRef<{ width: number; height: number } | null>(null);

  const show = !isNullOrUndefined(cardId);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      if (!containerRef.current || !windowSize.current) return;

      const padding = 8;
      const { x } = mousePosition.current;
      let { y } = mousePosition.current;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      y -= height / 2;

      const right = x + width;
      const top = y + height;

      if (top > windowSize.current.height) {
        y = windowSize.current.height - height;
      }

      console.log(x, y);

      if (x > windowSize.current.width / 2) {
        containerRef.current.style.left = "";
        containerRef.current.style.right = `${
          windowSize.current.width - x + padding
        }px`;
      } else {
        containerRef.current.style.right = "";
        containerRef.current.style.left = `${x + padding}px`;
      }

      containerRef.current.style.top = `${y}px`;
    };

    const onResize = () => {
      windowSize.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    onResize();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!show || !containerRef.current || !mousePosition.current) return;

    containerRef.current.style.left = `${mousePosition.current.x + 4}px`;
    containerRef.current.style.top = `${mousePosition.current.y + 4}px`;
  }, [show]);

  return (
    show &&
    !isNullOrUndefined(props.cardId) && (
      <div
        className={`fixed z-[1000] bg-white p-4 ${!show && "display-none"}`}
        ref={containerRef}
      >
        <Card
          containerProps={{
            className: "h-[50vh]",
          }}
          cardProps={{
            className: "h-full min-h-0 w-auto",
          }}
          id={cardId}
          large
          hideFavIcon
        />
      </div>
    )
  );
}
