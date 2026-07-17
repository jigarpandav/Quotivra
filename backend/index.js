const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const connectDB = require("./config/db");
const companyRouter = require("./router/companySettingRouter");
const adminRouter = require("./router/adminRouter");
const quotationRouter = require("./router/quotationRouter");
const dashboardRouter = require("./router/dashbaordRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads",express.static("uploads"));

app.use("/api", adminRouter);
app.use("/api", companyRouter);
app.use("/api",quotationRouter);
app.use("/api",dashboardRouter);

const PORT = process.env.PORT || 5000 ;

const startServer = async () => {
    await connectDB();

    app.listen(PORT,() => {
        console.log(`app is listening on port: http://localhost:${PORT}`)
    })
}

startServer();
