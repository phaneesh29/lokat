import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { CORS_ORIGIN, PORT } from "./constants.js"
import connectDB from "./db/db.config.js"

import healthRoute from "./routes/health.route.js"
import userRoute from "./routes/user.route.js"

connectDB()

const app = express()
app.use(cors({
    origin: [CORS_ORIGIN],
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

app.use("/api/health",healthRoute)
app.use("/api/auth",userRoute)

export default app