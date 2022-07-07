import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import 'dotenv/config'
// can use this syntax in the latest versions of node

// routers
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"


const app = express()

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

app.use("/posts", postRoutes)
app.use("/user", userRoutes)

app.get("/", (req, res) => {
    res.send("APP IS RUNNING")
})

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(port, () => console.log(`Server is listening on port ${port}...`)))
    .catch((error) => console.log(error.message))



// const start = async () => {
//     try {
//         await connectDB(process.env.MONGO_URI)
//         app.listen(port, () =>
//             console.log(`Server is listening on port ${port}...`)
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };

// start();
