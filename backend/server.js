import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'


const app = express();


const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

// App configuration
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.static("public"));
app.use(express.json());

// Routes
import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/users/user.routes.js";

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

import { loggerService } from "./services/logger.service.js";

const port = 3030;
app.listen(port, () => {
  console.log(`Server ready at port ${port}`)
  loggerService.info("Up and running on port", port);
});
