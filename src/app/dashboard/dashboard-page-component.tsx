"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Bot, Calendar, Clock, Mail, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarEvent, Message } from "@/generated/prisma";
import { ChatMessage } from "../components/chat-message";

import { CalendarEventSchedule } from "@/features/calendar-events/types";
import { parseCalendarEvent } from "@/features/calendar-events/utils";
import { CalendarEventCard } from "../components/calendar-even-card";

const DashboardPageComponent = ({
  messages,
  calendarEvents,
}: {
  messages: Message[];
  calendarEvents: CalendarEvent[];
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [localMessages] = useState<Message[]>(messages);
  const [input, setInput] = useState("");
  const [calendarEvent, setCalendarEvent] = useState<CalendarEventSchedule>({
    title: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    attendees: [],
  });

  const [showCalendarEvent, setShowCalendarEvent] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim()) {
      processMessage(input.trim());
      setInput("");
    }
  };

  const processMessage = async (message: string) => {
    // const event = parseCalendarEvent(message);

    if (
      message.toLowerCase().includes("add meeting") ||
      message.toLowerCase().includes("schedule") ||
      message.toLowerCase().includes("meeting") ||
      message.toLowerCase().includes("set up")
    ) {
      processCalendarEvent(message);
    }
  };

  const processCalendarEvent = async (message: string) => {
    const event = parseCalendarEvent(message);
    setCalendarEvent(event);
    setShowCalendarEvent(true);
  };

  const onSaveCalendarEvent = async (eventData: CalendarEventSchedule) => {
    // Schedule a meeting titled "Tech Sync with Team"
    // starting at June 13, 2025 4:00 PM
    // ending at June 13, 2025 5:00 PM
    // with description "Discuss sprint goals and blockers."

    console.log("Saving event:", eventData);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* sidebar */}
      <DashboardSidebar />
      <div className="flex flex-col w-full flex-1 overflow-hidden">
        {/* dashboard header: h-56px */}
        <DashboardHeader></DashboardHeader>

        {/* tabs container */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <TabsList className="sticky top-14 z-10 w-full bg-white border-b h-12 p-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="size-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="size-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Clock className="size-4" /> Reminders
            </TabsTrigger>
            <TabsTrigger value="gmail" className="flex items-center gap-2">
              <Mail className="size-4" /> Gmail
            </TabsTrigger>
          </TabsList>
          <div className="flex1 overflow-y-auto px-4 pb-4 pt-14 mb-20">
            <TabsContent value="chat" className="space-y-4">
              <div className="flex-1 space-y-4 pb-4">
                {localMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messageEndRef} />
              </div>
              {showCalendarEvent && (
                <CalendarEventCard
                  initialData={calendarEvent}
                  onCancel={() => setShowCalendarEvent(false)}
                  onSave={onSaveCalendarEvent}
                />
              )}
            </TabsContent>
            <TabsContent value="calendar" className="space-y-4">
              CALENDER
            </TabsContent>
            <TabsContent value="reminders" className="space-y-4">
              REMINDERS
            </TabsContent>
            <TabsContent value="gmail" className="space-y-4">
              GMAIL
            </TabsContent>
          </div>
          <div className="fixed w-full md:w-[calc(100%-var(--sidebar-width))] left-0 md:left-[var(--sidebar-width)] bottom-0 bg-white p-4 border-t">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row sm:items-end gap-4"
            >
              {/* Message Input */}
              <div className="relative flex-1 w-full">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[80px] pr-10 resize-none"
                />
              </div>

              {/* Send button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button type="submit" className="w-fit sm:w-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPageComponent;
