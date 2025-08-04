const mongoose = require('mongoose');


//      User Schema Definition

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        trim: true
    },
   
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        trim: true,
        lowercase: true 
    },

    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6 
    },

    role: {
        type: String,
        enum: ['Client', 'Seller'],
        default: 'Client' 
    }
}, {

    timestamps: true
});


const User = mongoose.model('User', userSchema);
module.exports = User;
