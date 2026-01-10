import { EmailDraft } from "./types";

export const parseEmailDraft = (message: string): EmailDraft => {
  const toMatch = message.match(/to\s+([^\s]+@[^\s]+)(?=\s|$)/i);
  const subjectMatch = message.match(/subject\s*["'](.+?)["']/i);
  const bodyMatch = message.match(/body\s*["']([\s\S]+?)["']/i);

  return {
    to: toMatch ? toMatch[1].trim() : "",
    subject: subjectMatch ? subjectMatch[1].trim() : "No Subject",
    body: bodyMatch ? bodyMatch[1].trim() : "",
  };
};
