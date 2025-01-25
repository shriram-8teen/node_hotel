const express = require('express');
const db = require('./db'); // Database connection
const bodyParser = require('body-parser');
const MenuItem = require('./models/Menu'); // Import MenuItem model
const Person = require('./models/Person'); // Import Person model

const app = express();
const port = 4000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to validate incoming Person data
const validatePersonData = (req, res, next) => {
  const { name, age, work, mobile, email } = req.body;

  // Basic validation for required fields
  if (!name || !work || !mobile || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate mobile number (must be 10 digits)
  if (typeof mobile !== 'number' || mobile.toString().length !== 10) {
    return res.status(400).json({ error: 'Invalid mobile number' });
  }

  next(); // Proceed to the next middleware or route handler
};

// Routes for Person model

// 1. Welcome Route
app.get('/', (req, res) => {
  res.send('Hello! Welcome to my hotel. How can I help you?');
});

// 2. Create a new Person
app.post('/person', validatePersonData, async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new Person(data); // Create a new Person instance
    const response = await newPerson.save(); // Save to MongoDB
    console.log('Data saved successfully:', response);
    res.status(200).json(response);
  } catch (err) {
    console.error('Error saving person:', err.message); // Log error
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// 3. Get all people
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find(); // Fetch all records from the database
    res.status(200).json(people);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching people', details: err.message });
  }
});

// 4. Get people by work type
app.get('/person/:workType', async (req, res) => {
  try {
    const workType = req.params.workType; // Get work type from URL
    if (workType === 'chef' || workType === 'manager' || workType === 'waiter') {
      const response = await Person.find({ work: workType });
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: 'Invalid work type' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data', details: err.message });
  }
});

// Routes for MenuItem model

// 5. Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body); // Create a new MenuItem instance
    const savedItem = await newItem.save(); // Save to MongoDB
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: 'Error saving menu item', details: err.message });
  }
});

// 6. Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find(); // Retrieve all menu items
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu items', details: err.message });
  }
});

// 7. Get a single menu item by ID
app.get('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id); // Find menu item by ID
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu item', details: err.message });
  }
});

// 8. Update a menu item by ID
app.put('/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating menu item', details: err.message });
  }
});

// 9. Delete a menu item by ID
app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id); // Delete by ID
    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully', deletedItem });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting menu item', details: err.message });
  }
});

// 10. Test database connection
app.get('/testdb', async (req, res) => {
  try {
    await db.connection.db.command({ ping: 1 }); // Ping the database
    res.send('MongoDB is connected and operational!');
  } catch (err) {
    res.status(500).send('MongoDB connection failed: ' + err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
