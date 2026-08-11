"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import {
  getHolidays,
  createHoliday,
  deleteHoliday,
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  type Holiday,
  type CalendarEvent,
} from "@/lib/services/admin";

function fmtDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminCalendarPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.calendarTitle">
      <div className="space-y-6">
        <MasterDataCRUD<Holiday>
          titleKey="adminCrud.holidays"
          subtitleKey="adminCrud.holidaysDesc"
          columns={[
            {
              key: "date",
              label: "adminCrud.date",
              render: (r) => fmtDate(r.date),
            },
            { key: "name", label: "adminCrud.name" },
          ]}
          fields={[
            { name: "name", label: "adminCrud.name", type: "text", required: true, placeholder: "adminCrud.placeholder" },
            { name: "date", label: "adminCrud.date", type: "date", required: true },
          ]}
          fetchRows={getHolidays}
          onCreate={(v) => createHoliday({ name: v.name, date: v.date })}
          onDelete={(id) => deleteHoliday(id)}
        />

        <MasterDataCRUD<CalendarEvent>
          titleKey="adminCrud.events"
          subtitleKey="adminCrud.eventsDesc"
          columns={[
            {
              key: "event_date",
              label: "adminCrud.date",
              render: (r) => fmtDate(r.event_date),
            },
            { key: "title", label: "adminCrud.eventTitle" },
            {
              key: "description",
              label: "adminCrud.eventDescription",
              render: (r) => r.description || "-",
            },
          ]}
          fields={[
            { name: "title", label: "adminCrud.eventTitle", type: "text", required: true, placeholder: "adminCrud.placeholder" },
            { name: "description", label: "adminCrud.eventDescription", type: "text", placeholder: "adminCrud.placeholder" },
            { name: "event_date", label: "adminCrud.date", type: "date", required: true },
          ]}
          fetchRows={getCalendarEvents}
          onCreate={(v) =>
            createCalendarEvent({
              title: v.title,
              description: v.description || undefined,
              event_date: v.event_date,
            })
          }
          onUpdate={(id, v) =>
            updateCalendarEvent(id, {
              title: v.title || undefined,
              description: v.description || undefined,
              event_date: v.event_date || undefined,
            })
          }
          onDelete={(id) => deleteCalendarEvent(id)}
        />
      </div>
    </AdminCrudPage>
  );
}