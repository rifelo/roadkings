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
        {
          error:
            "Formato de número de teléfono inválido. Debe ser +57XXXXXXXXX",
        },
        { status: 400 }
      );
    }

    // Check if phone number is in the allowed list
    const isAllowed = await isPhoneNumberAllowed(phoneNumber);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Acceso denegado. Este número de teléfono no está autorizado para usar esta aplicación.",
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
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
