const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Middlewares
const disPath = path.join(__dirname,"../client-main/dist");
/*app.use(express.static(disPath));
app.get("/*",(req,res) => {
    res.sendFile("index.html",{root : disPath})
});*/
app.use(express.json());
//app.use(cors("*"))
app.use(
    cors({
        origin: ["https://onrtech-api.vercel.app"],
        methods: ["GET,POST,DELETE,PUT,PATCH"],
        credentials: true,
    })
);

// Configuration de multer pour vérifier et créer le répertoire d'uploads si nécessaire
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// Custom Middlewares
const {
    authenticateUser,
} = require("./Middleware/UserAuthenticationMiddleware");

// Routers
const JobRouter = require("./Router/JobRouter");
const ArticleRouter = require("./Router/ArticleRouter");
const UserRouter = require("./Router/UserRouter");

const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");
const ApplicationGeustRouter = require("./Router/ApplicationGeustRouter");
// Connecting routes
app.use("/api/v1/Jobs", JobRouter);
app.use("/api/v1/Articles", ArticleRouter);
app.use("/api/v1/Users", authenticateUser, UserRouter);

app.use("/api/v1/Auth", AuthRouter);
app.use("/api/v1/Admin", authenticateUser, AdminRouter);
app.use("/api/v1/Application", authenticateUser, ApplicationRouter);
app.use("/api/v1/ApplicationGeust",  ApplicationGeustRouter);
module.exports = app;