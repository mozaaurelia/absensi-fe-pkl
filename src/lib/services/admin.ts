import { apiFetch } from "@/lib/api";

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface OfficeLocation {
  id: string;
  name: string;
  latitude: string | number;
  longitude: string | number;
  radius_meters: string | number;
}

export interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  tolerance_minutes: string | number;
}

export interface Role {
  id: string;
  name: string;
}

export interface AdminEmployee {
  id: string;
  name: string;
  email: string;
  status: string;
  role_name?: string | null;
  department_id?: string | null;
  position_id?: string | null;
}

export function getDepartments(): Promise<Department[]> {
  return apiFetch<Department[]>("/departments");
}
export function createDepartment(body: { name: string }): Promise<Department> {
  return apiFetch<Department>("/departments", { method: "POST", body: JSON.stringify(body) });
}
export function updateDepartment(id: string, body: { name: string }): Promise<Department> {
  return apiFetch<Department>(`/departments/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function deleteDepartment(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/departments/${id}`, { method: "DELETE" });
}

export function getPositions(): Promise<Position[]> {
  return apiFetch<Position[]>("/positions");
}
export function createPosition(body: { name: string }): Promise<Position> {
  return apiFetch<Position>("/positions", { method: "POST", body: JSON.stringify(body) });
}
export function updatePosition(id: string, body: { name: string }): Promise<Position> {
  return apiFetch<Position>(`/positions/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function deletePosition(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/positions/${id}`, { method: "DELETE" });
}

export function getOfficeLocations(): Promise<OfficeLocation[]> {
  return apiFetch<OfficeLocation[]>("/locations");
}
export function createOfficeLocation(body: {
  name: string;
  latitude: string | number;
  longitude: string | number;
  radius_meters: string | number;
}): Promise<OfficeLocation> {
  return apiFetch<OfficeLocation>("/locations", { method: "POST", body: JSON.stringify(body) });
}
export function updateOfficeLocation(
  id: string,
  body: {
    name: string;
    latitude: string | number;
    longitude: string | number;
    radius_meters: string | number;
  }
): Promise<OfficeLocation> {
  return apiFetch<OfficeLocation>(`/locations/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function deleteOfficeLocation(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/locations/${id}`, { method: "DELETE" });
}

export function getShifts(): Promise<Shift[]> {
  return apiFetch<Shift[]>("/shifts");
}
export function createShift(body: {
  name: string;
  start_time: string;
  end_time: string;
  tolerance_minutes: string | number;
}): Promise<Shift> {
  return apiFetch<Shift>("/shifts", { method: "POST", body: JSON.stringify(body) });
}
export function updateShift(
  id: string,
  body: {
    name: string;
    start_time: string;
    end_time: string;
    tolerance_minutes: string | number;
  }
): Promise<Shift> {
  return apiFetch<Shift>(`/shifts/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function deleteShift(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/shifts/${id}`, { method: "DELETE" });
}

export function getRoles(): Promise<Role[]> {
  return apiFetch<Role[]>("/roles");
}

export function getEmployees(): Promise<AdminEmployee[]> {
  return apiFetch<AdminEmployee[]>("/employees");
}
export function createEmployee(body: {
  name: string;
  email: string;
  password: string;
  role_id: string;
  department_id?: string | null;
  position_id?: string | null;
  supervisor_id?: string | null;
  join_date?: string | null;
}): Promise<AdminEmployee> {
  return apiFetch<AdminEmployee>("/employees", { method: "POST", body: JSON.stringify(body) });
}
export function updateEmployee(
  id: string,
  body: {
    name: string;
    department_id?: string | null;
    position_id?: string | null;
  }
): Promise<AdminEmployee> {
  return apiFetch<AdminEmployee>(`/employees/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function resignEmployee(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/employees/${id}`, { method: "DELETE" });
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
}
export function getHolidays(): Promise<Holiday[]> {
  return apiFetch<Holiday[]>("/holidays");
}
export function createHoliday(body: { date: string; name: string }): Promise<Holiday> {
  return apiFetch<Holiday>("/holidays", { method: "POST", body: JSON.stringify(body) });
}
export function deleteHoliday(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/holidays/${id}`, { method: "DELETE" });
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
}
export function getCalendarEvents(): Promise<CalendarEvent[]> {
  return apiFetch<CalendarEvent[]>("/calendar-events");
}
export function createCalendarEvent(body: {
  title: string;
  description?: string;
  event_date: string;
}): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>("/calendar-events", { method: "POST", body: JSON.stringify(body) });
}
export function updateCalendarEvent(
  id: string,
  body: { title?: string; description?: string; event_date?: string }
): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>(`/calendar-events/${id}`, { method: "PUT", body: JSON.stringify(body) });
}
export function deleteCalendarEvent(id: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>(`/calendar-events/${id}`, { method: "DELETE" });
}