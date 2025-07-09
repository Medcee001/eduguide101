const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  image: String,
  url: String,
  category: String,
  difficulty: String
});
module.exports = mongoose.model('Course', courseSchema);
