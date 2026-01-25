const mongoose = require("mongoose")

const CountrySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  flagImage: { type: String },
  heroImage: { type: String },
  description: { type: String, maxlength: 1500 },
  avgTuitionFeePerYear: { type: Number },
  avgLivingCostPerYear: { type: Number },
  popularScholarships: [{ type: String }],          // e.g. "Chevening", "DAAD", "GREAT"
  visaSuccessRate: { type: Number },                // your claimed rate
  topUniversities: [{ type: Schema.Types.ObjectId, ref: 'University' }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema);