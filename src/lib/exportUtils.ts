export type ExportRow = (string | number)[];

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? "");
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: ExportRow[],
): void {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(","));
  const csv = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string | number): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function printTablePdf(options: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: ExportRow[];
}): void {
  const { title, subtitle, headers, rows } = options;

  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 32px; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  p.meta { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #1E3A5F; color: #ffffff; text-align: left; padding: 8px 10px; }
  td { border-bottom: 1px solid #e5e7eb; padding: 7px 10px; }
  tr:nth-child(even) td { background: #f9fafb; }
  footer { margin-top: 24px; font-size: 10px; color: #9ca3af; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${subtitle ? `<p class="meta">${escapeHtml(subtitle)}</p>` : ""}
  <table>
    <thead>
      <tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
    </thead>
    <tbody>${bodyRows || `<tr><td colspan="${headers.length}">Tidak ada data</td></tr>`}</tbody>
  </table>
  <footer>Dicetak dari SAMS pada ${new Date().toLocaleString("id-ID")}</footer>
  <script>window.onload = function () { window.focus(); window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=650");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
