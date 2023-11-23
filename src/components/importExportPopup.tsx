import { Deck, exportDeck, importDeck } from "@/lib/deck";
import { useEffect, useMemo, useState } from "react";

interface Props {
  deck: Deck;
  onClose: () => any;
  onAccept: (deck: Deck) => any;
}

export default function ImportExportPopup(props: Props) {
  const { deck, onClose } = props;

  const initialText = useMemo(() => exportDeck(deck), [deck]);
  const [text, setText] = useState(initialText);

  function handleAccept() {
    props.onAccept(importDeck(text.split("\n")));
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener("keydown", fn);

    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="absolute left-0 top-0 z-10 flex h-[100%] w-[100%] flex-col bg-[rgba(0,0,0,0.5)] p-4">
      <div className="flex h-[100%]  w-[100%] flex-col flex-col gap-1 rounded bg-white p-4">
        <div className="flex flex-row">
          <h2>Import/Export</h2>
          <button className="ml-auto border" onClick={() => onClose()}>
            [Close]
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          className="grow border"
        />
        <button className="border" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
}
