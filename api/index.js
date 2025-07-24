const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors())

//get only one
app.get('/api/daily/:symbol', (req, res) => {
  const symbol = req.params.symbol
  const filePath = path.join(__dirname, '../data', `${symbol}.json`)

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: 'Not found' })

  const json = fs.readFileSync(filePath)
  res.setHeader('Content-Type', 'application/json')
  res.send(json)
})

//get all
app.get('/api/daily', (req, res) => {
  const folderPath = path.join(__dirname, '../data')
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'))

  const result = files.map(f => {
    const content = fs.readFileSync(path.join(folderPath, f))
    return { [f.replace('.json', '')]: JSON.parse(content) }
  })

  res.json(Object.assign({}, ...result))
})

if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

module.exports = app