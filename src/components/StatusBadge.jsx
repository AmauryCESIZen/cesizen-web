export default function StatusBadge({ value }) {
  const normalized = String(value || "").toUpperCase();

  const className =
    normalized === "ACTIF" || normalized === "PUBLIE"
      ? "badge badge-success"
      : "badge badge-muted";

  return <span className={className}>{normalized}</span>;
}