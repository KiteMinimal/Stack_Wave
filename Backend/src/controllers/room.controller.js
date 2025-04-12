
const {nanoid}  = require("nanoid");
const roomModel = require("../models/room.modal");

const createRoomcontroller = async function(req,res){
    try{
        const {name,language} = req.body;
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).json({
                message: "User not authenticated" 
            })
        }

        const generatedRoomId = nanoid(10);

        const room = await roomModel.create({
            roomId: generatedRoomId,
            name,
            language,
            host: userId,
            participants: [userId]
        })

        res.status(201).json({
            message: "Room created successfully",
            room: {
                name: room.name,
                roomID: room.roomId,
                language: room.language
            }
        })

    }
    catch(err){
        if (err.code === 11000) {
            return res.status(409).json({ message: "Failed to generate a unique room ID. Please try again." });
        }
        if (err.name === 'ValidationError') {
             return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }

        res.status(500).json({
            message: "An internal server error occurred while creating the room."
        });
    }
}

module.exports = {
    createRoomcontroller
}