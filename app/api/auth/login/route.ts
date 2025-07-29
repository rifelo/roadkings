import { NextRequest, NextResponse } from "next/server";
import { isPhoneNumberAllowed } from "@/app/config/allowed-phones";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    // Validate phone number format (+57XXXXXXXXX)
    if (
      !phoneNumber ||
      !phoneNumber.startsWith("+57") ||
      phoneNumber.length !== 13
    ) {
      return NextResponse.json(
        { error: "Invalid phone number format. Must be +57XXXXXXXXX" },
        { status: 400 }
      );
    }

    // Check if phone number is in the allowed list
    if (!isPhoneNumberAllowed(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Access denied. This phone number is not authorized to use this application.",
        },
        { status: 403 }
      );
    }

    // Create a simple session (in production, use proper session management)
    const sessionToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Store authenticated user (in production, use a database)
    global.authenticatedUsers = global.authenticatedUsers || new Map();
    global.authenticatedUsers.set(sessionToken, {
      phoneNumber,
      authenticatedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
