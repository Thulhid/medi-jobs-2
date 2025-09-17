export function isEditableStatus(statusName?: string): boolean {
  const n = String(statusName || "").toLowerCase();
  return !(n.includes("reject") || n.includes("closed"));
}
