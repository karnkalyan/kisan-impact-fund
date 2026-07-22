import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Candidate SMTP configurations to try in sequence
    const configs = [
      { host: process.env.SMTP_HOST || "s11638.sgp1.stableserver.net", port: 587, secure: false },
      { host: process.env.SMTP_HOST || "s11638.sgp1.stableserver.net", port: 465, secure: true },
      { host: "mail.kisanimpactfund.com", port: 587, secure: false },
      { host: "mail.kisanimpactfund.com", port: 465, secure: true },
      { host: "127.0.0.1", port: 587, secure: false },
      { host: "127.0.0.1", port: 25, secure: false },
    ];

    let lastError: Error | null = null;
    let sent = false;

    for (const config of configs) {
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 10000,
          tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
          from: `"Kisan Impact Fund Enquiry" <${user}>`,
          to: "info@kisanimpactfund.com",
          replyTo: email || undefined,
          subject: mailSubject,
          html: htmlContent,
        });

        sent = true;
        console.log(`Email sent successfully via ${config.host}:${config.port}`);
        break;
      } catch (err: any) {
        console.warn(`SMTP send attempt failed for ${config.host}:${config.port}:`, err?.message);
        lastError = err;
      }
    }

    if (!sent) {
      throw lastError || new Error("Failed to connect to SMTP server");
    }

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
