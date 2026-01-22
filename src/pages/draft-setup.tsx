import CardGallery from "@/components/cardGallery";
import Filters from "@/components/filters";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function DraftSetup() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const navigate = useNavigate();
  const [restrictEvos, setRestrictEvos] = useState(false);

  function startDraft() {
    const urlParams = new URLSearchParams();
    urlParams.set("filters", JSON.stringify(filters));
    urlParams.set("restrictEvos", restrictEvos.toString());
    navigate(`/draft?${urlParams.toString()}`);
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <div className="flex flex-row items-center">
        <h1 className="text-xl">Draft Setup</h1>
        <button className="ml-auto border p-1" onClick={startDraft}>
          Start Draft <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <Filters filters={filters} setFilters={setFilters}>
        <div slot="after">
          <label className="flex cursor-pointer gap-1">
            <input
              type="checkbox"
              checked={restrictEvos}
              onChange={(e) => setRestrictEvos(e.currentTarget.checked)}
            />
            Only show evolutions of selected cards
          </label>
        </div>
      </Filters>
      <CardGallery filters={filters} />
    </div>
  );
}
