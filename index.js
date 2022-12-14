import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connection from './DB/connection.js';
import allRoutes from './module/index.route.js';
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1 > <br> <h5>By Mohamed Elerian</h5>")
})
app.use(`${process.env.baseUrl}user`, allRoutes.userRoute)
app.use(`${process.env.baseUrl}post`, allRoutes.postRoute)
app.use(`${process.env.baseUrl}auth`, allRoutes.authRoute)
app.use(`${process.env.baseUrl}comment`, allRoutes.commentRoute)


connection();
app.listen(3000, () => {
    console.log("server running");
})