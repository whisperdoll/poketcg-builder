interface Item {
  content: string | JSX.Element;
  value: string;
  checked: boolean;
}

interface Props {
  items: Item[];
}

export default function FloatingMultiSelect() {
  return <div></div>;
}
