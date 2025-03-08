# Job Search App (Node.js, Express, GraphQL, MongoDB, Socket.io)
This is a Job Search Application built with Node.js, Express.js, GraphQL, and MongoDB. 
It allows users to search for jobs, apply, manage their applications, and communicate via real-time chat.

---

## Features

- **User Authentication**: Sign up, sign in, OTP confirmation, password reset.
- **Profile Management**: Update profile, upload profile and cover pictures.
- **Job Management**: Create, update, delete, and filter jobs.
- **Application Management**: Apply to jobs, update application status.
- **Company Management**: Create and update company profiles, manage job postings.
- **Real-Time Chat**: Communicate with employers or applicants.
- **Admin Features**: Ban/unban users or companies, approve companies.

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **GraphQL**: API Query Language
- **Socket.io**: Real-time communication
- **Mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: Authentication
- **multer**: File uploads
- **nodemailer**: Email service

---
## Available Scripts

Runs the application in development mode using **nodemon**. The server will restart upon changes.

```bash
npm run dev
```
---
## API Endpoints

### Auth

- POST /auth/signup: Register a new user.
- PATCH /auth/confirmOTP: Confirm OTP for registration.
- POST /auth/signIn: Authenticate user.
- PATCH /auth/forgotPassword: Request OTP for password reset.
- PATCH /auth/resetPassword: Reset user password.
- GET /auth/refresh_token: Refresh authentication token.

### User

- PATCH /user/updateProfile: Update user profile.
- GET /user/getProfile: Get user profile.
- GET /user/viewOthersProfile/:profileId: View another user's profile.
- PATCH /user/updatePassword: Update user password.
- PATCH /user/uploadProfilePic: Upload profile picture.
- PATCH /user/uploadCoverPic: Upload cover picture.
- DELETE /user/deleteProfilePic: Delete profile picture.
- DELETE /user/deleteCoverPic: Delete cover picture.
