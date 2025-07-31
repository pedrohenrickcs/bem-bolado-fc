export default function getInitial(name: string) {
  return name?.[0]?.toUpperCase() || "?";
}
