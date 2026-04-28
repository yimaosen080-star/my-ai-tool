'use client'

import { useState } from 'react'

const API_URL = 'https://my-ai-tool-production-a91f.up.railway.app'

const tools = [
  {
    key: 'douyin',
    name: '抖音违禁词检测',
    desc: '适合短视频、口播、带货文案检测和改写',
  },
  {
    key: 'xiaohongshu',
    name: '小红书违禁词检测',
    desc: '适合种草文案、探店笔记、品牌软广优化',
  },
  {
    key: 'novel',
    name: '小说违禁词检测',
    desc: '适合网文、短篇小说、章节内容降敏改写',
  },
  {
    key: 'adlaw',
    name: '广告法极限词检测',
    desc: '适合企业宣传、销售话术、产品介绍',
  },
  {
    key: 'copywriting',
    name: 'AI文案优化',
    desc: '适合普通文案润色、标题优化、表达升级',
  },
]

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(tools[0])
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

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
        body: JSON.stringify({
          type: selectedTool.key,
          text,
        }),
      })

      const data = await res.json()
      setResult(data.result || data.msg || '没有返回结果')
    } catch (error) {
      setResult('请求失败，请检查后端是否正常运行')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>AI违禁词检测与文案改写工具</h1>
      <p>选择检测场景，输入文案，一键检测并合规改写。</p>

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