# RoadKings - Phone Number Whitelist Authentication

A Next.js application with phone number whitelist authentication for authorized users.

## Features

- 🔐 Simple phone number authentication
- 📱 Colombian phone numbers (+57) support
- 🛡️ Protected routes with session management
- 🎨 Modern, responsive UI
- ⚡ Instant login for authorized users
- 📋 Whitelist-based access control
- 💰 Finance portal with transaction tracking
- 📊 CSV-based transaction data management

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Allowed Phone Numbers

Edit `app/config/allowed-phones.ts` and add the phone numbers you want to grant access to:

```typescript
export const ALLOWED_PHONE_NUMBERS = [
  "+573001234567", // Replace with actual allowed numbers
  "+573009876543", // Replace with actual allowed numbers
  // Add more phone numbers as needed
];
```

### 3. Configure Transaction Data

Edit `data/transactions.csv` to manage your transaction data. The CSV should have the following format:

```csv
date,description,amount,type
Jan 14, 2024,Monthly Dues - January,$2500.00,income
Jan 17, 2024,Bike Maintenance Fund,$800.00,income
Jan 21, 2024,Club Event - Charity Ride,$1200.00,income
Jan 24, 2024,Fuel for Group Ride,$150.00,expense
Jan 31, 2024,Club Merchandise Sales,$650.00,income
```

**CSV Format:**
- `date`: Transaction date (e.g., "Jan 14, 2024")
- `description`: Transaction description
- `amount`: Amount with $ symbol (e.g., "$2500.00")
- `type`: Transaction type ("income" or "expense")

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

1. **Login Page** (`/login`): Users enter their Colombian phone number (+57XXXXXXXXX)
2. **Whitelist Check**: System verifies if the phone number is in the allowed list
3. **Access**: If authorized, users are immediately logged in and can access the protected main page
4. **Finance Portal**: Users can view transaction history and financial summaries
5. **Session Management**: Users stay logged in for 24 hours

## API Endpoints

- `POST /api/auth/login`: Authenticate user with phone number
- `POST /api/auth/check-session`: Check if user session is valid
- `GET /api/transactions`: Get transaction data from CSV file

## Security Features

- ✅ Phone number format validation (+57XXXXXXXXX)
- ✅ Whitelist-based access control
- ✅ 24-hour session expiration
- ✅ Secure session token generation
- ✅ Automatic redirect for authenticated users

## File Structure

```
app/
├── api/auth/
│   ├── login/route.ts           # Phone number authentication
│   └── check-session/route.ts   # Check session
├── api/
│   └── transactions/route.ts     # Transaction data API
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── config/
│   └── allowed-phones.ts        # Whitelist configuration
├── login/
│   └── page.tsx                 # Login page
├── page.tsx                     # Protected main page
└── data/
    └── transactions.csv          # Transaction data file
```

## Adding New Users

To grant access to new users, simply add their phone numbers to the `ALLOWED_PHONE_NUMBERS` array in `app/config/allowed-phones.ts`:

```typescript
export const ALLOWED_PHONE_NUMBERS = [
  "+573001234567", // Existing user
  "+573009876543", // Existing user
  "+573001112223", // New user
  "+573004445556", // New user
];
```

## Managing Transactions

To add or modify transactions, edit the `data/transactions.csv` file:

1. **Add new transactions**: Add new rows to the CSV file
2. **Modify existing transactions**: Edit the values in the CSV file
3. **Remove transactions**: Delete rows from the CSV file

The application will automatically read the updated CSV file and display the new transaction data.

## Production Considerations

- Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
- Implement proper session management (JWT, Redis, etc.)
- Add rate limiting to prevent abuse
- Use HTTPS in production
- Consider implementing phone number validation with a service like Twilio's Lookup API
- Store whitelist in a database for easier management
- Consider using a database for transactions instead of CSV files

## Troubleshooting

### Common Issues

1. **"Access denied. This phone number is not authorized"**
   - Add the phone number to the `ALLOWED_PHONE_NUMBERS` array
   - Ensure the phone number format is correct (+57XXXXXXXXX)

2. **"Invalid phone number format"**
   - Phone numbers must be in format: +57XXXXXXXXX
   - Must be exactly 13 characters (+57 + 10 digits)

3. **"Network error"**
   - Check your internet connection
   - Ensure the development server is running

4. **"Failed to read transactions"**
   - Ensure the `data/transactions.csv` file exists
   - Check that the CSV format is correct
   - Verify file permissions

## License

This project is licensed under the MIT License.
