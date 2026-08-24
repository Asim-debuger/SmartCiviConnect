export function formatMixed(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") return item;
      if (item?.degree || item?.school) return [item.degree, item.school, item.year].filter(Boolean).join(", ");
      if (item?.title) return [item.title, item.organization, item.years].filter(Boolean).join(" · ");
      if (item?.name) return [item.name, item.issuer, item.year].filter(Boolean).join(" · ");
      return "";
    }).filter(Boolean).join("; ");
  }
  return "";
}

export function applicationDocuments(item) {
  if (!item) return [];
  const snapshotDocs = item.snapshot?.documents;
  if (Array.isArray(snapshotDocs) && snapshotDocs.length) return snapshotDocs;
  if (Array.isArray(item.documents) && item.documents.length) return item.documents;
  return [];
}
