import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactSubmission = {
  isFarmer?: boolean;
  name?: string;
  org?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  province?: string;
  district?: string;
  municipality?: string;
  cooperative?: string;
  activity?: string;
  language?: string;
  enquiryType?: string;
  subject?: string;
  message?: string;
};

const clean = (value: unknown, maxLength = 4_000) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string);

const row = (label: string, value: string) =>
  `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value || "N/A")}</td></tr>`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactSubmission;
    const isFarmer = Boolean(body.isFarmer);
    const name = clean(body.name, 150);
    const email = clean(body.email, 254);
    const mobile = clean(body.mobile, 50);
    const message = clean(body.message);

    if (!name || (isFarmer ? !mobile : !email || !message)) {
      return NextResponse.json(
        { success: false, error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const smtpUser = process.env.SMTP_USER || "inquiry@kisanimpactfund.com";
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "mail.kisanimpactfund.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const recipient = process.env.CONTACT_TO || smtpUser;

    if (!smtpPass) {
      console.error("Contact email is not configured: SMTP_PASS is missing");
      return NextResponse.json(
        { success: false, error: "Email service is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    const details = isFarmer
      ? [
          ["Form type", "Farmer Interest Registration"],
          ["Full name", name],
          ["Mobile number", mobile],
          ["Province", clean(body.province, 100)],
          ["District", clean(body.district, 100)],
          ["Municipality", clean(body.municipality, 150)],
          ["Cooperative / farmer group", clean(body.cooperative, 200)],
          ["Main farming activity", clean(body.activity, 250)],
          ["Preferred language", clean(body.language, 50)],
        ]
      : [
          ["Form type", "General / Partner Enquiry"],
          ["Full name", name],
          ["Organization", clean(body.org, 200)],
          ["Email", email],
          ["Phone", clean(body.phone, 50)],
          ["Enquiry type", clean(body.enquiryType, 100)],
          ["Subject", clean(body.subject, 200)],
          ["Message", message],
        ];

    const enquiryType = clean(body.enquiryType, 100) || "General Contact";
    const submittedSubject = clean(body.subject, 200);
    const mailSubject = isFarmer
      ? `[Farmer Registration] ${name}`
      : `[${enquiryType}] ${submittedSubject || `New enquiry from ${name}`}`;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transporter.sendMail({
      from: `"Kisan Impact Fund Website" <${smtpUser}>`,
      to: recipient,
      replyTo: isFarmer || !email ? smtpUser : email,
      subject: mailSubject,
      html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172019"><div style="background:#183d24;color:#fff;padding:20px"><h2 style="margin:0">Kisan Impact Fund</h2><p style="margin:6px 0 0;color:#b4ea71">New website enquiry</p></div><table style="width:100%;border-collapse:collapse">${details.map(([label, value]) => row(label, value)).join("")}</table><p style="font-size:12px;color:#738078">Received securely via the Kisan Impact Fund contact form.</p></div>`,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully.",
    });
  } catch (error) {
    console.error("Contact email delivery failed:", error);
    return NextResponse.json(
      { success: false, error: "We could not send your enquiry. Please try again or email inquiry@kisanimpactfund.com." },
      { status: 502 },
    );
  }
}
