const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const jwt = require("jsonwebtoken"); // Import jwt for token generation

const app = express();
const port = 3005;

const allowedOrigins = [
    'http://localhost:3000',
    'https://lirisoftwebsite.onrender.com/'
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  };
  
  app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
// Import homepage API
require("./api/homepage")(app);

const SECRET_KEY = "lirisoft"; // Replace with a secure key

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Lirisoft API");
});

// Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Default credentials
  const defaultUsername = "admin@lirisoft.com";
  const defaultPassword = "Lirisoft@123";
  console.log(username, password);

  if (username === defaultUsername && password === defaultPassword) {
    // Generate a token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
