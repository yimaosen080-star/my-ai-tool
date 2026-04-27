'use client'

import { useState } from 'react'
import words from './words.json'

const API_URL = 'https://my-ai-tool-production-a91f.up.railway.app'

export default function Home() {
  const [text, setText] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [replaced, setReplaced] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [user, setUser] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()

    if (data.msg === '登录成功') {
      setUser(data.user.username)
    } else {
      alert(data.msg)
    }
  }

  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()
    alert(data.msg)
  }

  const handleProcess = () => {
    if (!user) {
      alert('请先登录')
      return
    }

    let highlightText = text
    let replaceText = text

    words.forEach((item: any) => {
      const reg = new RegExp(item.bad, 'g')

      highlightText = highlightText.replace(
        reg,
        `<span style="color:#ef4444;font-weight:700;background:#fee2e2;padding:2px 4px;border-radius:6px;">${item.bad}</span>`
      )

      replaceText = replaceText.split(item.bad).join(item.good)
    })

    setHighlighted(highlightText)
    setReplaced(replaceText)
  }

  const handleAI = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (!text) {
      alert('请输入内容')
      return
    }

    setLoading(true)
    setAiResult('AI处理中，请稍等...')

    try {
      const res = await fetch(`${API_URL}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const data = await res.json()

      if (data.result) {
        setAiResult(data.result)
      } else {
        setAiResult(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setAiResult('AI请求失败：' + String(err))
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <div style={styles.badge}>AI 文案合规工具</div>
          <h1 style={styles.title}>登录 / 注册</h1>
          <p style={styles.desc}>检测违禁词，自动规则改写，并用 AI 生成更合规的文案。</p>

          <input
            style={styles.input}
            placeholder="用户名"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.row}>
            <button style={styles.primaryBtn} onClick={handleLogin}>登录</button>
            <button style={styles.secondaryBtn} onClick={handleRegister}>注册</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.badge}>AI 文案合规工具</div>
            <h1 style={styles.title}>违禁词检测系统</h1>
            <p style={styles.desc}>当前用户：{user}</p>
          </div>

          <button style={styles.logoutBtn} onClick={() => setUser('')}>
            退出登录
          </button>
        </header>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>输入文案</h2>

            <textarea
              rows={10}
              style={styles.textarea}
              placeholder="请输入要检测或改写的文案..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div style={styles.row}>
              <button style={styles.primaryBtn} onClick={handleProcess}>
                违禁词检测
              </button>

              <button style={styles.aiBtn} onClick={handleAI}>
                {loading ? 'AI处理中...' : 'AI智能改写'}
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>检测结果</h2>
            <div
              style={styles.resultBox}
              dangerouslySetInnerHTML={{ __html: highlighted || '暂无检测结果' }}
            />

            <h2 style={styles.cardTitle}>规则改写</h2>
            <div style={styles.resultBox}>{replaced || '暂无规则改写结果'}</div>

            <h2 style={styles.cardTitle}>AI改写</h2>
            <pre style={styles.aiResult}>{aiResult || '暂无AI改写结果'}</pre>
          </div>
        </div>
      </section>
    </main>
  )
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #020617 100%)',
    color: '#e5e7eb',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loginCard: {
    maxWidth: '420px',
    margin: '100px auto',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '24px',
    padding: '36px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px'
  },
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'rgba(59,130,246,0.16)',
    color: '#93c5fd',
    fontSize: '14px',
    marginBottom: '12px'
  },
  title: {
    fontSize: '36px',
    margin: '0 0 10px',
    color: '#ffffff'
  },
  desc: {
    color: '#cbd5e1',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  card: {
    background: 'rgba(15, 23, 42, 0.88)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.28)'
  },
  cardTitle: {
    fontSize: '18px',
    color: '#ffffff',
    margin: '0 0 12px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    marginBottom: '14px',
    borderRadius: '14px',
    border: '1px solid #334155',
    background: '#020617',
    color: '#ffffff',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    borderRadius: '18px',
    border: '1px solid #334155',
    background: '#020617',
    color: '#ffffff',
    resize: 'vertical',
    outline: 'none',
    fontSize: '15px',
    lineHeight: '1.7'
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  primaryBtn: {
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    background: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700
  },
  secondaryBtn: {
    border: '1px solid #475569',
    borderRadius: '14px',
    padding: '12px 18px',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 700
  },
  aiBtn: {
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700
  },
  logoutBtn: {
    border: '1px solid #475569',
    borderRadius: '14px',
    padding: '10px 16px',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer'
  },
  resultBox: {
    minHeight: '70px',
    background: '#020617',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
    color: '#e5e7eb',
    lineHeight: '1.7'
  },
  aiResult: {
    minHeight: '120px',
    whiteSpace: 'pre-wrap',
    background: '#020617',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '16px',
    color: '#d1fae5',
    lineHeight: '1.7'
  }
}