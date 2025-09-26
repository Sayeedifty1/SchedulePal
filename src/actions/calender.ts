"use server";

import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import { prisma } from "@/prisma";
import { auth } from "../../auth";
import { CalendarEvent } from "@/generated/prisma";
import { toGoogleEventRequestBody } from "@/features/calendar-events/utils";
import { CalendarEventSchedule } from "@/features/calendar-events/types";

export const getCalendarEvents = async (userId: string) =>
  prisma.calendarEvent.findMany({
    where: {
      userId,
    },
    orderBy: {
      startDate: "asc",
    },
  });

export const scheduleGoogleCalendarEvent = async (
  eventDetails: CalendarEventSchedule
) => {
  const session = await auth();
  const accessToken = session?.accessToken as string;

  if (!accessToken) throw new Error("No access token found in session");

  const OAuth = new OAuth2Client();
  OAuth.setCredentials({
    access_token: accessToken,
  });
  const calendar = google.calendar({ version: "v3", auth: OAuth });

  const requestBody = toGoogleEventRequestBody(eventDetails);

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody,
      sendUpdates: "all",
      sendNotifications: true,
    });

    console.log("Event created:", response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error("Error scheduling event:", error);
    throw new Error("Failed to schedule event");
  }
};

export const createCalendarEvent = async (eventDetails: CalendarEvent) =>
  prisma.calendarEvent.create({
    data: eventDetails,
  });
