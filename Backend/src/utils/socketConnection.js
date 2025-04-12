
const { Server } = require("socket.io");
const userModel = require("../models/user.model");

const socketConnection = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*"
        }
    })

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
                        socket.user = user; // Attach user to socket object
                        next(); // Proceed with connection
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

        socket.on("joinRoom", ({roomId,user}) => {
            socket.join(roomId);
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

        socket.on("disconnect", () => {
            console.log("❌ User disconnected: " + socket.id);
        });
    })

}

module.exports = socketConnection