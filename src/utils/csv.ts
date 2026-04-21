import fs from "node:fs";

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

export function writeCsvFile(filePath: string, rows: Record<string, unknown>[]): void {
  if (!rows.length) {
    fs.writeFileSync(filePath, "", "utf-8");
    return;
  }

  const headers = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    )
  ];

  fs.writeFileSync(filePath, csvLines.join("\n"), "utf-8");
}