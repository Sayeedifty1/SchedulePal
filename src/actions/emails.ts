"use server";

import { prisma } from "@/prisma";

export const getEmails = async (userId: string) =>
  prisma.email?.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
