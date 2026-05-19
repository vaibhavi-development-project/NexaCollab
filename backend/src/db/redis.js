require("dotenv").config()

const Redis = require("ioredis")

const redis = new Redis(process.env.REDIS_URL, {
    tls: {}
})

redis.on("connect", () => {
    console.log("Connected to redis")
})

redis.on("error", (err) => {
    console.log("Redis Error:", err)
})

module.exports = redis