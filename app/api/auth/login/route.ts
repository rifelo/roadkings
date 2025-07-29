import { NextRequest, NextResponse } from "next/server";
import { isPhoneNumberAllowed } from "@/app/config/allowed-phones";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    // Simple validation - just check if phone number is provided
    if (!phoneNumber) {
      return NextResponse.json(
        {
          error: "Número de teléfono es requerido",
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

    // Create a simple auth token
    const authToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Return success with auth token
    return NextResponse.json({
      success: true,
      phoneNumber: phoneNumber,
      authToken: authToken,
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
