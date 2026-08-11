"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import AgendaSummary from "./AgendaSummary";
import ScheduleForm from "./ScheduleForm";
import AgendaList from "./AgendaList";
import { getMySchedule, toHHMM } from "@/lib/services/schedule";

export default function ScheduleContent() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const user = session?.user;

  const [schedule, setSchedule] = useState<Awaited<ReturnType<typeof getMySchedule>> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getMySchedule(user.id)
      .then((data) => {
        setSchedule(data);
        setLoaded(true);
      })
      .catch(() => {
        setSchedule(null);
        setLoaded(true);
      });
  }, [user?.id]);

  const start = toHHMM(schedule?.start_time);
  const end = toHHMM(schedule?.end_time);
  const hasSchedule = !!schedule;

  return (
    <div>
      <AgendaSummary />

      {loaded && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          {hasSchedule ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {t("scheduleForm.activeShift")}
                </p>
                <p className="text-lg font-bold text-[#1E3A5F] dark:text-blue-300 mt-0.5">
                  {schedule.shift_name || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiCalendar size={15} className="text-[#1E3A5F] dark:text-blue-300" />
                {start && end ? `${start} - ${end}` : "--:-- - --:--"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiMapPin size={15} className="text-[#1E3A5F] dark:text-blue-300" />
                {schedule.location_name || "-"}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("scheduleForm.noSchedule")}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScheduleForm />
        </div>

        <div className="lg:col-span-2">
          <AgendaList />
        </div>
      </div>
    </div>
  );
}