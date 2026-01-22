import type { PropsWithChildren} from "react";
import { useMemo } from "react";
import cards from "../resources/cards";
import formats from "../resources/formats";
import types from "../resources/types";
import type { Filters, Filters as FiltersType} from "@/lib/filters";
import { filterEnums } from "@/lib/filters";
import Slot from "./slot";
import type { SetStateType} from "@/lib/react-utils";
import MultiSelect from "./multiSelect";

interface Props {
  filters: FiltersType;
  setFilters: SetStateType<FiltersType>;
}

export default function Filters(props: PropsWithChildren<Props>) {
  const hps = useMemo(
    () =>
      Object.values(cards)
        .map((c) => c.hp)
        .filter((c) => c !== undefined)
        .sort((a, b) => a - b),
    [],
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
        <MultiSelect
          className="box-border w-40 border p-1"
          options={Object.values(formats).map((format) => {
            return {
              label: format.name,
              checked: !!props.filters.formats?.includes(format.enumId),
              value: format.enumId,
            };
          })}
          onChange={(options) => {
            props.setFilters({
              ...props.filters,
              formats: options.filter((o) => o.checked).map((o) => o.value),
            });
          }}
          defaultLabel="All"
        />
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
                comparator: e.currentTarget.value as Filters['hp']['comparator'],
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

      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <span>Move Type:</span>
        <select
          value={props.filters.moveType.type || ""}
          onChange={(e) =>
            props.setFilters({
              ...props.filters,
              moveType: {
                ...props.filters.moveType,
                type: e.currentTarget.value,
              },
            })
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
        <div className="flex flex-row">
          <input
            type="checkbox"
            id="includeColorless"
            checked={props.filters.moveType.includeColorless}
            onChange={() =>
              props.setFilters({
                ...props.filters,
                moveType: {
                  ...props.filters.moveType,
                  includeColorless: !props.filters.moveType.includeColorless,
                },
              })
            }
          />
          <label className="cursor-pointer pl-1" htmlFor="includeColorless">
            Include Colorless
          </label>
        </div>
      </div>

      <div className="flex flex-row">
        <input
          type="checkbox"
          id="favoritesOnly"
          checked={props.filters.favoritesOnly}
          onChange={() =>
            props.setFilters({
              ...props.filters,
              favoritesOnly: !props.filters.favoritesOnly,
            })
          }
        />
        <label className="cursor-pointer pl-1" htmlFor="favoritesOnly">
          Favorites Only
        </label>
      </div>

      <Slot name="after">{props.children}</Slot>
    </div>
  );
}
