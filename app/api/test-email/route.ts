import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail, verifyEmailConfiguration } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Test email API called");

    const body = await request.json();
    const { email } = body;

    // Use default email if none provided
    const testEmail = email || "natarajmurali56@gmail.com";

    console.log(`🧪 Sending test email to: ${testEmail}`);

    // Verify email service first
    const isEmailServiceReady = await verifyEmailConfiguration();
    if (!isEmailServiceReady) {
      console.error("❌ Email service not ready");
      return NextResponse.json(
        {
          success: false,
          message: "Email service is currently unavailable",
        },
        { status: 503 },
      );
    }

    // Send test email
    const result = await sendTestEmail(testEmail);

    if (result.success) {
      console.log(`✅ Test email sent successfully to ${testEmail}`);
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        recipient: testEmail,
        messageId: result.messageId,
      });
    } else {
      console.error(
        `❌ Failed to send test email to ${testEmail}:`,
        result.error,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send test email",
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("❌ Test email API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// Quick test endpoint
export async function GET() {
  try {
    console.log("🧪 Quick email service test");

    // Test with default email
    const result = await sendTestEmail("natarajmurali56@gmail.com");

    return NextResponse.json({
      service: "Test Email API",
      status: result.success ? "working" : "failed",
      message: result.success
        ? "Test email sent successfully"
        : "Failed to send test email",
      timestamp: new Date().toISOString(),
      error: result.success ? undefined : result.error,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        service: "Test Email API",
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
