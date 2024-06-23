const mongoose = require('mongoose');
const { Schema } = mongoose;

const DietPlanSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dietPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian'],
    required: true,
  },
  dietGoal: {
    type: String,
    enum: ['Losing Weight', 'Maintaining Weight', 'Gaining Weight'],
    required: true,
  },
  exercise: {
    type: String,
    enum: ['Light', 'Medium', 'Extreme'],
    required: true,
  },
  sendInstructions: {
    type: Boolean,
    default: false,
  },
  responded: {
    type: Boolean,
    default: false,
  },
  dietInstructions: {
    type: String,
  }
}, { timestamps: true });

const DietPlan = mongoose.model('DietPlan', DietPlanSchema);

module.exports = DietPlan;
