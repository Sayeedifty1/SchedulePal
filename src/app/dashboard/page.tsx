import { getCurrentUser } from "@/features/auth/user-auth-session-model.server";
import DashboardPageComponent from "./dashboard-page-component";
import { auth } from "../../../auth";
import { createAssistantDefaultMessage, getMessages } from "@/actions/messages";

const Dashboard = async () => {
  const session = await auth();
  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }
  const user = await getCurrentUser(session);
  if (!user) {
    return <div>User not found.</div>;
  }

  if (user.messages.length === 0) {
    // create a default message for the user
    await createAssistantDefaultMessage(user.id);
  }

  const [messages] = await Promise.all([getMessages(user.id)]);
  return <DashboardPageComponent messages={messages} />;
};

export default Dashboard;
