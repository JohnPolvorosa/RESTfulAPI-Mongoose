const mongoose = require("mongoose");

// Initialize Schema
// Document 2 fields title and content
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Export Model
// Collection name articles
module.exports = mongoose.model("Article", articleSchema);