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

const ADMIN_PASSWORD = 'admin888'

function addDays(date, days) {
  const d = new Date(date || new Date())
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function isVip(user) {
  if (!user.vipUntil) return false
  return new Date(user.vipUntil).getTime() > Date.now()
}

function safeUser(user) {
  return {
    username: user.username,
    inviteCode: user.inviteCode,
    freeUses: user.freeUses,
    vipUntil: user.vipUntil || '',
    isVip: isVip(user)
  }
}

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.post('/register', (req, res) => {
  const { username, password, inviteCode } = req.body

  if (!username || !password) {
    return res.json({ msg: '请输入用户名和密码' })
  }

  const exist = users.find(u => u.username === username)

  if (exist) {
    return res.json({ msg: '用户已存在' })
  }

  const newUser = {
    username,
    password,
    inviteCode: username + Math.floor(1000 + Math.random() * 9000),
    freeUses: 3,
    vipUntil: '',
    invitedBy: inviteCode || ''
  }

  users.push(newUser)

  if (inviteCode) {
    const inviter = users.find(u => u.inviteCode === inviteCode)
    if (inviter) {
      inviter.vipUntil = addDays(
        inviter.vipUntil && isVip(inviter) ? inviter.vipUntil : new Date(),
        3
      )
    }
  }

  res.json({
    msg: inviteCode ? '注册成功，邀请人已获得3天会员' : '注册成功',
    user: safeUser(newUser)
  })
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
    user: safeUser(user)
  })
})

app.post('/buy-vip', (req, res) => {
  const { username, plan } = req.body

  const user = users.find(u => u.username === username)

  if (!user) {
    return res.json({ msg: '用户不存在' })
  }

  const daysMap = {
    week: 7,
    month: 30,
    year: 365
  }

  const days = daysMap[plan] || 30

  user.vipUntil = addDays(
    user.vipUntil && isVip(user) ? user.vipUntil : new Date(),
    days
  )

  res.json({
    msg: `开通成功，已增加${days}天会员`,
    user: safeUser(user)
  })
})

app.post('/admin-open-vip', (req, res) => {
  const { adminPassword, username, days } = req.body

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.json({ msg: '管理员密码错误' })
  }

  const user = users.find(u => u.username === username)

  if (!user) {
    return res.json({ msg: '用户不存在' })
  }

  const addDayCount = Number(days) || 30

  user.vipUntil = addDays(
    user.vipUntil && isVip(user) ? user.vipUntil : new Date(),
    addDayCount
  )

  res.json({
    msg: `已为 ${username} 开通 ${addDayCount} 天会员`,
    user: safeUser(user)
  })
})

app.post('/admin-user-info', (req, res) => {
  const { adminPassword, username } = req.body

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.json({ msg: '管理员密码错误' })
  }

  const user = users.find(u => u.username === username)

  if (!user) {
    return res.json({ msg: '用户不存在' })
  }

  res.json({
    msg: '查询成功',
    user: safeUser(user)
  })
})

function getPrompt(type, text) {
  const map = {
    douyin: `请把这段抖音文案改写得更合规，避免违规词、夸大、诱导，但保留吸引力：\n${text}`,
    xiaohongshu: `请把这段小红书文案改写得更自然真实，去掉硬广和违规表达，保留种草感：\n${text}`,
    novel: `请把这段小说内容进行降敏处理，保留剧情和情绪，但表达更安全：\n${text}`,
    adlaw: `请把这段文案中的广告法违规词、极限词、绝对化表达改掉：\n${text}`,
    copywriting: `请优化这段文案，让它更有吸引力但不过度夸大：\n${text}`,
  }

  return map[type] || map.copywriting
}

app.post('/ai-rewrite', async (req, res) => {
  try {
    const { username, text, type } = req.body

    const user = users.find(u => u.username === username)

    if (!user) {
      return res.json({ msg: '请先登录' })
    }

    if (!isVip(user)) {
      if (user.freeUses <= 0) {
        return res.json({ msg: '免费次数已用完，请开通会员' })
      }

      user.freeUses -= 1
    }

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
            content: '你是中文文案合规改写专家，擅长违禁词检测、广告法合规、短视频和小红书文案优化。'
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
      result,
      user: safeUser(user)
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