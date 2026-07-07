# Survey Platform

A full-stack survey management application built using the MERN stack. The platform allows users to create surveys, participate in surveys, manage survey data, submit responses, and review collected results through a clean and responsive interface.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Create surveys dynamically
- Add text and multiple-choice questions
- Browse available surveys
- Submit survey responses
- View previously submitted responses
- View survey results
- Edit and delete surveys
- Responsive user interface
- Centralised API service layer
- Loading, error, and empty states

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- JSON Web Tokens (JWT)
- bcrypt

## Project Structure

```text
Survey-Platform/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
└── .gitignore
```
Getting Started

Follow the steps below to run the project locally.

Prerequisites

Make sure the following are installed on your system:

Node.js
npm
MongoDB or a MongoDB Atlas account
Git
Installation
1. Clone the Repository
git clone <repository-url>

Move into the project directory:

cd Survey-Platform
2. Install Backend Dependencies

Move into the server directory:

cd server

Install the required dependencies:

npm install
3. Configure Environment Variables

Create a .env file inside the server directory.

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

Replace the placeholder values with your own configuration.

Never commit your .env file or expose sensitive credentials in the repository.

4. Start the Backend Server

For development:

npm run dev

For production:

npm start
5. Install Frontend Dependencies

Open another terminal and move into the client directory:

cd client

Install the required dependencies:

npm install
6. Start the Frontend
npm run dev

The Vite development server will display the local application URL in the terminal.

Available Scripts
Frontend
npm run dev

Starts the Vite development server.

npm run build

Creates an optimised production build.

npm run preview

Previews the production build locally.

Backend
npm run dev

Starts the backend development server using Nodemon.

npm start

Starts the backend server using Node.js.

Application Workflow
A user creates an account or signs in.
The server authenticates the user and generates a JWT.
Authenticated users can access protected application routes.
Users can create surveys containing text and multiple-choice questions.
Users can browse available surveys and submit responses.
Submitted responses are stored in MongoDB.
Users can review their previously submitted responses.
Survey creators can manage their surveys and review collected results.
Authentication

The application uses JWT-based authentication.

After successful login, the server generates a token that is used to authenticate protected API requests.

Protected requests use the following header format:

Authorization: Bearer <token>

The default token lifetime is configured as:

7d
API Overview

The backend provides API routes for:

User registration
User login
Survey creation
Survey retrieval
Survey updates
Survey deletion
Response submission
User response retrieval
Survey result retrieval
Screenshots
Dashboard

Add the dashboard screenshot here.

Survey Management

Add the survey listing screenshot here.

Create Survey

Add the create survey screenshot here.

Submitted Responses

Add the submitted responses screenshot here.

Future Improvements
Advanced survey analytics
Additional question types
Improved data visualisation
Survey search and filtering
User profile management
Survey sharing functionality
Improved mobile experience
Enhanced accessibility
Deployment and production configuration
Security
Passwords are hashed before being stored.
Authentication is handled using JSON Web Tokens.
Protected backend routes require valid authentication.
Environment variables are used for sensitive configuration.
User credentials and secrets are not committed to the repository.
Author

Abhishek Rana

B.Tech Computer Science and Engineering Student

License

This project is licensed under the ISC License.
