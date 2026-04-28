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

app.get('/', (req, res) => {
  res.send('Backend is running')
})

function getPrompt(type, text) {
  const prompts = {
    douyin: `你是抖音短视频文案合规审核和改写助手。请检测下面文案中可能涉及的违规、夸大、诱导、极限、引流表达，并改写成更适合抖音发布的合规版本。只输出改写后的文案，不要解释。\n\n原文：${text}`,

    xiaohongshu: `你是小红书种草文案合规优化助手。请把下面文案改写得更自然、更像真实分享，减少硬广、夸大承诺、极限词和诱导表达，保留种草感。只输出改写后的文案，不要解释。\n\n原文：${text}`,

    novel: `你是小说内容安全改写助手。请将下面小说内容中可能敏感、过激、违规、擦边的表达降敏改写，保留剧情和情绪张力，但表达更安全合规。只输出改写后的文本，不要解释。\n\n原文：${text}`,

    adlaw: `你是广告法合规审核助手。请将下面宣传文案中的极限词、绝对化表达、虚假承诺、夸大宣传改成更合规的商业表达。只输出改写后的文案，不要解释。\n\n原文：${text}`,

    copywriting: `你是中文商业文案优化助手。请将下面文案改写得更清晰、有吸引力、自然、有转化力，但不要夸大、不要违规。只输出优化后的文案，不要解释。\n\n原文：${text}`,
  }

  return prompts[type] || prompts.copywriting
}

app.post('/ai-rewrite', async (req, res) => {
  try {
    const { type, text } = req.body

    if (!text) {
      return res.json({ msg: '请输入内容' })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.json({ msg: 'DeepSeek API Key 未配置' })
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是一个中文内容合规检测与文案改写助手，擅长短视频、小红书、小说、广告法和商业文案优化。',
          },
          {
            role: 'user',
            content: getPrompt(type, text),
          },
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || ''

    res.json({
      msg: 'AI改写成功',
      result,
    })
  } catch (error) {
    res.json({
      msg: 'AI改写失败',
      error: String(error),
    })
  }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器运行在 ' + PORT + ' 端口')
})