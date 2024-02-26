import express from "express";
import cors from "cors";
import path from 'path';
import cookieParser from 'cookie-parser'

// ======================
// configurations
// ======================
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

// Routes
import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/users/user.routes.js";
import { authRoutes } from './api/auth/auth.routes.js'


// ======================
// end points
// ======================
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


// ======================
// fronend end point
// ======================
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public'))
})

import { loggerService } from "./services/logger.service.js";
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 5175;
app.listen(PORT, () => {
  console.log(`Server ready at port ${PORT}`)
  loggerService.info("Up and running on port", PORT);
});
