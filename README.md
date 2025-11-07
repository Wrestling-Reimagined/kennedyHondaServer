# Rob's Car Site - Server

Express TypeScript server for Robert Kennedy's Honda sales portal.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
ROB_PHONE_NUMBER=your_phone_number
PORT=3001
```

3. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3001`.

## Build

To build for production:
```bash
npm run build
npm start
```

## API Endpoints

- `POST /api/leads` - Submit a new lead
  - Body: `{ name: string, email: string, phone: string, message?: string }`
  - Returns: `{ success: boolean, message: string }`

- `GET /health` - Health check endpoint

