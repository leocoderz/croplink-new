import { NextRequest, NextResponse } from "next/server";
import {
  sendPasswordResetEmail,
  verifyEmailConfiguration,
} from "@/lib/email-service";

// Simple in-memory store for reset tokens (in production, use Redis or database)
const resetTokens = new Map<
  string,
  { email: string; expires: number; used: boolean }
>();

// Generate reset token
function generateResetToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Password reset email API called");

    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
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

    console.log(`🔐 Processing password reset for: ${email}`);

    // Check if user exists (in production, check against your user database)
    // For demo purposes, we'll check localStorage-like stored users
    // In real implementation, you'd check your database here

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresIn = 1000 * 60 * 60; // 1 hour
    const expires = Date.now() + expiresIn;

    // Store reset token
    resetTokens.set(resetToken, {
      email: email.toLowerCase(),
      expires,
      used: false,
    });

    console.log(`🔑 Generated reset token for ${email}: ${resetToken}`);

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

    // Get user name (in production, fetch from database)
    const userName = email.split("@")[0]; // Simple fallback

    // Send password reset email
    const result = await sendPasswordResetEmail(email, userName, resetToken);

    if (result.success) {
      console.log(`✅ Password reset email sent successfully to ${email}`);
      return NextResponse.json({
        success: true,
        message: "Password reset email sent successfully",
        messageId: result.messageId,
      });
    } else {
      // Remove token if email failed
      resetTokens.delete(resetToken);
      console.error(
        `❌ Failed to send password reset email to ${email}:`,
        result.error,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send password reset email",
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("❌ Password reset email API error:", error);
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

// Verify reset token endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token is required",
        },
        { status: 400 },
      );
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 },
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token has already been used",
        },
        { status: 400 },
      );
    }

    if (Date.now() > tokenData.expires) {
      // Clean up expired token
      resetTokens.delete(token);
      return NextResponse.json(
        {
          success: false,
          message: "Reset token has expired",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Valid reset token",
      email: tokenData.email,
    });
  } catch (error: any) {
    console.error("❌ Token verification error:", error);
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

// Clean up expired tokens periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [token, data] of resetTokens.entries()) {
      if (now > data.expires) {
        resetTokens.delete(token);
        console.log(`🧹 Cleaned up expired reset token for ${data.email}`);
      }
    }
  },
  1000 * 60 * 15,
); // Clean up every 15 minutes
