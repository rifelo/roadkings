// List of allowed phone numbers that can access the application
// Add the phone numbers you want to grant access to
export const ALLOWED_PHONE_NUMBERS = [
  "+573001234567", // Example: Replace with actual allowed numbers
  "+573009876543", // Example: Replace with actual allowed numbers
  "+573106059758",
  // Add more phone numbers as needed
];

// Function to check if a phone number is allowed
export function isPhoneNumberAllowed(phoneNumber: string): boolean {
  return ALLOWED_PHONE_NUMBERS.includes(phoneNumber);
}

// Function to get all allowed phone numbers (for admin purposes)
export function getAllowedPhoneNumbers(): string[] {
  return [...ALLOWED_PHONE_NUMBERS];
}
