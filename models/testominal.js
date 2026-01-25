const mongoose = require("mongoose")

const TestimonialSchema = new Schema({
  studentName: { type: String, required: true, trim: true },
  university: { type: Schema.Types.ObjectId, ref: 'University' }, // or just string if not linking
  universityName: { type: String },                 // fallback if not using ref
  country: { type: String, required: true },
  course: { type: String, required: true },
  intakeYear: { type: Number, required: true },     // e.g. 2024
  visaStatus: { type: String, enum: ['Approved', 'Rejected', 'Pending'] },
  scholarship: { type: String },                    // e.g. "$20,000 Merit Scholarship", "Chevening", "None"
  photo: { type: String },                          // student photo URL
  quote: { type: String, required: true, maxlength: 800 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },      // admin approval before showing publicly
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);