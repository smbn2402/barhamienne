export interface SmsLog {
  id?: number;
  phone: string;
  text: string;
  senderName: string;
  messageId: string;
  scheduledAt: string;
  statusId: number;
  statusDescription: string;
}
