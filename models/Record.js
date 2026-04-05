const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    type: {
      type: String,
      enum: ['Income', 'Expense'],
      required: [true, 'Please specify transaction type'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      enum: [
        'Salary',
        'Bonus',
        'Investment',
        'Other Income',
        'Food',
        'Transport',
        'Utilities',
        'Entertainment',
        'Healthcare',
        'Education',
        'Other Expense',
      ],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a transaction date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Record must belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware: Automatically populate user info when querying records
recordSchema.pre(/^find/, function (next) {
  // Only populate if the query explicitly selects userId
  if (this.getOptions().populate !== false) {
    this.populate({
      path: 'userId',
      select: 'name email role',
    });
  }
  next();
});

// Index for faster queries
recordSchema.index({ userId: 1, date: -1 });
recordSchema.index({ category: 1 });
recordSchema.index({ type: 1 });

module.exports = mongoose.model('Record', recordSchema);
