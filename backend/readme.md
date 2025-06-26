# StayFinder Backend

This is the backend API for the StayFinder MERN stack assignment. It is built with Node.js and Express, providing endpoints for user authentication, listing management, and user profile features.

## Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (jsonwebtoken)** – Authentication and authorization
- **Multer** – File upload middleware (for handling avatars, etc.)
- **bcryptjs** – Password hashing
- **dotenv** – Environment variable management
- **CORS** – Cross-Origin Resource Sharing middleware
- **Nodemon** – Development server auto-reloader

## Project Structure

```
backend/
  └── src/
      ├── controllers/      # Request handlers for routes
      ├── middlewares/      # Custom middleware (auth, multer)
      ├── models/           # Mongoose schemas
      ├── routes/           # API route definitions
      └── ...               # Other backend files
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file in `backend/`
   - Add necessary environment variables (DB connection string, JWT secrets, etc.)--use the .env.sample file

3. Start the server:
   ```bash
   npm start
   ```

## API Routes

### Listings Routes

| Method | Path                                | Auth        | Description                              |
|--------|-------------------------------------|-------------|------------------------------------------|
| POST   | `/api/listings/create-listing`      | JWT         | Create a new listing                     |
| GET    | `/api/listings/user-listings/:id`   | JWT         | Get all listings by a user (by user id)  |
| POST   | `/api/listings/delete-listing/:id`  | JWT         | Delete a listing (by listing id)         |
| POST   | `/api/listings/update-listing/:id`  | JWT         | Update a listing (by listing id)         |
| GET    | `/api/listings/get-listing-info/:id`| No          | Get details for a single listing         |
| GET    | `/api/listings/get-listings`        | No          | Get all listings                         |

### User Routes

| Method | Path                                 | Auth        | Description                                 |
|--------|--------------------------------------|-------------|---------------------------------------------|
| POST   | `/api/users/register`                 | No          | Register a new user                         |
| POST   | `/api/users/login`                    | No          | Login                                       |
| POST   | `/api/users/logout`                   | JWT         | Logout                                      |
| POST   | `/api/users/refresh-token`            | No          | Refresh access token                        |
| POST   | `/api/users/update-password`          | JWT         | Change password                             |
| GET    | `/api/users/current-user`             | JWT         | Get authenticated user details              |
| POST   | `/api/users/update-details`           | JWT         | Update account details                      |
| POST   | `/api/users/update-avatar`            | No          | Update user avatar (multipart/form-data)    |
| POST   | `/api/users/delete-user`              | JWT         | Delete user account                         |
| GET    | `/api/users/getUserInfo/:id`          | JWT         | Get public info for a user (by id)          |

> **Note:**  
> - **JWT** = Requires JSON Web Token authentication (via `Authorization` header).
> - Some routes require multipart form data for file uploads (e.g., avatar).

## Middleware

- **Authentication:** JWT-based, see `auth.middleware.js`
- **File Uploads:** Handled by Multer, see `multer.middleware.js`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](../LICENSE)
