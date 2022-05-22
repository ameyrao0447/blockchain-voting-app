const mongoose = require('mongoose'),Schema = mongoose.Schema;
const candidateSchema = new mongoose.Schema({
    name:String,
    party:String,
    image:String
})
const electionSchema = new mongoose.Schema({
electionName:String,
electionImage:String,
electionDate:Date,

candidates:[candidateSchema]
})
module.exports = mongoose.model('Election',electionSchema);
