const fs = require("fs");
const path = require("path");

// Ensure express.json() middleware is added in the main server file
// app.use(express.json());

const filePath = path.join(__dirname, "/homepage.json");

module.exports = (app) => {
  // Fetch JSON data
  app.get("/api/homepage", (req, res) => {
    if (!fs.existsSync(filePath)) {
      // Create a default JSON file if not found
      const defaultData = { message: "Welcome to the homepage!"+filePath };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }
      res.json(JSON.parse(data));
    });
  });

  // Update JSON data
  app.post("/api/homepage", (req, res) => {
    const updatedData = req.body;
    if (!fs.existsSync(filePath)) {
      // Create the file if it doesn't exist
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    try {
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      res.send("JSON data updated successfully");
    } catch (err) {
      res.status(500).send("Error writing JSON file");
    }
  });
};
