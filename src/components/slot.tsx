import React, { PropsWithChildren } from "react";

type Props = {
  name: string;
};

export default function Slot(props: PropsWithChildren<Props>) {
  return (
    <>
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) return null;

        return child.props.slot === props.name ? child : null;
      })}
    </>
  );
}
