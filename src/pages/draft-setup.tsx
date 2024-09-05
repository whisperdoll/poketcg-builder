import CardGallery from "@/components/cardGallery";
import Filters from "@/components/filters";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { Expression } from "@/lib/expression";
import formats from "@/resources/formats";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function DraftSetup() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <div className="flex flex-row items-center">
        <h1 className="text-xl">Draft Setup</h1>
        <button className="ml-auto border p-1">
          Start Draft <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      <CardGallery filters={filters} />
    </div>
  );
}
