
const { Server } = require("socket.io");

const socketConnection = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        console.log("user connected " + socket.id);
        
    })

}

module.exports = socketConnection