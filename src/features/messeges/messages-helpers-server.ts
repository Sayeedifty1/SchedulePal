"use server";

import { getCurrentUser } from "../auth/user-auth-session-model.server";
import { auth } from "../../../auth";
import { createMessage } from "@/actions/messages";
import { revalidatePath } from "next/cache";

export const createMessageForCurrentUser = async ({
  role,
  message,
}: {
  role: "user" | "pal" | "assistant";
  message: string;
}) => {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }
  const user = await getCurrentUser(session);

  await createMessage({
    role,
    userId: user?.id as string,
    content: message,
  });
  revalidatePath("/dashboard");
};
