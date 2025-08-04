// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// Import necessary packages for our server
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import our route files
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


//      Configuration

// Load environment variables from our .env file
dotenv.config();

// Initialize our Express application
const app = express();
const PORT = process.env.PORT || 5000;


//      Database Connection

// Connect to MongoDB using the URI from our environment variables
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

//      Middleware

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// Serve static files from the 'uploads' directory.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//
//      API Routes
//
// A simple test route to check if the server is up and running
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the E-commerce API! Server is running.' });
});

// Mount the user routes
app.use('/api/users', userRoutes);

// Mount the category routes
app.use('/api/categories', categoryRoutes);

// Mount the product routes
app.use('/api/products', productRoutes);

// Mount the cart routes
app.use('/api/cart', cartRoutes);

// Mount the order routes
app.use('/api/orders', orderRoutes);


// 
//      Server Initialization
// 
// Start listening for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});