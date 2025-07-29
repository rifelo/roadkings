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
- 📊 CSV-based data management

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Allowed Phone Numbers

Edit `data/allowed-phones.csv` to manage authorized users:

```csv
phone_number,name,status
+573001234567,John Doe,active
+573009876543,Jane Smith,active
+573001112223,Bob Johnson,active
+573004445556,Alice Brown,active
```

**CSV Format:**
- `phone_number`: Colombian phone number (+57XXXXXXXXX)
- `name`: User's name for reference
- `status`: "active" for allowed users, "inactive" to disable access

### 3. Configure Transaction Data

Edit `data/transactions.csv` to manage your transaction data:

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
- `GET /api/auth/allowed-phones`: Get allowed phone numbers from CSV file

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
│   ├── check-session/route.ts   # Check session
│   └── allowed-phones/route.ts  # Allowed phones API
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
    ├── allowed-phones.csv       # Allowed phone numbers
    └── transactions.csv          # Transaction data file
```

## Managing Users

To add or modify authorized users, edit the `data/allowed-phones.csv` file:

1. **Add new users**: Add new rows to the CSV file
2. **Modify existing users**: Edit the values in the CSV file
3. **Disable users**: Change status to "inactive"
4. **Remove users**: Delete rows from the CSV file

**Example:**
```csv
phone_number,name,status
+573001234567,John Doe,active
+573009876543,Jane Smith,inactive
+573001112223,Bob Johnson,active
```

## Managing Transactions

To add or modify transactions, edit the `data/transactions.csv` file:

1. **Add new transactions**: Add new rows to the CSV file
2. **Modify existing transactions**: Edit the values in the CSV file
3. **Remove transactions**: Delete rows from the CSV file

The application will automatically read the updated CSV files and display the new data.

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
   - Add the phone number to the `data/allowed-phones.csv` file
   - Ensure the phone number format is correct (+57XXXXXXXXX)
   - Check that the status is set to "active"

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

5. **"Failed to read allowed phones"**
   - Ensure the `data/allowed-phones.csv` file exists
   - Check that the CSV format is correct
   - Verify file permissions

## License

This project is licensed under the MIT License.
