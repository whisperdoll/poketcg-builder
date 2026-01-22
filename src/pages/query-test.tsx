import CardGallery from "@/components/cardGallery";
import Filters from "@/components/filters";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { Expression } from "@/lib/expression";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

export default function QueryTest() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const e = new Expression(query);
    try {
      const result = e.parse();
      return JSON.stringify(result);
    } catch (e) {
      return JSON.stringify(e);
    }
  }, [query]);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      <div className="flex flex-row items-center">
        <h1 className="text-xl">Draft Setup</h1>
        <button className="ml-auto border p-1">
          Start Draft <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <input
        placeholder="Query..."
        className="w-full border p-1"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <div className="b border-yellow-800 bg-yellow-100 p-1">{results}</div>
      <Filters filters={filters} setFilters={setFilters} />
      <CardGallery filters={filters} />
    </div>
  );
}
