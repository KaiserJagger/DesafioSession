import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import chatRouter from "./routes/chat.router.js"
import messagesModel from "./dao/models/messages.model.js";
import productViewsRouter from './routes/products.views.router.js'
import sessionRouter from './routes/session.router.js'



const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    app.use("/products", productViewsRouter)
    app.use("/product/:", productRouter)
    app.use("/session", sessionRouter)
    app.use("/api/products", productRouter)
    app.use("/carts", cartRouter)
    app.use("/chat", chatRouter)
   


    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await messagesModel.create(data)
        let messages = await messagesModel.find().lean().exec()
        socketServer.emit("logs", messages)
        })
    })

    app.get("/", (req, res) => {
        res.render("home");
      });

}

export default run