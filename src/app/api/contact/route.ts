import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone is required" }),
  organization: z.string().min(1, { message: "Organization is required" }),
  description: z.string().min(1, { message: "description is required" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactFormSchema.parse(body);


    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { success: false, message: "Email service configuration error" },
        { status: 500 }
      );
    }

    const CLIENT_EMAIL = process.env.SMTP_CLIENT || process.env.SMTP_USER;

    console.log('Creating Gmail transporter...');
    const transporter = nodemailer.createTransport({

      host:process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure:process.env.SMTP_SECURE === 'true',

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

  
    try {
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP connection failed:', verifyError);
      return NextResponse.json(
        { success: false, message: "Email service connection failed" },
        { status: 500 }
      );
    }


    const messageHtml = `

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
            <!-- Header -->
            <div style="background-color: #00E600; color: black; padding: 20px; border-radius: 8px 8px 0 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">New Contact Form Submission</h2>
                            <p style="margin: 5px 0 0 0; opacity: 0.8;">Medi Jobs Website</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Content -->
            <div style="padding: 20px;">
                <h3 style="color: #00E600; border-bottom: 2px solid #00E600; padding-bottom: 10px; font-weight: bold; margin-top: 0;">Customer Details</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #0c0d0c; width: 30%;">First Name:</td>
                        <td style="padding: 8px 0;">${validatedData.firstName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #0c0d0c; width: 30%;">Last Name:</td>
                        <td style="padding: 8px 0;">${validatedData.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #0c0d0c;">Organization:</td>
                        <td style="padding: 8px 0;">${validatedData.organization}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #0c0d0c;">Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:${validatedData.email}" style="color: #0c0d0c; text-decoration: none;">${validatedData.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #0c0d0c;">Phone:</td>
                        <td style="padding: 8px 0;"><a href="tel:${validatedData.phone}" style="color: #0c0d0c; text-decoration: none;">${validatedData.phone}</a></td>
                    </tr>
                </table>

                <h3 style="color: #FFC30F; border-bottom: 2px solid #FFC30F; padding-bottom: 10px; font-weight: bold;">description</h3>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FFC30F;">
                    <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${validatedData.description}</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #e0e0e0; text-align: center; background-color: #f9f9f9;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                    This is an automated message from your Medi Jobs website contact form.<br/>
                    Received on ${new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })} (Colombo Time)
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Medi Jobs Contact Form" <${process.env.SMTP_USER}>`,
      to: CLIENT_EMAIL,
      replyTo: validatedData.email,
      subject: `New Contact Form Submission - ${validatedData.firstName + ' ' + validatedData.lastName}`,
      text: `
New Contact Form Submission from Medi Jobs Website

Customer Details:
Name: ${validatedData.firstName + ' ' + validatedData.lastName}
Organization: ${validatedData.organization}
Email: ${validatedData.email}
Phone: ${validatedData.phone}

Discription:
${validatedData.description}

---
You can reply directly to this email to respond to the customer.
Received: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
      `,
      html: messageHtml
    };

    console.log('Sending email to:', CLIENT_EMAIL);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    if (process.env.SEND_CUSTOMER_CONFIRMATION === 'true') {
      const customerConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You - Medi Jobs</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #E6FFB3; border: 1px solid #e0e0e0; border-radius: 8px;">
              <!-- Header -->
              <div style="background-color: #FFC30F; color: black; padding: 20px; border-radius: 8px 8px 0 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                          <td>
                              <h2 style="margin: 0; font-size: 24px; font-weight: bold;">Thank You for Contacting Medi Jobs!</h2>
                          </td>
                          
                      </tr>
                  </table>
              </div>
              
              <!-- Content -->
              <div style="padding: 20px;">
                  <p style="font-size: 16px; color: #0000; margin-top: 0;">Dear ${validatedData.firstName + ' ' + validatedData.lastName},</p>
                  
                  <p style="line-height: 1.6; color: #555;">
                      Thank you for reaching out to Medi Jobs! We have received your enquiry about <strong style="color: #FFC30F;">${validatedData.organization}</strong> and our team will get back to you within 24 hours.
                  </p>
                  
                  <p style="line-height: 1.6; color: #0000;">
                      We're excited to help you build a digital experience that delivers! Our experienced team will provide you with personalized recommendations and assist you with all your needs.
                  </p>
                  
                  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC30F;">
                      <p style="margin: 0; font-size: 14px; color: #666;">
                          📞 <strong>Need immediate assistance?</strong><br/>
                          Email: <a href="mailto:medijobs.lk@gmail.com" style="color: #FFC30F; text-decoration: none;">medijobs.lk@gmail.com</a><br/>
                          Phone: <a href="tel:+94 777 31 21 32" style="color: #FFC30F; text-decoration: none;">+94 777 31 21 32</a>
                      </p>
                  </div>
                  
                  <p style="line-height: 1.6; color: #555; margin-bottom: 0;">
                      Best regards,<br/>
                      <strong>Medi Jobs Team</strong><br/>
                      <span style="color: #FFC30F; font-weight: bold;">The Heartbeat of Medical Hiring</span>
                  </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #e0e0e0; text-align: center; background-color: #f9f9f9;">
                  <p style="color: #888; font-size: 12px; margin: 0;">
                      This is an automated confirmation email.<br/>
                      Please do not reply to this email.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `;

      const customerConfirmation = {
        from: `"Medi Jobs" <${process.env.SMTP_USER}>`,
        to: validatedData.email,
        subject: "Thank you for contacting Medi Jobs - We'll be in touch soon!",
        html: customerConfirmationHtml,
        text: `
Dear ${validatedData.firstName + ' ' + validatedData.lastName},

Thank you for contacting Medi Jobs! We have received your enquiry about ${validatedData.organization} and will get back to you within 24 hours.

We're excited to help you build a digital experience that delivers!

Need immediate assistance?
Email: medijobs.lk@gmail.com
Phone: +94 77 345 6789

Best regards,
Medi Jobs Team
The Heartbeat of Medical Hiring
        `
      };

      try {
        console.log('Sending confirmation email to customer...');
        await transporter.sendMail(customerConfirmation);
        console.log('Confirmation email sent successfully');
      } catch (confirmationError) {
        console.error('Failed to send confirmation email:', confirmationError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      details: {
        sentTo: CLIENT_EMAIL,
        messageId: info.messageId,
        customerConfirmation: process.env.SEND_CUSTOMER_CONFIRMATION === 'true'
      }
    });

  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('EAUTH') || error.message.includes('authentication')) {
        return NextResponse.json(
          { success: false, message: "Email authentication failed. Please check your Gmail credentials." },
          { status: 500 }
        );
      }

      if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
        return NextResponse.json(
          { success: false, message: "Email server connection failed. Please check your internet connection." },
          { status: 500 }
        );
      }

      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { success: false, message: "Invalid Gmail credentials. Please check your app password." },
          { status: 500 }
        );
      }

      if (error.message.includes('EENVELOPE') || error.message.includes('RCPT TO')) {
        return NextResponse.json(
          { success: false, message: "Invalid recipient email address." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email. Please try again later.",
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}