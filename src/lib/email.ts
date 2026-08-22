import nodemailer from "nodemailer";

export interface StatusEmailParams {
  recipientEmail: string;
  residentName: string;
  complaintTitle: string;
  oldStatus: string;
  newStatus: string;
  note?: string;
}

export interface NoticeEmailParams {
  recipientEmail: string;
  residentName: string;
  noticeTitle: string;
  noticeContent: string;
}

// In-memory dev log for inspection when SMTP is not configured
interface DevEmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
}

const devEmailLogs: DevEmailLog[] = [];

export function getDevEmailLogs() {
  return devEmailLogs;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

export async function sendComplaintStatusEmail(params: StatusEmailParams) {
  const { recipientEmail, residentName, complaintTitle, oldStatus, newStatus, note } = params;
  const transporter = getTransporter();

  const statusColors: Record<string, string> = {
    OPEN: "#D97706",
    IN_PROGRESS: "#4F46E5",
    RESOLVED: "#166534",
  };

  const statusBgColors: Record<string, string> = {
    OPEN: "#FEF3C7",
    IN_PROGRESS: "#EEF2FF",
    RESOLVED: "#DCFCE7",
  };

  const subject = `[Status Update] ${complaintTitle} is now ${newStatus}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px; color: #292524; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EADBCC; overflow: hidden; box-shadow: 0 4px 20px rgba(90, 50, 20, 0.05); }
          .header { background: #D05A3F; color: #FFFFFF; padding: 24px; text-align: center; }
          .content { padding: 28px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; background-color: ${statusBgColors[newStatus] || "#F5EFEB"}; color: ${statusColors[newStatus] || "#292524"}; }
          .note-box { background: #FAF8F5; border-left: 4px solid #D05A3F; padding: 14px; border-radius: 8px; margin: 18px 0; font-style: italic; color: #57534E; }
          .footer { background: #F5EFEB; padding: 16px; text-align: center; font-size: 12px; color: #78716C; border-top: 1px solid #EADBCC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; font-size: 20px;">Greenview Heights</h2>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Maintenance Facility Update</p>
          </div>
          <div class="content">
            <p>Dear <strong>${residentName}</strong>,</p>
            <p>Your maintenance request status has been updated by the society administrator:</p>
            
            <div style="background: #FAF8F5; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #EADBCC;">
              <div style="font-size: 11px; font-weight: bold; color: #78716C; text-transform: uppercase;">Complaint</div>
              <div style="font-size: 16px; font-weight: bold; color: #292524; margin-top: 4px;">${complaintTitle}</div>
              <div style="margin-top: 12px;">
                <span class="badge">${newStatus}</span>
                <span style="font-size: 12px; color: #78716C; margin-left: 8px;">(Previous: ${oldStatus})</span>
              </div>
            </div>

            ${note ? `<div class="note-box"><strong>Technician Note:</strong> "${note}"</div>` : ""}

            <p style="font-size: 13px; color: #57534E; margin-top: 24px;">
              You can log in to your resident portal anytime to track the full history of this request.
            </p>
          </div>
          <div class="footer">
            Greenview Heights Resident Maintenance Portal • Automated Notification
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Greenview Facility" <maintenance@greenview.com>',
        to: recipientEmail,
        subject,
        html,
      });
      console.log(`✉️ Email sent to ${recipientEmail} for complaint status update.`);
    } catch (err) {
      console.error("Live SMTP send error:", err);
    }
  } else {
    // Dev Mode Log
    devEmailLogs.push({
      id: Math.random().toString(36).substring(7),
      to: recipientEmail,
      subject,
      body: `Status updated from ${oldStatus} -> ${newStatus}. Note: ${note || "None"}`,
      timestamp: new Date(),
    });
    console.log(`\n📬 [DEV EMAIL DISPATCH] To: ${recipientEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Status: ${oldStatus} -> ${newStatus}`);
    if (note) console.log(`   Note: ${note}\n`);
  }
}

export async function sendImportantNoticeEmail(params: NoticeEmailParams) {
  const { recipientEmail, residentName, noticeTitle, noticeContent } = params;
  const transporter = getTransporter();

  const subject = `📢 [Important Notice] ${noticeTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF8F5; margin: 0; padding: 20px; color: #292524; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EADBCC; overflow: hidden; box-shadow: 0 4px 20px rgba(90, 50, 20, 0.05); }
          .header { background: #D97706; color: #FFFFFF; padding: 24px; text-align: center; }
          .content { padding: 28px; }
          .notice-card { background: #FEF3C7; border: 1px solid #FDE68A; padding: 18px; border-radius: 12px; margin: 16px 0; color: #92400E; }
          .footer { background: #F5EFEB; padding: 16px; text-align: center; font-size: 12px; color: #78716C; border-top: 1px solid #EADBCC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; font-size: 20px;">Greenview Heights</h2>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Community Notice Board Alert</p>
          </div>
          <div class="content">
            <p>Dear <strong>${residentName}</strong>,</p>
            <p>An urgent community notice has been pinned to the society notice board:</p>
            
            <div class="notice-card">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #78350F;">📌 ${noticeTitle}</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #92400E;">${noticeContent}</p>
            </div>

            <p style="font-size: 13px; color: #57534E; margin-top: 24px;">
              Please log in to the resident portal for further details and community updates.
            </p>
          </div>
          <div class="footer">
            Greenview Heights Resident Maintenance Portal • Automated Notification
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Greenview Facility" <maintenance@greenview.com>',
        to: recipientEmail,
        subject,
        html,
      });
      console.log(`✉️ Notice broadcast sent to ${recipientEmail}.`);
    } catch (err) {
      console.error("Live SMTP notice broadcast error:", err);
    }
  } else {
    devEmailLogs.push({
      id: Math.random().toString(36).substring(7),
      to: recipientEmail,
      subject,
      body: noticeContent,
      timestamp: new Date(),
    });
    console.log(`\n📬 [DEV NOTICE EMAIL] To: ${recipientEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${noticeContent.substring(0, 100)}...\n`);
  }
}
