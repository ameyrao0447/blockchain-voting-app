const mongoose = require('mongoose'),Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    userName:String,
    password:String,
    email:String,
    aadhaar:String
})
module.exports = mongoose.model('User',userSchema);
