require("dotenv").config()
const Airtable = require("airtable")

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)
const {
  getAccessTokenFromHeaders,
  validateAccessToken,
} = require("./utils/auth")

exports.handler = async (event) => {
  const token = getAccessTokenFromHeaders(event.headers)
  let user = await validateAccessToken(token)
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ err: "User is not authorized" }),
    }
  }

  const body = JSON.parse(event.body)
  if (!body.name || !body.handle || !body.tags || body.tags.length === 0) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        msg: "Each influencer must include a name, handle, and tags",
      }),
    }
  }
  try {
    body.approved = false
    body.votes = 0
    const record = await table.create(body)
    return {
      statusCode: 200,
      body: JSON.stringify({ record }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Failed to create record in Airtable" }),
    }
  }
}
