import types from "@/resources/types";

export default function TypeWithHint(props: { type: keyof typeof types }) {
  const { type } = props;

  return (
    <span
      title={types[type]}
      className="cursor-help border-b border-dotted border-black"
    >
      [{type}]
    </span>
  );
}
