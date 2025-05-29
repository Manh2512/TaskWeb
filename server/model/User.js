const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
    name:String,
    password:String,
    tasks: Array,
})

const UserModel = mongoose.model("users", UserSchema, "users")
module.exports = UserModel