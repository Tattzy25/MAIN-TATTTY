/**
 * Small pure helpers used by selection and badge logic.
 * Kept minimal and testable.
 */

export function getNamespaceFromId(id: string) {
  const idx = id.indexOf("-");
  return idx === -1 ? id : id.slice(0, idx);
}

export function basicLabelFromId(id: string) {
  const idx = id.indexOf("-");
  if (idx === -1) {
    const ns = id;
    return humanNameForNamespace(ns);
  }
  const ns = id.slice(0, idx);
  const num = parseInt(id.slice(idx + 1), 10);
  const humanNs = humanNameForNamespace(ns);
  if (!Number.isNaN(num)) {
    return `${humanNs} ${num + 1}`;
  }
  return `${humanNs} ${id.slice(idx + 1)}`;
}

export function humanNameForNamespace(ns: string) {
  return (
    {
      styles: "Style",
      colors: "Color",
      aspect: "Aspect",
      q1: "Q1",
      q2: "Q2",
    }[ns] ?? capitalize(ns)
  );
}

export function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function truncate(text: string, max = 40) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}
