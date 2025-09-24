"use server";

import { prisma } from "@/prisma";

export const getCalendarEvents = async (userId: string) => {
  return prisma.calendarEvent.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
  });
};
