import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface AllowedPhone {
  phone_number: string;
  name: string;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    // Path to the CSV file
    const csvPath = path.join(process.cwd(), "data", "allowed-phones.csv");

    // Read the CSV file
    const csvContent = await fs.readFile(csvPath, "utf-8");

    // Parse CSV content
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    const allowedPhones: AllowedPhone[] = [];

    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = line.split(",").map((value) => value.trim());

      // Ensure we have the required columns
      if (values.length >= 3) {
        const [phone_number, name, status] = values;

        allowedPhones.push({
          phone_number,
          name,
          status,
        });
      }
    }

    return NextResponse.json({
      success: true,
      allowedPhones: allowedPhones,
    });
  } catch (error) {
    console.error("Error reading allowed phones:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al leer números de teléfono permitidos",
        allowedPhones: [],
      },
      { status: 500 }
    );
  }
}
