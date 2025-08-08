import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    recurring: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
