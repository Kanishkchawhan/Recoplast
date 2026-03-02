# Recoplast

Recoplast is a full-stack web application designed to promote plastic recycling and reward users for their contributions. Users can upload details and images of collected plastic waste, schedule pickups, and earn reward coupons based on the quantity submitted. The platform features a shop where users can redeem coupons for products, an admin dashboard for managing uploads and approvals, and secure authentication for user accounts. Built with React for the frontend and Node.js/Express with MongoDB for the backend, Recoplast aims to encourage sustainable practices through technology and incentives.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Plastic Upload**: Submit plastic waste details with images
- **Pickup Scheduling**: Schedule pickups for collected plastic waste
- **Reward System**: Earn coupons based on plastic waste contributions
- **Shop & Redemption**: Redeem earned coupons for products
- **Admin Dashboard**: Manage user uploads, approvals, and platform settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

**Frontend:**

- React
- Tailwind CSS
- Axios (API client)

**Backend:**

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Recoplast
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory using `.env.example` as a template:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your MongoDB URI and JWT secret:

   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

## Running the Application

### Start Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000` (or your configured port)

### Start Frontend Application

```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
Recoplast/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── layouts/        # Layout components
│   └── public/
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Request handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── uploads/            # Uploaded files storage
└── README.md
```

## Security Notes

- Never commit `.env` files containing sensitive credentials
- Always use environment variables for secrets
- Regenerate MongoDB credentials if accidentally exposed
- Keep dependencies updated for security patches

## Contributing

Contributions are welcome! Please follow the project structure and coding conventions when submitting pull requests.

## License

This project is open source and available under the MIT License.
