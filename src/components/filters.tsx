import { useMemo, useState } from "react";
import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";
import formats from "../resources/formats";
import types from "../resources/types";
import Filter from "./filter";
import { Filters, filterEnums } from "@/lib/filters";

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function Filters(props: Props) {
  const hps = useMemo(
    () =>
      Object.values(cards)
        .map((c) => c.hp)
        .filter((c) => c !== undefined)
        .sort((a, b) => parseInt(a as any) - parseInt(b as any)),
    [cards],
  );
  const minHp = hps[0]!;
  const maxHp = hps[hps.length - 1]!;

  return (
    <div className="flex flex-wrap items-center gap-4 gap-y-2">
      <input
        value={props.filters.searchText}
        onChange={(e) =>
          props.setFilters({
            ...props.filters,
            searchText: e.currentTarget.value,
          })
        }
        placeholder="Search..."
        className="border p-1"
      />

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>Format:</span>
        <select
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              format: e.currentTarget.value,
            })
          }
          value={props.filters.format || ""}
          className="border p-1"
        >
          <option value="">Any</option>
          {Object.values(formats).map((format) => (
            <option key={format.enumId} value={format.enumId}>
              {format.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>Card Type:</span>
        <select
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              superType: e.currentTarget.value,
            })
          }
          value={props.filters.superType || ""}
          className="border p-1"
        >
          <option value="">Any</option>
          {filterEnums.superType.map((superType) => (
            <option key={superType} value={superType}>
              {superType}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>Card Subtype:</span>
        <select
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              subType: e.currentTarget.value,
            })
          }
          value={props.filters.subType || ""}
          className="border p-1"
        >
          <option value="">Any</option>
          {filterEnums.subTypes.map((subType) => (
            <option key={subType} value={subType}>
              {subType}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>Type:</span>
        <select
          value={props.filters.type || ""}
          onChange={(e) =>
            props.setFilters({ ...props.filters, type: e.currentTarget.value })
          }
          className="border p-1"
        >
          <option value="">Any</option>
          {Object.entries(types).map(([value, typeName]) => (
            <option key={value} value={value}>
              {typeName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>HP:</span>
        <select
          value={props.filters.hp.comparator}
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              hp: {
                ...props.filters.hp,
                comparator: e.currentTarget.value as any,
              },
            })
          }
          className="border p-1"
        >
          {["=", ">", "<", ">=", "<="].map((comparator) => (
            <option value={comparator} key={comparator}>
              {comparator}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              hp: { ...props.filters.hp, value: e.currentTarget.value },
            })
          }
          value={props.filters.hp.value || ""}
          className="border p-1"
        >
          <option value="">Any</option>
          {new Array((maxHp - minHp) / 10).fill(0).map((_, i) => (
            <option key={i} value={minHp + 10 * i}>
              {minHp + 10 * i}
            </option>
          ))}
        </select>
      </div>

      <div>ℹ️ Click a card below to add it to your deck</div>
      <div>ℹ️ Right-click a card to view it up close</div>
    </div>
  );
}
