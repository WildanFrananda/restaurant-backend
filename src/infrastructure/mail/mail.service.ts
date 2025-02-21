import type { Transporter } from "nodemailer"
import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"

@Injectable()
class MailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  public async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `${process.env.BASE_URL}/api/auth/verify/${token}`
    await this.transporter.sendMail({
      to: email,
      subject: "Verify your account",
      html: `Click this link to verify your email: <a href="${url}">${url}</a>`
    })
  }
}

export default MailService
