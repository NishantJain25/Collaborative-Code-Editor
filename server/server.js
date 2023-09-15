import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const server = app.listen(process.env.PORT || 3005, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let rooms = new Map();
const maxClients = 2;

io.on("connection", (socket) => {
  global.chatSockets = socket;
  console.log("connected");

  socket.on("room-message", (data) => {
    const type = data.type;
    const params = data.params;

    const create = (params) => {
      const room = params.code;
      socket.userName = params.userName;
      if (Object.keys(rooms).includes(room)) {
        console.log("Room already exists");
        socket.emit("room-error", {
          error: "Room already exists",
        });
        return;
      }
      rooms[room] = [socket];
      socket["room"] = room;
      console.log(room);

      socket.emit("room-joined", {
        room: room,
        users: [socket.userName],
      });
    };
    const join = (params) => {
      const room = params.code;
      const userName = params.userName;
      socket.userName = userName;
      if (!Object.keys(rooms).includes(room)) {
        console.log("Room does not exist");
        socket.emit("room-error", {
          error: "Room does not exist",
        });
        return;
      }
      if (rooms[room].length >= maxClients) {
        console.log("room is full");
        socket.emit("room-error", {
          error: "Room is full",
        });
        return;
      }

      rooms[room].push(socket);
      socket["room"] = room;

      let users = [];
      rooms[room].forEach((client) => {
        console.log(client.userName);
        users.push(client.userName);
      });
      console.log("joined room: ", users);
      socket.emit("room-joined", {
        room: room,
        users: users,
      });
      rooms[room].forEach((client) => {
        if (client !== socket) {
          client.emit("new-user", {
            users: users,
          });
        }
      });
    };
    const leave = (params) => {
      const room = socket.room;
      rooms[room] = rooms[room].filter((client) => client !== socket);
      socket["room"] = undefined;
    };

    switch (type) {
      case "create":
        create(params);
        break;
      case "join":
        join(params);
        break;
      case "leave":
        leave(params);
        break;
      default:
        console.log(`Type ${type} not handled`);
        break;
    }
  });

  socket.on("update-state", (data) => {
    const room = socket.room;
    console.log(data);
    console.log("Sending updates to new user");
    rooms[room].forEach((client) => {
      if (client !== socket) {
        console.log(client)
        client.emit("initial-update", {
          data: data,
        });
      }
    });
  });
  
  socket.on("editor-change", (payload) => {
    const room = socket.room
    rooms[room].forEach((client) => {
      if(client !== socket){
        console.log("Sending editor changes")
        client.emit("editor-changed",payload)
      }
    })
  })
  socket.on("custom-input-change", (payload) => {
    const room = socket.room
    rooms[room].forEach((client) => {
      if(client !== socket){
        console.log("Sending editor changes")
        client.emit("custom-input-changed",payload)
      }
    })
  })
  socket.on("compile", () => {
    const room = socket.room
    rooms[room].forEach((client) => {
      if(client !== socket){
        client.emit("compile")
      }
    })
  })
  socket.on("theme-change", (data) => {
    const room = socket.room
    console.log("theme change : ", data)
    rooms[room].forEach((client) => {
      if(client !== socket){
        client.emit("theme-change", data )
      }
    })
  })
  socket.on("language-change", (data) => {
    const room = socket.room
    console.log("language change : ", data)
    rooms[room].forEach((client) => {
      if(client !== socket){
        client.emit("language-change", data )
      }
    })
  })
}

);
