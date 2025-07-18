import { NextRequest, NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  verifyEmailConfiguration,
} from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Welcome email API called");

    const body = await request.json();
    const { email, name } = body;

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and name are required",
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 },
      );
    }

    console.log(`📧 Sending welcome email to: ${email} for user: ${name}`);

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

    // Send welcome email
    const result = await sendWelcomeEmail(email, name);

    if (result.success) {
      console.log(`✅ Welcome email sent successfully to ${email}`);
      return NextResponse.json({
        success: true,
        message: "Welcome email sent successfully",
        messageId: result.messageId,
      });
    } else {
      console.error(
        `❌ Failed to send welcome email to ${email}:`,
        result.error,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send welcome email",
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("❌ Welcome email API error:", error);
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

// Health check endpoint
export async function GET() {
  try {
    const isReady = await verifyEmailConfiguration();

    return NextResponse.json({
      service: "Welcome Email API",
      status: isReady ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        service: "Welcome Email API",
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
