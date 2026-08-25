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

export interface LetterData {
  companyName: string;
  companyAddress?: string;
  requestType: "leave" | "overtime" | "izin";
  employeeName: string;
  employeeEmail?: string;
  departmentName?: string;
  dateStart: string;
  dateEnd?: string;
  reason?: string;
  approvedByName?: string;
  approvedByRole?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const LETTER_TYPE_LABELS: Record<string, string> = {
  leave: "Cuti",
  overtime: "Lembur",
  izin: "Izin",
};

export function generateOfficialLetter(data: LetterData): void {
  const label = LETTER_TYPE_LABELS[data.requestType] ?? data.requestType;
  const dateLine =
    data.dateEnd && data.dateEnd !== data.dateStart
      ? `${formatDate(data.dateStart)} s.d. ${formatDate(data.dateEnd)}`
      : formatDate(data.dateStart);
  const letterNo = `SUR/${label.toUpperCase().slice(0, 3)}/${Date.now().toString(36).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Surat Keterangan ${escapeHtml(label)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', Times, serif; color: #111827; padding: 48px 56px; line-height: 1.7; font-size: 13px; }
  .header { border-bottom: 3px double #1E3A5F; padding-bottom: 14px; margin-bottom: 24px; }
  .header h1 { font-size: 16px; color: #1E3A5F; letter-spacing: 0.5px; }
  .header p { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .title { text-align: center; margin: 24px 0 28px; }
  .title h2 { font-size: 15px; text-decoration: underline; text-underline-offset: 4px; }
  .title p { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .content { margin-bottom: 28px; }
  .content p { margin-bottom: 10px; }
  .label { font-weight: bold; display: inline-block; width: 170px; }
  .sig-section { margin-top: 56px; display: flex; justify-content: flex-end; }
  .sig-box { text-align: center; width: 220px; }
  .sig-box .line { border-bottom: 1px solid #111827; margin-bottom: 4px; height: 50px; }
  .sig-box p { font-size: 12px; }
  .sig-box .name { font-weight: bold; margin-top: 4px; }
  footer { margin-top: 40px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 8px; }
  @media print { body { padding: 32px 40px; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.companyName)}</h1>
    ${data.companyAddress ? `<p>${escapeHtml(data.companyAddress)}</p>` : ""}
  </div>

  <div class="title">
    <h2>SURAT KETERANGAN ${label.toUpperCase()}</h2>
    <p>No. ${escapeHtml(letterNo)}</p>
  </div>

  <div class="content">
    <p>Yang bertanda tangan di bawah ini,</p>
    <p><span class="label">Nama</span>: ${escapeHtml(data.approvedByName ?? "...")}</p>
    <p><span class="label">Jabatan</span>: ${escapeHtml(data.approvedByRole ?? "...")}</p>
    <p style="margin-top:14px">
      Dengan ini menerangkan bahwa karyawan yang tersebut di bawah ini:
    </p>
    <div style="margin: 14px 0 14px 16px;">
      <p><span class="label">Nama Karyawan</span>: ${escapeHtml(data.employeeName)}</p>
      ${data.departmentName ? `<p><span class="label">Departemen</span>: ${escapeHtml(data.departmentName)}</p>` : ""}
    </div>
    <p>
      Telah mengajukan permohonan <strong>${escapeHtml(label.toLowerCase())}</strong>
      dengan detail sebagai berikut:
    </p>
    <div style="margin: 14px 0 14px 16px;">
      <p><span class="label">Tanggal</span>: ${escapeHtml(dateLine)}</p>
      ${data.reason ? `<p><span class="label">Alasan</span>: ${escapeHtml(data.reason)}</p>` : ""}
    </div>
    <p>
      Permohonan tersebut di atas telah kami <strong>setujui</strong> dan diproses sesuai ketentuan
      yang berlaku di perusahaan.
    </p>
  </div>

  <p style="margin-top:10px">Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat dipergunakan sebagaimana mestinya.</p>

  <div class="sig-section">
    <div class="sig-box">
      <div class="line"></div>
      <p class="name">${escapeHtml(data.approvedByName ?? "...")}</p>
      <p>${escapeHtml(data.approvedByRole ?? "...")}</p>
    </div>
  </div>

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
