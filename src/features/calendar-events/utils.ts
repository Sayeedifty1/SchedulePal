import { CalendarEventSchedule } from "./types";
import { parse, isValid, format } from "date-fns";

export const parseCalendarEvent = (message: string): CalendarEventSchedule => {
  const titleMatch = message.match(/titled\s*['"](.+?)['"]/i);
  const startMatch = message.match(
    /(?:starting|start)\s+at\s+(.+?)(?=\s+(?:ending|end|located|with|$))/i
  );
  const endMatch = message.match(
    /(?:ending|end)\s+at\s+(.+?)(?=\s+(?:located|with|$))/i
  );
  const locationMatch = message.match(/located\s+at\s+(.+?)(?=\s+with|$)/i);
  const descMatch = message.match(/with\s+description\s*['"](.+?)['"]/i);
  const parseDT = (str: string): Date | null => {
    for (const fmt of [
      "MMMM d, yyyy h:mm a", // April 13, 2025 4:00 PM
      "yyyy-MM-dd h:mm a", // 2025-04-13 4:00 PM
      "yyyy-MM-dd'T'HH:mm", // 2025-04-13T16:00
    ]) {
      const dt = parse(str.trim(), fmt, new Date());
      if (isValid(dt)) return dt;
    }
    return null;
  };

  const now = new Date();
  const sDt = parseDT(startMatch?.[1] || "") ?? now;
  const eDt =
    parseDT(endMatch?.[1] || "") ?? new Date(sDt.getTime() + 60 * 60 * 1000); // default 1 hour
  return {
    title: titleMatch ? titleMatch[1].trim() : "New Meeting",
    location: locationMatch ? locationMatch[1].trim() : "TBD",
    description: descMatch ? descMatch[1].trim() : "Created by your Pal",
    startDate: format(sDt, "yyyy-MM-dd"),
    endDate: format(eDt, "yyyy-MM-dd"),
    startTime: format(sDt, "HH:mm"),
    endTime: format(eDt, "HH:mm"),
    attendees: [],
  };
};
