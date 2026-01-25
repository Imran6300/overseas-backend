const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    // Core fields
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Example: "best-scholarships-for-indian-students-in-usa-2026"
    },

    // Content
    content: {
      type: String, // or use mongoose-html or separate Markdown field
      required: true,
      minlength: 500, // encourage substantial articles
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
      // Short summary shown in blog list / meta description
    },

    // SEO & visibility
    metaTitle: { type: String, maxlength: 100 },
    metaDescription: { type: String, maxlength: 160 },
    keywords: [{ type: String }], // e.g. ["study in canada", "canada student visa", "ielts for canada"]

    // Media
    featuredImage: {
      type: String, // Cloudinary URL or public_id
      required: true,
    },
    altText: { type: String, maxlength: 150 }, // for accessibility & SEO

    // Categorization (very useful for filtering/sidebar)
    category: {
      type: String,
      enum: [
        'Visa & Immigration',
        'Scholarships & Funding',
        'Country Guides',
        'University & Program Reviews',
        'Application Tips',
        'Exam Preparation',
        'Student Experiences',
        'Career & Post-Study',
        'Latest News & Updates',
        'General Study Abroad',
      ],
      required: true,
    },
    tags: [{ type: String }], // e.g. ["IELTS", "USA", "MBA", "2026 Intake"]

    // Relations
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // your counselor/admin team
      required: true,
    },
    relatedUniversities: [{ type: Schema.Types.ObjectId, ref: 'University' }],
    relatedCountries: [{ type: String }], // or ref to Country model if you have one

    // Status & publishing
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    publishedAt: { type: Date },
    isFeatured: { type: Boolean, default: false }, // show on homepage / featured section

    // Engagement (optional — add later if you want comments/likes)
    views: { type: Number, default: 0 },
    readingTime: { type: Number }, // in minutes — can auto-calculate

    // Timestamps
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Auto-generate slug if not provided (optional middleware)
BlogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  // Auto-set publishedAt when status changes to Published
  if (this.isModified('status') && this.status === 'Published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for faster queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1, status: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isFeatured: 1, publishedAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema);