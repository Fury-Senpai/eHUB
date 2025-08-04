// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const mongoose = require('mongoose');

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      User Schema Definition
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// This schema defines the structure for user documents in our database.
const userSchema = new mongoose.Schema({
    // User's full name. It's required and will be trimmed of whitespace.
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        trim: true
    },
    // User's email address. It must be unique and is also required.
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        trim: true,
        lowercase: true // Store emails in lowercase to avoid duplicates like 'test@test.com' and 'Test@test.com'
    },
    // User's password. It's required for authentication.
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6 // Enforce a minimum password length for security
    },
    // Role of the user, which determines their permissions.
    // It can only be 'Client' or 'Seller'.
    role: {
        type: String,
        enum: ['Client', 'Seller'],
        default: 'Client' // New users are clients by default.
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields to the document.
    timestamps: true
});

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Model Export
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
// Create and export the User model based on the schema.
const User = mongoose.model('User', userSchema);
module.exports = User;
