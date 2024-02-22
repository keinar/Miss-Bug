import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'




const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};
// ======================
// configurations
// ======================
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.static("public"));
app.use(express.json());

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
const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`Server ready at port ${port}`)
  loggerService.info("Up and running on port", port);
});
