// Interface representing an email
export interface Email {
  to: string;
  from: string;
  subject: string;
  message: string;
}
// Interface representing an email with an attachment
export interface EmailWithAttachment {
  to: string;
  from: string;
  subject: string;
  message: string;
  file: any;
}