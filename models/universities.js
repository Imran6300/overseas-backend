const mongoose = require("mongoose");

const UniversitySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true }, // e.g. massachusetts-institute-of-technology
  country: { type: String, required: true },
  city: { type: String },
  website: { type: String },
  ranking: { type: Number },                        // QS / THE ranking if you want to store
  acceptanceRate: { type: Number },
  totalStudents: { type: Number },
  description: { type: String, maxlength: 2000 },
  logo: { type: String },                           // URL or Cloudinary public_id
  coverImage: { type: String },
  popularPrograms: [{ type: String }],              // e.g. ["Computer Science", "AI & ML", "MBA"]
  averageTuitionFee: { type: Number },              // approximate in USD or local currency
  featured: { type: Boolean, default: false },
  isPartner: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("University", UniversitySchema);