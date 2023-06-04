import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js"
import run from "./run.js";
import passport from "passport"
import initializePassport from "./config/passport.config.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const MONGO_URI = "mongodb+srv://NicoAndreolli:Nico1507veintiuno@clusters-ecommerce.42ewhbm.mongodb.net/"
const MONGO_DB_NAME = "JaggerStore"

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: MONGO_DB_NAME
    }),
    secret: 'Nico1507ventiuno',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME
}, (error) => {
    if(error){
        console.log("DB No conected...")
        return
    }
    const httpServer = app.listen(8080, () => console.log("Listening..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))



    run(socketServer, app)
})