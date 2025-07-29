import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Check if session exists and is valid
    const userData = global.authenticatedUsers?.get(sessionToken);

    if (!userData) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Check if session has expired (24 hours)
    const now = Date.now();
    const sessionAge = now - userData.authenticatedAt;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (sessionAge > twentyFourHours) {
      global.authenticatedUsers.delete(sessionToken);
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      phoneNumber: userData.phoneNumber,
      authenticatedAt: userData.authenticatedAt,
    });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}
