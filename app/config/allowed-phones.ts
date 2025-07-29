import { promises as fs } from "fs";
import path from "path";

interface AllowedPhone {
  phone_number: string;
  name: string;
  status: string;
}

// Function to normalize phone number for comparison
function normalizePhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // If it starts with 57 (country code), remove it to get just the phone number
  if (digitsOnly.startsWith("57") && digitsOnly.length > 10) {
    return digitsOnly.substring(2);
  }

  return digitsOnly;
}

// Function to check if a phone number is allowed
export async function isPhoneNumberAllowed(
  phoneNumber: string
): Promise<boolean> {
  try {
    const csvPath = path.join(process.cwd(), "data", "allowed-phones.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");
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

    // Normalize the input phone number
    const normalizedInput = normalizePhoneNumber(phoneNumber);

    // Check if phone number exists and is active
    return allowedPhones.some((phone: AllowedPhone) => {
      const normalizedStored = normalizePhoneNumber(phone.phone_number);
      return normalizedStored === normalizedInput && phone.status === "active";
    });
  } catch (error) {
    console.error("Error checking allowed phones:", error);
    return false;
  }
}

// Function to get all allowed phone numbers (for admin purposes)
export async function getAllowedPhoneNumbers(): Promise<string[]> {
  try {
    const csvPath = path.join(process.cwd(), "data", "allowed-phones.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");
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

    return allowedPhones
      .filter((phone: AllowedPhone) => phone.status === "active")
      .map((phone: AllowedPhone) => normalizePhoneNumber(phone.phone_number));
  } catch (error) {
    console.error("Error getting allowed phones:", error);
    return [];
  }
}
