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
      const defaultData = { message: "Welcome to the homepage!" + filePath };
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

  // Save contact information
  app.post("/api/contact", (req, res) => {
    const newContact = req.body;

    if (!fs.existsSync(filePath)) {
      // Create a default JSON file if not found
      const defaultData = { contacts: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      // Ensure contacts array exists
      if (!Array.isArray(homepageData.contacts)) {
        homepageData.contacts = [];
      }

      // Generate a unique ID for the new contact
      const existingIds = homepageData.contacts.map((contact) => contact.id);
      let newId = 1;
      while (existingIds.includes(newId)) {
        newId++;
      }
      newContact.id = newId;
console.log('ID :',newContact)
      // Add the new contact
      homepageData.contacts.push(newContact);

      // Save the updated data
      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Contact information saved successfully");
      });
    });
  });

  // Delete contact by ID
  app.delete("/api/contact/:id", (req, res) => {
    const contactId = parseInt(req.params.id, 10);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("No contacts found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      // Ensure contacts array exists
      if (!Array.isArray(homepageData.contacts)) {
        return res.status(404).send("No contacts found");
      }

      // Filter out the contact with the given ID
      const updatedContacts = homepageData.contacts.filter(
        (contact) => contact.id !== contactId
      );

      if (updatedContacts.length === homepageData.contacts.length) {
        return res.status(404).send("Contact not found");
      }

      homepageData.contacts = updatedContacts;

      // Save the updated data
      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Contact deleted successfully");
      });
    });
  });

  // Save consultation information
  app.post("/api/consultation", (req, res) => {
    const newConsultation = req.body;

    if (!fs.existsSync(filePath)) {
      const defaultData = { consultations: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      if (!Array.isArray(homepageData.consultations)) {
        homepageData.consultations = [];
      }

      const existingIds = homepageData.consultations.map((consultation) => consultation.id);
      let newId = 1;
      while (existingIds.includes(newId)) {
        newId++;
      }
      newConsultation.id = newId;

      homepageData.consultations.push(newConsultation);

      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Consultation information saved successfully");
      });
    });
  });

  // Delete consultation by ID
  app.delete("/api/consultation/:id", (req, res) => {
    const consultationId = parseInt(req.params.id, 10);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("No consultations found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      if (!Array.isArray(homepageData.consultations)) {
        return res.status(404).send("No consultations found");
      }

      const updatedConsultations = homepageData.consultations.filter(
        (consultation) => consultation.id !== consultationId
      );

      if (updatedConsultations.length === homepageData.consultations.length) {
        return res.status(404).send("Consultation not found");
      }

      homepageData.consultations = updatedConsultations;

      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Consultation deleted successfully");
      });
    });
  });

  // Save proposal information
  app.post("/api/proposal", (req, res) => {
    const newProposal = req.body;

    if (!fs.existsSync(filePath)) {
      const defaultData = { proposals: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      if (!Array.isArray(homepageData.proposals)) {
        homepageData.proposals = [];
      }

      const existingIds = homepageData.proposals.map((proposal) => proposal.id);
      let newId = 1;
      while (existingIds.includes(newId)) {
        newId++;
      }
      newProposal.id = newId;

      homepageData.proposals.push(newProposal);

      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Proposal information saved successfully");
      });
    });
  });

  // Delete proposal by ID
  app.delete("/api/proposal/:id", (req, res) => {
    const proposalId = parseInt(req.params.id, 10);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("No proposals found");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading JSON file");
      }

      let homepageData;
      try {
        homepageData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing JSON file");
      }

      if (!Array.isArray(homepageData.proposals)) {
        return res.status(404).send("No proposals found");
      }

      const updatedProposals = homepageData.proposals.filter(
        (proposal) => proposal.id !== proposalId
      );

      if (updatedProposals.length === homepageData.proposals.length) {
        return res.status(404).send("Proposal not found");
      }

      homepageData.proposals = updatedProposals;

      fs.writeFile(filePath, JSON.stringify(homepageData, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).send("Error saving JSON file");
        }

        res.status(200).send("Proposal deleted successfully");
      });
    });
  });
};
