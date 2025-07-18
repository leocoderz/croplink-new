import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "natarajmurali56@gmail.com",
    pass: "nfyo eriw yyxq ojbu", // App password
  },
};

// Create transporter
const transporter = nodemailer.createTransporter(EMAIL_CONFIG);

// Verify transporter configuration
export async function verifyEmailConfiguration() {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ Email service verification failed:", error);
    return false;
  }
}

// Send welcome email after signup
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const mailOptions = {
      from: {
        name: "CropLink Team",
        address: "natarajmurali56@gmail.com",
      },
      to: userEmail,
      subject: "🌾 Welcome to CropLink - Your Agricultural Journey Begins!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to CropLink</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; margin-bottom: 30px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🌾 CropLink</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; opacity: 0.9;">Your Agricultural Companion</p>
            </div>
            
            <!-- Welcome Message -->
            <div style="padding: 0 20px;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome, ${userName}! 🎉</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining CropLink! We're excited to help you on your agricultural journey. 
                Your account has been successfully created and you now have access to all our powerful farming tools.
              </p>
              
              <!-- Features Section -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">🚀 What you can do with CropLink:</h3>
                <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
                  <li><strong>🤖 AI Assistant</strong> - Get instant farming advice and answers</li>
                  <li><strong>🌤️ Weather Forecasts</strong> - Real-time weather updates for your location</li>
                  <li><strong>🔍 Disease Detection</strong> - Identify crop diseases with AI scanning</li>
                  <li><strong>📊 Farm Analytics</strong> - Track performance and optimize yields</li>
                  <li><strong>🏛️ Government Schemes</strong> - Discover subsidies and benefits</li>
                </ul>
              </div>
              
              <!-- Getting Started -->
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #4b5563; margin-bottom: 20px;">Ready to get started? Sign in to your account and explore!</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
                   style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; 
                          text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: bold;
                          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  Launch CropLink 🚀
                </a>
              </div>
              
              <!-- Support -->
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Need help?</strong> We're here to support you! Reply to this email or contact our support team 
                  for any questions about using CropLink.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong>The CropLink Team</strong> 🌱
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                  This email was sent because you created an account on CropLink.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to CropLink, ${userName}!
        
        Thank you for joining CropLink! We're excited to help you on your agricultural journey.
        
        What you can do with CropLink:
        • AI Assistant - Get instant farming advice and answers
        • Weather Forecasts - Real-time weather updates for your location  
        • Disease Detection - Identify crop diseases with AI scanning
        • Farm Analytics - Track performance and optimize yields
        • Government Schemes - Discover subsidies and benefits
        
        Ready to get started? Sign in to your account and explore!
        
        Need help? Reply to this email or contact our support team.
        
        Best regards,
        The CropLink Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    return { success: false, error: error.message };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetToken: string,
) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: "CropLink Security",
        address: "natarajmurali56@gmail.com",
      },
      to: userEmail,
      subject: "🔐 CropLink Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Password Reset - CropLink</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 10px; margin-bottom: 30px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🔐 CropLink</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; opacity: 0.9;">Password Reset Request</p>
            </div>
            
            <!-- Reset Message -->
            <div style="padding: 0 20px;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${userName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your CropLink account password. If you made this request, 
                click the button below to reset your password.
              </p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; 
                          text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: bold;
                          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);">
                  Reset Your Password 🔑
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p style="color: #4b5563; margin: 0 0 10px 0; font-size: 14px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="color: #3b82f6; margin: 0; word-break: break-all; font-size: 14px;">
                  ${resetUrl}
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 10px; border-left: 4px solid #ef4444;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong><br>
                  • This link will expire in 1 hour for security reasons<br>
                  • If you didn't request this reset, please ignore this email<br>
                  • Your password won't change unless you click the link above
                </p>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong>The CropLink Security Team</strong> 🛡️
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                  This email was sent because a password reset was requested for your CropLink account.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - CropLink
        
        Hi ${userName},
        
        We received a request to reset your CropLink account password.
        
        To reset your password, visit this link:
        ${resetUrl}
        
        Security Notice:
        • This link will expire in 1 hour
        • If you didn't request this reset, please ignore this email
        • Your password won't change unless you use the link above
        
        Best regards,
        The CropLink Security Team
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    return { success: false, error: error.message };
  }
}

// Test email function
export async function sendTestEmail(toEmail: string) {
  try {
    const mailOptions = {
      from: {
        name: "CropLink Test",
        address: "natarajmurali56@gmail.com",
      },
      to: toEmail,
      subject: "🧪 CropLink Email Service Test",
      html: `
        <h2>🧪 Email Service Test</h2>
        <p>This is a test email from CropLink to verify email functionality.</p>
        <p>Time: ${new Date().toISOString()}</p>
        <p>✅ If you receive this email, the service is working correctly!</p>
      `,
      text: `
        Email Service Test
        
        This is a test email from CropLink to verify email functionality.
        Time: ${new Date().toISOString()}
        
        If you receive this email, the service is working correctly!
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    return { success: false, error: error.message };
  }
}
