
const { Server } = require("socket.io");
const userModel = require("../models/user.model");
const roomModel = require("../models/room.modal");

const socketConnection = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*"
        }
    })

    const roomParticipants = {};

    io.use((socket, next) => {
        const token = socket.handshake?.query?.token;
        console.log(token);

        async function findUser(){
            if (token) {
                try {
                    const decoded = userModel.verifyToken(token);
                    await userModel.findById(decoded._id).select('-password').then(user => {
                        if (!user) {
                           return next(new Error('Authentication error: User not found.'));
                        }
                        socket.user = user;
                        next();
                    }).catch(err => {
                         next(new Error('Authentication error: DB error.'));
                    });
                } catch (error) {
                    next(new Error('Authentication error: Invalid token.'));
                }
            } else {
                next(new Error('Authentication error: No token provided.'));
            }
        }
        
        findUser();
    });

    io.on("connection", (socket) => {
        console.log("user connected " + socket.id + socket.user);

        socket.on("joinRoom", async ({ roomId, user }) => {

            if (!socket.user) {
                socket.emit('error', { message: 'Authentication required to join room.' });
                return;
            }

            if (!roomId) {
                socket.emit('error', { message: 'Room ID is required.' });
                return;
            }
    
            const isRoomExist = await roomModel.findOne({ roomId });
            if(!isRoomExist){
                socket.emit('error', { message: 'Room not found.' });
                return;
            }

            socket.join(roomId);

            if (!roomParticipants[roomId]) {
                roomParticipants[roomId] = {};
            }

            roomParticipants[roomId][socket.id] = {
                _id: socket.user._id,
                username: socket.user.username,
                avatar: socket.user.avatar,
            };

            const participantsList = Object.values(roomParticipants[roomId]);

            socket.to(roomId).emit('userJoined', roomParticipants[roomId][socket.id]);

            socket.emit('roomData', { participantsList, currentCode: isRoomExist.codeContent });

            await roomModel.findOneAndUpdate({ roomId: roomId },{ $addToSet: { participants: socket.user._id } });

        })

        socket.on("sendMessage", ({ roomId, text }) => {
            if (!socket.user) return;

            const message = {
                user: {
                    _id: socket.user._id,
                    username: socket.user.username,
                    avatar: socket.user.avatar
                },
                text: text,
                timestamp: new Date()
            };

            io.to(roomId).emit("newMessage", message)
        })

        socket.on("codeChange", async ({roomId, newCode}) => {
            io.to(roomId).emit("updateCode", newCode);
            await roomModel.findOneAndUpdate({roomId}, { codeContent: newCode });
        })

        socket.on("disconnect", async () => {
            console.log("❌ User disconnected: " + socket.id);

            for (const roomId in roomParticipants) {
                if (roomParticipants[roomId][socket.id]) {
                    console.log(`${socket.user?.name || socket.id} leaving room: ${roomId}`);
                    const leavingUser = roomParticipants[roomId][socket.id]; // Get user info before deleting
    
                    // Remove user from tracking object
                    delete roomParticipants[roomId][socket.id];
    
                    // Notify remaining participants in the room
                    if (leavingUser) { // Ensure we have user info to send
                        socket.to(roomId).emit('userLeft', leavingUser._id); // Send user ID
                    }
    
                    // Optional: If room is now empty, delete it from tracking object
                    if (Object.keys(roomParticipants[roomId]).length === 0) {
                        console.log(`Room ${roomId} is now empty, removing from tracking.`);
                        delete roomParticipants[roomId];
                    } else {
                         console.log(`Remaining participants in room ${roomId}:`, Object.values(roomParticipants[roomId]).map(p=>p.name));
                    }
    
                     // Room.updateOne({ roomId }, { $pull: { participants: leavingUser?._id } });
                    await roomModel.findOneAndUpdate({ roomId: roomId }, { $pull: { participants: leavingUser._id }});
                    break;
                }
            }

        });
    })

}

module.exports = socketConnection