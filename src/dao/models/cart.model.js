import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        default: []
    }
})

mongoose.set("strictQuery", false)
const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel