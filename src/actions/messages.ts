"use server";

import { prisma } from "@/prisma";

// create message
export const createAssistantDefaultMessage = async (userId: string) => {
  return prisma.message.create({
    data: {
      role: "assistant",
      content: "Hello! Your Pal is here! How can I assist you today?",
      userId,
    },
  });
};

// Read messages
export const getMessages = async (userId: string) => {
  return prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
};
