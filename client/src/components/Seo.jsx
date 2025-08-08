export default function Seo({ title }) {
  document.title = title ? `${title} · Expense Tracker` : 'Expense Tracker'
  return null
}
