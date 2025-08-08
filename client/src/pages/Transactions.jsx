import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'

export default function Transactions() {
  const [items, setItems] = useState([])
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 })
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'Expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  })
  const [filters, setFilters] = useState({ category: '', start: '', end: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', amount: '', type: 'Expense', category: '', date: '' })

  const load = async () => {
    setLoading(true)
    try {
  const { data } = await api.get('/transactions', { params: filters })
      setItems(data.items)
      setTotals(data.totals)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
  await api.post('/transactions', payload)
      setForm({ title: '', amount: '', type: form.type, category: '', date: form.date })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
  await api.delete(`/transactions/${id}`)
    load()
  }

  const onUpdate = async (id, patch) => {
  await api.put(`/transactions/${id}`, patch)
    load()
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return ['', ...Array.from(set)]
  }, [items])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
        <h2 className="font-medium mb-2">Add Transaction</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-2">
          <input
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <select
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Expense</option>
            <option>Income</option>
          </select>
          <input
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="date"
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
      <button className="btn btn-primary">Add</button>
        </form>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-4">
        <h2 className="font-medium mb-2">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <select
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c || 'All categories'}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            value={filters.start}
            onChange={(e) => setFilters({ ...filters, start: e.target.value })}
          />
          <input
            type="date"
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            value={filters.end}
            onChange={(e) => setFilters({ ...filters, end: e.target.value })}
          />
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={load}>
              Apply
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFilters({ category: '', start: '', end: '' })
                load()
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4">
        <h2 className="font-medium mb-2">List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="p-2">Date</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => {
                  const isEditing = editId === t._id
                  return (
                    <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2">
                        {isEditing ? (
                          <input
                            type="date"
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          />
                        ) : (
                          new Date(t.date).toLocaleDateString()
                        )}
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <input
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        ) : (
                          t.title
                        )}
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <input
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          />
                        ) : (
                          t.category
                        )}
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <select
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          >
                            <option>Expense</option>
                            <option>Income</option>
                          </select>
                        ) : (
                          t.type
                        )}
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          />
                        ) : (
                          `$${t.amount.toFixed(2)}`
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {isEditing ? (
                          <div className="space-x-2">
                            <button
                              onClick={async () => {
                                const payload = {
                                  ...editForm,
                                  amount: parseFloat(editForm.amount),
                                  date: editForm.date,
                                }
                                await onUpdate(t._id, payload)
                                setEditId(null)
                              }}
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="btn btn-ghost"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="space-x-2">
                            <button
                              onClick={() => {
                                setEditId(t._id)
                                setEditForm({
                                  title: t.title,
                                  amount: String(t.amount),
                                  type: t.type,
                                  category: t.category,
                                  date: new Date(t.date).toISOString().slice(0, 10),
                                })
                              }}
                              className="btn btn-primary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onUpdate(t._id, { type: t.type === 'Expense' ? 'Income' : 'Expense' })}
                              className="btn btn-ghost"
                            >
                              Toggle Type
                            </button>
                            <button
                              onClick={() => onDelete(t._id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-500">Income:</span> ${totals.income.toFixed(2)}
          </div>
          <div>
            <span className="text-gray-500">Expenses:</span> ${totals.expense.toFixed(2)}
          </div>
          <div>
            <span className="text-gray-500">Balance:</span> ${totals.balance.toFixed(2)}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
