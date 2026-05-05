import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || "my_super_secret_key_for_assignment";

// Middleware
app.use(cors());
app.use(express.json());

// Dummy User Data (For Assignment)
const DUMMY_USER = {
  username: "admin",
  password: "password123"
};

/**
 * LOGIN ROUTE
 * Takes username and password, returns a JWT if valid.
 */
app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log(`Login attempt for: ${username}`);

  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    // Generate JWT Token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({
      success: true,
      message: "Login successful!",
      token: token
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }
});

/**
 * PROTECTED DASHBOARD ROUTE
 * Requires a valid JWT token in the Authorization header.
 */
app.get("/api/dashboard", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      message: "Welcome to the Secure Dashboard!",
      user: decoded,
      stats: {
        lastLogin: new Date().toLocaleString(),
        activeSessions: 1,
        systemStatus: "Healthy"
      }
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
