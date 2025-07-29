# RoadKings - Phone Number Whitelist Authentication

A Next.js application with phone number whitelist authentication for authorized users.

## Features

- 🔐 Simple phone number authentication
- 📱 Colombian phone numbers (+57) support
- 🛡️ Protected routes with session management
- 🎨 Modern, responsive UI
- ⚡ Instant login for authorized users
- 📋 Whitelist-based access control

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

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

1. **Login Page** (`/login`): Users enter their Colombian phone number (+57XXXXXXXXX)
2. **Whitelist Check**: System verifies if the phone number is in the allowed list
3. **Access**: If authorized, users are immediately logged in and can access the protected main page
4. **Session Management**: Users stay logged in for 24 hours

## API Endpoints

- `POST /api/auth/login`: Authenticate user with phone number
- `POST /api/auth/check-session`: Check if user session is valid

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
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── config/
│   └── allowed-phones.ts        # Whitelist configuration
├── login/
│   └── page.tsx                 # Login page
└── page.tsx                     # Protected main page
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

## Production Considerations

- Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
- Implement proper session management (JWT, Redis, etc.)
- Add rate limiting to prevent abuse
- Use HTTPS in production
- Consider implementing phone number validation with a service like Twilio's Lookup API
- Store whitelist in a database for easier management

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

## License

This project is licensed under the MIT License.
