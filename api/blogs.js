const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "/blogs.json");

module.exports = (app) => {
  // Get all blogs
  app.get("/api/blogs", (req, res) => {
    if (!fs.existsSync(filePath)) {
      const defaultData = { blogs: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading blogs file");
      }
      res.json(JSON.parse(data));
    });
  });

  // Get single blog by ID
  app.get("/api/blogs/:id", (req, res) => {
    const blogId = req.params.id;

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Blog not found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading blogs file");
      }

      let blogsData;
      try {
        blogsData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing blogs file");
      }

      const blog = blogsData.blogs.find((b) => b.id === blogId);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }

      res.json(blog);
    });
  });

  // Create new blog
  app.post("/api/blogs", (req, res) => {
    const newBlog = req.body;

    if (!fs.existsSync(filePath)) {
      const defaultData = { blogs: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading blogs file");
      }

      let blogsData;
      try {
        blogsData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing blogs file");
      }

      if (!Array.isArray(blogsData.blogs)) {
        blogsData.blogs = [];
      }

      // Generate a unique ID based on title
      const generateId = (title) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      };

      let newId = generateId(newBlog.title);
      let counter = 1;
      
      // Ensure unique ID
      while (blogsData.blogs.some((b) => b.id === newId)) {
        newId = `${generateId(newBlog.title)}-${counter}`;
        counter++;
      }

      newBlog.id = newId;

      // Add timestamp
      const currentDate = new Date();
      newBlog.date = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      blogsData.blogs.push(newBlog);

      fs.writeFile(filePath, JSON.stringify(blogsData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving blog");
        }

        res.status(200).json({ message: "Blog created successfully", blog: newBlog });
      });
    });
  });

  // Update existing blog
  app.put("/api/blogs/:id", (req, res) => {
    const blogId = req.params.id;
    const updatedBlog = req.body;

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Blog not found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading blogs file");
      }

      let blogsData;
      try {
        blogsData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing blogs file");
      }

      const blogIndex = blogsData.blogs.findIndex((b) => b.id === blogId);
      if (blogIndex === -1) {
        return res.status(404).send("Blog not found");
      }

      // Keep the original ID and date if not provided
      updatedBlog.id = blogId;
      if (!updatedBlog.date) {
        updatedBlog.date = blogsData.blogs[blogIndex].date;
      }

      blogsData.blogs[blogIndex] = updatedBlog;

      fs.writeFile(filePath, JSON.stringify(blogsData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error updating blog");
        }

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
      });
    });
  });

  // Delete blog
  app.delete("/api/blogs/:id", (req, res) => {
    const blogId = req.params.id;

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("No blogs found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading blogs file");
      }

      let blogsData;
      try {
        blogsData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing blogs file");
      }

      if (!Array.isArray(blogsData.blogs)) {
        return res.status(404).send("No blogs found");
      }

      const updatedBlogs = blogsData.blogs.filter((blog) => blog.id !== blogId);

      if (updatedBlogs.length === blogsData.blogs.length) {
        return res.status(404).send("Blog not found");
      }

      blogsData.blogs = updatedBlogs;

      fs.writeFile(filePath, JSON.stringify(blogsData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error deleting blog");
        }

        res.status(200).send("Blog deleted successfully");
      });
    });
  });
};
