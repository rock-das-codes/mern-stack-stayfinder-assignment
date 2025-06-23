import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})); /* https://www.npmjs.com/package/cors#configuration-options */


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listings.routes.js";

// routes declaration
app.use("/api/users", userRouter)
app.use("/api/listings", listingRouter)
export { app }