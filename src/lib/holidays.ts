export interface HolidayEntry {
  date: string;
  name: string;
  nameEn: string;
}

const FIXED_HOLIDAYS: { month: number; day: number; name: string; nameEn: string }[] = [
  { month: 0, day: 1, name: "Tahun Baru Masehi", nameEn: "New Year's Day" },
  { month: 0, day: 28, name: "Tahun Baru Imlek", nameEn: "Chinese New Year" },
  { month: 1, day: 28, name: "Isra Mi'raj Nabi Muhammad SAW", nameEn: "Isra and Mi'raj" },
  { month: 2, day: 29, name: "Tahun Baru Saka", nameEn: "Nyepi (Saka New Year)" },
  { month: 3, day: 18, name: "Wafat Isa Almasih", nameEn: "Good Friday" },
  { month: 3, day: 21, name: "Hari Raya Idul Fitri", nameEn: "Eid al-Fitr" },
  { month: 3, day: 22, name: "Hari Raya Idul Fitri (2)", nameEn: "Eid al-Fitr (2)" },
  { month: 4, day: 1, name: "Hari Buruh Internasional", nameEn: "International Workers' Day" },
  { month: 4, day: 12, name: "Hari Raya Waisak", nameEn: "Vesak Day" },
  { month: 4, day: 29, name: "Kenaikan Isa Almasih", nameEn: "Ascension Day" },
  { month: 5, day: 1, name: "Hari Lahir Pancasila", nameEn: "Pancasila Day" },
  { month: 5, day: 7, name: "Hari Raya Idul Adha", nameEn: "Eid al-Adha" },
  { month: 5, day: 27, name: "Tahun Baru Islam 1447 H", nameEn: "Islamic New Year 1447 H" },
  { month: 7, day: 17, name: "Hari Kemerdekaan RI", nameEn: "Indonesian Independence Day" },
  { month: 8, day: 5, name: "Maulid Nabi Muhammad SAW", nameEn: "The Prophet's Birthday" },
  { month: 11, day: 25, name: "Hari Natal", nameEn: "Christmas Day" },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dateKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getStaticHolidaysForYear(year: number): HolidayEntry[] {
  return FIXED_HOLIDAYS.map((h) => ({
    date: `${year}-${pad(h.month + 1)}-${pad(h.day)}`,
    name: h.name,
    nameEn: h.nameEn,
  }));
}

let _cacheYear = 0;
let _cacheMap: Record<string, HolidayEntry> = {};

function buildStaticMap(year: number): Record<string, HolidayEntry> {
  if (year === _cacheYear && Object.keys(_cacheMap).length > 0) return _cacheMap;
  const map: Record<string, HolidayEntry> = {};
  getStaticHolidaysForYear(year).forEach((h) => {
    map[h.date] = h;
  });
  _cacheYear = year;
  _cacheMap = map;
  return map;
}

export function isHoliday(date: Date, apiMap?: Record<string, string>): boolean {
  const key = dateKeyFromDate(date);
  if (apiMap && apiMap[key]) return true;
  const staticMap = buildStaticMap(date.getFullYear());
  return !!staticMap[key];
}

export function getHolidayName(date: Date, apiMap?: Record<string, string>, lang: "id" | "en" = "id"): string | null {
  const key = dateKeyFromDate(date);
  if (apiMap && apiMap[key]) return apiMap[key];
  const staticMap = buildStaticMap(date.getFullYear());
  const entry = staticMap[key];
  if (!entry) return null;
  return lang === "en" ? entry.nameEn : entry.name;
}

export function getStaticHolidayMap(year: number): Record<string, HolidayEntry> {
  return buildStaticMap(year);
}
