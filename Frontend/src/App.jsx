// frontend/src/App.jsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

function App() {
  const [stats, setStats] = useState(null)
  const [dailyRevenue, setDailyRevenue] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Appel des stats
    axios.get('http://localhost:4000/api/stats')
      .then(res => {
        setStats(res.data.stats)
        setDailyRevenue(res.data.dailyRevenue)
      })
      .catch(err => console.error(err))

    // Appel des utilisateurs
    axios.get('http://localhost:4000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  if (!stats) {
    return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Chargement du dashboard...</div>
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#0f172a', minHeight: '100vh', color: '#e5e7eb' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊 Dashboard Admin</h1>
      <p style={{ marginBottom: '2rem', color: '#9ca3af' }}>React + Node.js – Projet de pratique</p>

      {/* Cartes de stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Utilisateurs totaux" value={stats.totalUsers} />
        <StatCard title="Utilisateurs actifs" value={stats.activeUsers} />
        <StatCard title="Nouveaux aujourd'hui" value={stats.newUsersToday} />
        <StatCard title="Revenus aujourd'hui (€)" value={stats.revenueToday.toFixed(2)} />
      </div>

      {/* Graphique */}
      <div style={{ background: '#020617', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Revenus par jour</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau d'utilisateurs */}
      <div style={{ background: '#020617', padding: '1rem', borderRadius: '0.75rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Utilisateurs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f2933' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Rôle</th>
              <th style={thStyle}>Actif</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #111827' }}>
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>
                  {u.active ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle = {
  textAlign: 'left',
  padding: '0.5rem',
  color: '#9ca3af',
  fontWeight: 'bold'
}

const tdStyle = {
  padding: '0.5rem',
  color: '#e5e7eb'
}

function StatCard({ title, value }) {
  return (
    <div style={{ background: '#020617', padding: '1rem', borderRadius: '0.75rem' }}>
      <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  )
}

export default App
