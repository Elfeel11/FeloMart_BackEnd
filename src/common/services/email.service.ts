import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer/index.js";

@Injectable()
export class EmailService {
  private MAIL_USER: string;
  private MAIL_PASS: string;

  constructor(private _configService: ConfigService) {
    this.MAIL_USER = this._configService.get("MAIL_USER") as string;
    this.MAIL_PASS = this._configService.get("MAIL_PASS") as string;
  }
  async sendMail({
    to,
    subject,
    text,
    html,
    attachments,
  }: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Attachment[];
  }) {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: this.MAIL_USER,
        pass: this.MAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `Route <${this.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("email sended: ", info.messageId);
  }
  generateOTP() {
    return Math.ceil(Math.random() * 900000 + 100000);
  }
}
