# Code-Helper-Extension

A Chrome extension with a React frontend and Node.js/Express backend, designed to assist users with code-related tasks. The backend provides user authentication and AI-powered services, while the frontend offers a user-friendly interface for interaction.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (signup, login, verification)
- AI-powered code assistance (via backend service)
- User history tracking
- Chrome extension integration
- Responsive and modern UI with React and Tailwind CSS

---

## Project Structure

```
Helper/
  backend/         # Node.js/Express backend (API, DB, auth, AI)
    config/        # Database configuration
    controller/    # Route controllers (user, AI)
    middleware/    # Custom middleware (user details, auth)
    models/        # Mongoose models (User, Question)
    routes/        # Express routes (user)
    services/      # AI service logic
    index.js       # Entry point
    package.json
  frontend/        # React frontend (Chrome extension)
    public/        # Static assets, manifest, icons
    src/
      components/  # Navbar, Signup, Verify, Spinner
      pages/       # Home, LoginSign, History
      assets/      # Images
      App.js       # Main app logic
      index.js     # Entry point
    package.json
  README.md
```

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in `backend/` with at least:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Adjust CORS origin in `index.js` if your extension ID changes.

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` (or the port you set).

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in `frontend/` if needed (for API URLs, etc.).

3. **Run the React app (for development):**
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000` by default.

4. **Build for Chrome Extension:**
   ```bash
   npm run build
   ```
   - The build output can be loaded as an unpacked extension in Chrome.

---

## Usage

- **Authentication:** Sign up and log in via the extension popup.
- **AI Assistance:** Use the extension to interact with AI-powered features.
- **History:** View your previous queries and results.
- **Chrome Extension:** Load the `frontend/build` directory as an unpacked extension in Chrome.

---

## Development

- **Backend:** Node.js, Express, MongoDB, JWT, CORS, Mongoose
- **Frontend:** React, Tailwind CSS, React Router, Chrome Extension APIs

### Key Scripts

**Backend:**
- `npm start` — Start the Express server

**Frontend:**
- `npm start` — Start React dev server
- `npm run build` — Build for production/extension

---

## Environment Variables

### Backend (`backend/.env`)
- `PORT` — Port for Express server (default: 5000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT authentication

### Frontend (`frontend/.env`)
- (Add as needed, e.g., `REACT_APP_API_URL`)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) (or your preferred license)

---

Let me know if you want to add more details (e.g., API endpoints, extension publishing steps, or screenshots). If you have a specific license or contribution guideline, let me know to include it!
