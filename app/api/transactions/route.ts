import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

export async function GET(request: NextRequest) {
  try {
    // Path to the CSV file
    const csvPath = path.join(process.cwd(), "data", "transactions.csv");

    // Read the CSV file
    const csvContent = await fs.readFile(csvPath, "utf-8");

    // Parse CSV content
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    const transactions: Transaction[] = [];

    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = line.split(",").map((value) => value.trim());

      // Ensure we have the required columns
      if (values.length >= 4) {
        const [date, description, amountStr, type] = values;

        // Parse amount (remove $ and convert to number)
        const amount = parseFloat(amountStr.replace("$", "").replace(",", ""));

        // Determine transaction type based on amount or type column
        let transactionType: "income" | "expense";
        if (type?.toLowerCase() === "expense" || amount < 0) {
          transactionType = "expense";
        } else {
          transactionType = "income";
        }

        transactions.push({
          id: i.toString(),
          date: date,
          description: description,
          amount: Math.abs(amount), // Store absolute value
          type: transactionType,
        });
      }
    }

    return NextResponse.json({
      success: true,
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error reading transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read transactions",
        transactions: [],
      },
      { status: 500 }
    );
  }
}
