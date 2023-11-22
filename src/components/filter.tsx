interface Props {}

export default function Filter(props: Props) {
  return (
    <div className="flex gap-2 border">
      <select className="border">
        <option>Name</option>
        <option>Card Type</option>
        <option>Card Subtype</option>
        <option>Evolves Into</option>
        <option>Evolves From</option>
        <option>Name</option>
      </select>
      <select className="border">
        <option>is</option>
        <option>contains</option>
        <option>is not</option>
      </select>
    </div>
  );
}
