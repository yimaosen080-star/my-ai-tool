const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: [
    'https://my-ai-tool-three.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

let users = []

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ msg: '请输入用户名和密码' })
  }

  const exist = users.find(u => u.username === username)

  if (exist) {
    return res.json({ msg: '用户已存在' })
  }

  users.push({ username, password })

  res.json({ msg: '注册成功' })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    return res.json({ msg: '用户名或密码错误' })
  }

  res.json({
    msg: '登录成功',
    user: { username: user.username }
  })
})

// 不同场景提示词
function getPrompt(type, text) {
  const map = {
    douyin: `请把这段抖音文案改写得更合规，避免违规词、夸大、诱导：\n${text}`,
    xiaohongshu: `请把这段小红书文案改写得更自然真实，去掉硬广和违规表达：\n${text}`,
    novel: `请把这段小说内容进行降敏处理，保留剧情但表达更安全：\n${text}`,
    adlaw: `请把这段文案中的广告法违规词（如最、第一、绝对）改掉：\n${text}`,
    copywriting: `请优化这段文案，让它更有吸引力但不过度夸大：\n${text}`,
  }

  return map[type] || map.copywriting
}

// ⭐真正AI接口
app.post('/ai-rewrite', async (req, res) => {
  try {
    const { text, type } = req.body

    if (!text) {
      return res.json({ msg: '请输入内容' })
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是中文文案合规改写专家'
          },
          {
            role: 'user',
            content: getPrompt(type, text)
          }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()

    const result = data.choices?.[0]?.message?.content || 'AI返回空'

    res.json({
      msg: '成功',
      result
    })

  } catch (err) {
    res.json({
      msg: 'AI调用失败',
      error: String(err)
    })
  }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器运行在 ' + PORT)
})