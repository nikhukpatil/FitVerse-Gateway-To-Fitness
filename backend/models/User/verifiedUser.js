const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const VerfiedUserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    }
}, {timestamps: true});




module.exports= mongoose.model("verifiedUsers", VerfiedUserSchema);