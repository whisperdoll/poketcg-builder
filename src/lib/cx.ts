export default function cx(
  ...args: (Record<string, boolean> | string | boolean | undefined)[]
) {
  return args
    .map((arg) => {
      if (typeof arg === "string" || typeof arg === "undefined") return arg;

      return Object.entries(arg)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(" ");
    })
    .join(" ");
}
