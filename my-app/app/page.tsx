'use client'

import { useState } from 'react'

const API_URL = 'http://47.95.118.210/api'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!text) return alert('请输入内容')

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      const data = await res.json()
      setResult(data.result || '无结果')
    } catch (err) {
      console.error(err)
      alert('请求失败')
    }
    setLoading(false)
  }

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1>AI违禁词检测与文案改写工具</h1>

      <textarea
        style={{ width: '100%', height: 150, marginTop: 20 }}
        placeholder="请输入需要检测/改写的文案..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleCheck}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        {loading ? '处理中...' : '开始检测/改写'}
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>结果：</h3>
          <p>{result}</p>
        </div>
      )}
    </main>
  )
}