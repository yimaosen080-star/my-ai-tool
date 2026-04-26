const express = require('express')
const cors = require('cors')

const app = express()

// 允许跨域
app.use(cors({
  origin: [
    'https://my-ai-tool-three.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

// 模拟数据库
let users = []

// 测试接口（必须有）
app.get('/', (req, res) => {
  res.send('Backend is running')
})

// 注册接口
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

// 登录接口
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
    user
  })
})

// ⭐关键：必须用 Railway 的端口
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})