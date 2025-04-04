const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const jwt = require("jsonwebtoken"); // Import jwt for token generation
const multer = require("multer"); // Import multer for file uploads
const fs = require("fs"); // Import fs to handle file operations
const path = require("path"); // Import path for file paths

const app = express();
const port = 3005;

const allowedOrigins = [
    'http://localhost:3000',
    'https://lirisoftwebsite.onrender.com'
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

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/", // Directory to store uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

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

// Endpoint to handle image upload
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);

  // Read and update api/homepage.json
  const homepagePath = path.join(__dirname, "api", "homepage.json");
  fs.readFile(homepagePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading api/homepage.json" });
    }

    let homepageData;
    try {
      homepageData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ message: "Error parsing api/homepage.json" });
    }

    // Save the uploaded file path
    homepageData.imagePath = filePath;

    fs.writeFile(homepagePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error saving to api/homepage.json" });
      }

      res.status(200).json({ message: "File uploaded successfully", filePath });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
