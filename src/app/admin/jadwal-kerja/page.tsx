"use client";

import AdminCrudPage from "@/components/admin/master/AdminCrudPage";
import MasterDataCRUD from "@/components/admin/master/MasterDataCRUD";
import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  type Shift,
} from "@/lib/services/admin";

function toTime(value?: string): string {
  if (!value) return "--:--";
  const m = value.match(/(\d{1,2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : value;
}

export default function AdminShiftsPage() {
  return (
    <AdminCrudPage titleKey="adminCrud.shiftsTitle">
      <MasterDataCRUD<Shift>
        titleKey="adminCrud.shifts"
        subtitleKey="adminCrud.shiftsDesc"
        columns={[
          { key: "name", label: "adminCrud.name" },
          {
            key: "start_time",
            label: "adminCrud.startTime",
            render: (r) => toTime(r.start_time),
          },
          {
            key: "end_time",
            label: "adminCrud.endTime",
            render: (r) => toTime(r.end_time),
          },
          { key: "tolerance_minutes", label: "adminCrud.toleranceMinutes" },
        ]}
        fields={[
          {
            name: "name",
            label: "adminCrud.name",
            type: "text",
            required: true,
            placeholder: "adminCrud.placeholder",
          },
          { name: "start_time", label: "adminCrud.startTime", type: "time", required: true },
          { name: "end_time", label: "adminCrud.endTime", type: "time", required: true },
          {
            name: "tolerance_minutes",
            label: "adminCrud.toleranceMinutes",
            type: "number",
            required: true,
          },
        ]}
        fetchRows={getShifts}
        onCreate={(v) =>
          createShift({
            name: v.name,
            start_time: v.start_time,
            end_time: v.end_time,
            tolerance_minutes: v.tolerance_minutes,
          })
        }
        onUpdate={(id, v) =>
          updateShift(id, {
            name: v.name,
            start_time: v.start_time,
            end_time: v.end_time,
            tolerance_minutes: v.tolerance_minutes,
          })
        }
        onDelete={(id) => deleteShift(id)}
      />
    </AdminCrudPage>
  );
}