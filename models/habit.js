const mongoose = require("mongoose");

//create habit Schema

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required :true
    },
    desc: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateTime: {
        type: Date
    },
    complete: {
        type: Boolean,
    }
},{
    timestamps: true,
})

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;