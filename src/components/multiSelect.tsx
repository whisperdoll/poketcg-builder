import type { HTMLProps} from "react";
import React, { useEffect, useState } from "react";

export type OptionType = { label: string; checked: boolean; value: string };
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface Props {
  options: OptionType[];
  onChange: (options: OptionType[]) => unknown;
  defaultLabel: string;
}

export default function MultiSelect(
  props: Props & Omit<HTMLProps<HTMLDivElement>, keyof Props>,
) {
  const { options, onChange, defaultLabel, ...rest } = props;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const mainLabel =
    options
      .filter((m) => m.checked)
      .map((m) => m.label)
      .join(", ") || defaultLabel;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      setDropdownVisible(false);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div {...rest}>
      <div
        className="flex cursor-default flex-row overflow-hidden overflow-ellipsis"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownVisible((p) => !p);
        }}
        title={mainLabel}
      >
        <span>{mainLabel}</span>
        <span className="ml-auto">
          <FontAwesomeIcon icon={faChevronDown} size="xs" />
        </span>
      </div>
      {dropdownVisible && (
        <div
          className="absolute z-10 box-border flex max-h-[70%] flex-col gap-1 overflow-auto border bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {props.options.map((o, i) => {
            return (
              <div
                className="flex flex-row hover:bg-gray-300"
                key={o.label + o.checked}
              >
                <label className="flex h-full w-full cursor-pointer flex-row gap-1 p-2 py-1">
                  <input
                    type="checkbox"
                    checked={o.checked}
                    onChange={(e) => {
                      onChange(
                        options.map((oo, ii) =>
                          ii === i
                            ? { ...oo, checked: e.currentTarget.checked }
                            : oo,
                        ),
                      );
                    }}
                  />
                  {o.label}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
