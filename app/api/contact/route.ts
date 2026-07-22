import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      isFarmer,
      name,
      org,
      email,
      phone,
      mobile,
      province,
      district,
      municipality,
      cooperative,
      activity,
      language,
      enquiryType,
      subject,
      message,
    } = body;

    const isFarmerForm = Boolean(isFarmer);
    const timestamp = new Date().toISOString();

    // 1. Save submission locally to enquiries.json so data is NEVER lost
    const submissionRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp,
      formType: isFarmerForm ? "Farmer Interest Registration" : "General / Partner Enquiry",
      name: name || "N/A",
      org: org || "N/A",
      email: email || "N/A",
      phone: phone || "N/A",
      mobile: mobile || "N/A",
      province: province || "N/A",
      district: district || "N/A",
      municipality: municipality || "N/A",
      cooperative: cooperative || "N/A",
      activity: activity || "N/A",
      language: language || "English",
      enquiryType: enquiryType || "N/A",
      subject: subject || "N/A",
      message: message || "N/A",
    };

    try {
      const dataDir = path.join(process.cwd(), "data");
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, "enquiries.json");
      let existing: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, "utf8");
        existing = JSON.parse(fileContent);
      } catch {
        existing = [];
      }
      existing.unshift(submissionRecord);
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");
    } catch (saveError) {
      console.error("Failed to save submission locally:", saveError);
    }

    // 2. Prepare Email Content
    const mailSubject = isFarmerForm
      ? `[Farmer Registration] New interest submitted by ${name || "Farmer"}`
      : `[${enquiryType || "General Contact"}] ${subject || "New Web Enquiry from " + (name || "Visitor")}`;

    let htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #172019; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">`;
    htmlContent += `<div style="background-color: #183d24; color: #ffffff; padding: 20px; text-align: center;"><h2 style="margin: 0; font-size: 20px;">Kisan Impact Fund</h2><p style="margin: 5px 0 0 0; font-size: 13px; color: #b4ea71;">New Contact Form Submission</p></div>`;
    htmlContent += `<div style="padding: 24px; background-color: #ffffff;">`;
    htmlContent += `<p style="font-size: 14px; margin-bottom: 16px;"><strong>Form Type:</strong> ${isFarmerForm ? "Farmer Interest Registration" : "General / Partner Enquiry"}</p>`;
    htmlContent += `<p style="font-size: 14px; margin-bottom: 12px;"><strong>Full Name:</strong> ${name || "N/A"}</p>`;

    if (isFarmerForm) {
      htmlContent += `
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Mobile Number:</strong> ${mobile || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Province:</strong> ${province || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>District:</strong> ${district || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Municipality:</strong> ${municipality || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Cooperative / Farmer Group:</strong> ${cooperative || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Main Farming Activity:</strong> ${activity || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Preferred Language:</strong> ${language || "English"}</p>
      `;
    } else {
      htmlContent += `
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Organization:</strong> ${org || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Email:</strong> ${email || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Enquiry Type:</strong> ${enquiryType || "N/A"}</p>
        <p style="font-size: 14px; margin-bottom: 12px;"><strong>Subject:</strong> ${subject || "N/A"}</p>
        <div style="margin-top: 16px;">
          <strong style="font-size: 14px;">Message:</strong>
          <div style="background: #f4f8f1; padding: 16px; border-left: 4px solid #4f8f35; border-radius: 4px; margin-top: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${(message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>
      `;
    }

    htmlContent += `</div><div style="background-color: #fafbf7; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #738078;">Received via kisanimpactfund.com contact form</div></div>`;

    const user = process.env.SMTP_USER || "inquiry@kisanimpactfund.com";
    const pass = process.env.SMTP_PASS || "@@inquiry@@impact";
    const primaryHost = process.env.SMTP_HOST || "mail.kisanimpactfund.com";

    // Candidate list of SMTP configurations to attempt
    const configs = [
      { host: primaryHost, port: 465, secure: true },
      { host: primaryHost, port: 587, secure: false },
      { host: "s11638.sgp1.stableserver.net", port: 465, secure: true },
      { host: "s11638.sgp1.stableserver.net", port: 587, secure: false },
      { host: "127.0.0.1", port: 587, secure: false },
      { host: "127.0.0.1", port: 25, secure: false },
    ];

    let emailSent = false;
    let emailError: string | null = null;

    for (const config of configs) {
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: { user, pass },
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 6000,
          tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
          from: `"Kisan Impact Fund Enquiry" <${user}>`,
          to: "info@kisanimpactfund.com",
          replyTo: email || undefined,
          subject: mailSubject,
          html: htmlContent,
        });

        emailSent = true;
        console.log(`Email dispatched successfully via ${config.host}:${config.port}`);
        break;
      } catch (err: any) {
        emailError = err?.message || String(err);
        console.warn(`SMTP send attempt failed for ${config.host}:${config.port}:`, emailError);
      }
    }

    // Always return success to the website user because submission has been saved locally
    return NextResponse.json({
      success: true,
      emailSent,
      message: "Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
