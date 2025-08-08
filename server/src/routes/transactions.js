import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Create
router.post(
  '/',
  authRequired,
  [
    body('title').isString().isLength({ min: 1 }),
    body('amount').isFloat({ gt: -1 }),
    body('type').isIn(['Income', 'Expense']),
    body('category').isString().isLength({ min: 1 }),
    body('date').isISO8601().toDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const tx = await Transaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(tx);
  }
);

// Read (list with filters)
router.get(
  '/',
  authRequired,
  [
    query('category').optional().isString(),
    query('start').optional().isISO8601().toDate(),
    query('end').optional().isISO8601().toDate(),
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { category, start, end } = req.query;
    const filter = { user: req.user.id };
    if (category) filter.category = category;
    if (start || end) filter.date = {};
    if (start) filter.date.$gte = new Date(start);
    if (end) filter.date.$lte = new Date(end);

    const txs = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });

    // Totals
    const totals = txs.reduce(
      (acc, t) => {
        if (t.type === 'Income') acc.income += t.amount;
        if (t.type === 'Expense') acc.expense += t.amount;
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );

    res.json({ items: txs, totals });
  }
);

// Read one
router.get('/:id', authRequired, async (req, res) => {
  const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  res.json(tx);
});

// Update
router.put(
  '/:id',
  authRequired,
  [
    body('title').optional().isString().isLength({ min: 1 }),
    body('amount').optional().isFloat({ gt: -1 }),
    body('type').optional().isIn(['Income', 'Expense']),
    body('category').optional().isString().isLength({ min: 1 }),
    body('date').optional().isISO8601().toDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  }
);

// Delete
router.delete('/:id', authRequired, async (req, res) => {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

export default router;
