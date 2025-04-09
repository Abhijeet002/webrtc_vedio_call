import { Server } from "socket.io";


const io = new Server(8000,{
    cors: {
        origin:  "http://localhost:3000", // Use actual frontend URL
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
})


// io.on("connection", (socket)=>{
//     console.log("Socket connected", socket.id)
//     socket.on("disconnect", (reason)=>{
//         console.log("disconnect", reason)
//     })
//     const transport = socket.conn.transport.name; // in most cases, "polling"

//   socket.conn.on("upgrade", () => {
//     const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
//   });
    
// })
// io.on("disconnect", (reason, details) => {
//     // the reason of the disconnection, for example "transport error"
//     console.log("disconnn",reason);
// })


const socketidToEmailMap = new Map()
const EmailtoSocketidMap = new Map()


io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    // socket.removeAllListeners("room:join"); // Avoid duplicate listeners

    socket.on("room:join", (data)=>{
        const {Email,Room}= data;
        socket.join(Room) // joining new user to the room
        EmailtoSocketidMap.set(Email, socket.id);
        socketidToEmailMap.set(socket.id, Email)
        io.to(Room).emit("user:joined", {Email, id: socket.id})  // sending info to everyone in the room new user's credentials
        io.to(socket.id).emit("room:join",data)
        // console.log(data);
    });

    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incoming:call",{from:socket.id, offer})
    })
    
    socket.on("call:accepted",({to ,ans})=>{
        io.to(to).emit("call:accepted",{from:socket.id, ans})

    })

    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected: ${reason}`);
        const Email = socketidToEmailMap.get(socket.id);
    if (Email) {
        EmailtoSocketidMap.delete(Email);
        socketidToEmailMap.delete(socket.id);
    }
    });

    socket.on("error", (error) => {
        console.error(`Socket error: ${error}`);
    }); 

    socket.conn.on("upgrade", () => {
        console.log(`Socket ${socket.id} upgraded to WebSocket`);
    });


});
