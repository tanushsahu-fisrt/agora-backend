const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    issueCredentials: true,
    origin: '*',
}))
app.use(bodyParser.json())

app.post('/generateAgoraToken', (req, res) => {

  const { channelName, uid, role, expireTime } = req.body

  if (!channelName || uid == null) {
    return res.status(400).json({ error: 'channelName and uid are required' })
  }

  const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
  const expireInSeconds = expireTime || 3600
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpireTimestamp = currentTimestamp + expireInSeconds

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    channelName,
    uid,
    agoraRole,
    privilegeExpireTimestamp
  )
 return res.json({ token })
})

app.listen(PORT, () => {
  console.log(`Agora token server running on port ${PORT}`)
})