import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({
    path: "/.env"
})

const PORT_NUM = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(PORT_NUM, () => {
            console.log("Server is listening on POrt: ", PORT_NUM);
        })
    })
    .catch((err) => {
        console.log("MONGODB ERROR CONNECTION Failed !!! ", err);
    })