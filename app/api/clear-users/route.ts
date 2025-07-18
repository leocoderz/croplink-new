import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🧹 Clear users API called");

    // Since this is a client-side storage system, we'll return instructions
    // for clearing localStorage data

    return NextResponse.json({
      success: true,
      message: "To clear stored users, run this in your browser console:",
      instructions: [
        'localStorage.removeItem("croplink-users")',
        'localStorage.removeItem("agri-app-user")',
        'localStorage.removeItem("croplink-user")',
        'localStorage.removeItem("agri-app-token")',
        'localStorage.removeItem("croplink-token")',
        'localStorage.removeItem("croplink-notifications")',
        'localStorage.removeItem("croplink-farm-data")',
        "localStorage.clear() // Or this to clear everything",
      ],
      note: "After clearing, refresh the page to start fresh",
    });
  } catch (error: any) {
    console.error("❌ Clear users API error:", error);
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

// Get current stored users (for debugging)
export async function GET() {
  try {
    return NextResponse.json({
      message: "This endpoint shows instructions for checking stored data",
      instructions: [
        "Open browser console and run:",
        'JSON.parse(localStorage.getItem("croplink-users") || "[]")',
        "This will show all stored user accounts",
      ],
      clearInstructions: [
        "To clear all data, run:",
        "localStorage.clear()",
        "Then refresh the page",
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
