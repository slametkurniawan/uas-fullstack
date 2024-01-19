const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

mongoose.model("Tasks", taskSchema);
