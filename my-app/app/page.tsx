'use client'

import { useState } from 'react'

const API_URL = 'https://my-ai-tool-production-a91f.up.railway.app'

const tools = [
  { key: 'douyin', name: '抖音违禁词检测', desc: '短视频、口播、带货文案检测改写' },
  { key: 'xiaohongshu', name: '小红书违禁词检测', desc: '种草、探店、品牌软广优化' },
  { key: 'novel', name: '小说违禁词检测', desc: '网文、章节、剧情内容降敏' },
  { key: 'adlaw', name: '广告法极限词检测', desc: '企业宣传、产品卖点合规' },
  { key: 'copywriting', name: 'AI文案优化', desc: '标题、口播、成交文案优化' },
]

export default function Home() {
  const [user, setUser] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [selectedTool, setSelectedTool] = useState(tools[0])
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!inputUser || !password) {
      alert('请输入用户名和密码')
      return
    }

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password }),
    })

    const data = await res.json()

    if (data.msg === '登录成功') {
      setUser(data.user.username)
    } else {
      alert(data.msg)
    }
  }

  const handleRegister = async () => {
    if (!inputUser || !password) {
      alert('请输入用户名和密码')
      return
    }

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password }),
    })

    const data = await res.json()
    alert(data.msg)
  }

  const handleRewrite = async () => {
    if (!text.trim()) {
      alert('请输入要检测/改写的内容')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const res = await fetch(`${API_URL}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedTool.key, text }),
      })

      const data = await res.json()
      setResult(data.result || data.msg || '没有返回结果')
    } catch (error) {
      setResult('请求失败，请检查后端是否正常')
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
        <h1>登录 / 注册</h1>

        <input
          placeholder="用户名"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
          style={{ width: '100%', padding: '12px', marginTop: '20px' }}
        />

        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginTop: '15px' }}
        />

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleLogin}>登录</button>
          <button onClick={handleRegister} style={{ marginLeft: '10px' }}>
            注册
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>AI违禁词检测与文案改写工具</h1>
          <p>当前用户：{user}</p>
        </div>

        <button onClick={() => setUser('')}>退出登录</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '30px',
        }}
      >
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => {
              setSelectedTool(tool)
              setResult('')
            }}
            style={{
              padding: '18px',
              border:
                selectedTool.key === tool.key
                  ? '2px solid #111'
                  : '1px solid #ddd',
              borderRadius: '12px',
              background: selectedTool.key === tool.key ? '#f2f2f2' : '#fff',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <h3>{tool.name}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{tool.desc}</p>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '35px' }}>
        <h2>当前工具：{selectedTool.name}</h2>

        <textarea
          rows={8}
          placeholder="请输入要检测或改写的文案..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #ccc',
          }}
        />

        <br /><br />

        <button
          onClick={handleRewrite}
          disabled={loading}
          style={{
            padding: '12px 28px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {loading ? '正在处理...' : '一键检测并改写'}
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>改写结果</h2>
        <div
          style={{
            minHeight: '120px',
            background: '#f7f7f7',
            padding: '20px',
            borderRadius: '10px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {result || '处理结果会显示在这里'}
        </div>
      </div>
    </div>
  )
}