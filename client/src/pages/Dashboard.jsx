import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const [data, setData] = useState({ items: [], totals: { income: 0, expense: 0, balance: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/api/transactions')
        setData(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const byCategory = useMemo(() => {
    const map = {}
    data.items.forEach((t) => {
      if (t.type !== 'Expense') return
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    const labels = Object.keys(map)
    const values = Object.values(map)
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#3b82f6',
            '#22c55e',
            '#ef4444',
            '#a78bfa',
            '#f59e0b',
            '#06b6d4',
            '#84cc16',
          ],
        },
      ],
    }
  }, [data])

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Income" value={data.totals.income} color="text-green-600" />
        <StatCard title="Expenses" value={data.totals.expense} color="text-red-600" />
        <StatCard title="Balance" value={data.totals.balance} color="text-blue-600" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="font-medium mb-2">Expenses by Category</h2>
        {byCategory.labels.length ? (
          <div className="max-w-md">
            <Pie data={byCategory} />
          </div>
        ) : (
          <p className="text-gray-500">No expense data yet.</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className={`text-2xl font-semibold ${color}`}>${value.toFixed(2)}</div>
    </div>
  )
}
