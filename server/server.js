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

  const leave = (socket) => {
    console.log("inside Leaving");
    console.log(socket.userId);
    const room = socket.room;

    if (rooms[room]) {
      console.log("filtering users");
      rooms[room] = rooms[room].filter((client) => client !== socket);
    }
    socket["room"] = undefined;
    console.log("reset socket room");

    console.log("emitting to remaining users");
    try {
      if (rooms[room].length == 0) {
        delete rooms[room]
      } else {
        rooms[room].forEach((client) => {
          console.log(socket.userId);
          client.emit("user-leave", { userId: socket.userId });
        });
        console.log("emitted");
      }

    } catch (error) {
      console.log(error);
    }
  };

  socket.on("room-message", (data) => {
    const type = data.type;
    const params = data.params;

    const create = (params) => {
      const room = params.code;
      socket.userName = params.userName;
      socket.userId = params.userId;
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
        users: [{ name: socket.userName, userId: socket.userId }],
      });
    };
    const join = (params) => {
      const room = params.code;
      const userName = params.userName;
      const userId = params.userId;
      socket.userName = userName;
      socket.userId = userId;

      if (!Object.keys(rooms).includes(room)) {
        console.log("Room does not exist");
        socket.emit("room-error", {
          error: "Room does not exist",
        });
        return;
      }

      if (rooms[room].length >= maxClients && !rooms[room].includes(socket)) {
        console.log("room is full");
        socket.emit("room-error", {
          error: "Room is full",
        });
        return;
      }

      if (!rooms[room].includes(socket)) {
        rooms[room].push(socket);
      }
      socket["room"] = room;

      let users = [];
      rooms[room].forEach((client) => {
        console.log(client.userName);
        users.push({ name: client.userName, userId: client.userId });
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

    switch (type) {
      case "create":
        create(params);
        break;
      case "join":
        join(params);
        break;
      case "leave":
        leave(socket);
        break;
      default:
        console.log(`Type ${type} not handled`);
        break;
    }
  });

  socket.on("update-state", (data) => {
    const room = socket.room;

    console.log("Sending updates to new user");
    rooms[room].forEach((client) => {
      if (client !== socket) {
        console.log(client);
        client.emit("initial-update", {
          data: data,
        });
      }
    });
  });

  socket.on("editor-change", (payload) => {
    const room = socket.room;
    rooms[room].forEach((client) => {
      if (client !== socket) {
        console.log("Sending editor changes");
        client.emit("editor-changed", payload);
      }
    });
  });
  socket.on("custom-input-change", (payload) => {
    const room = socket.room;
    rooms[room].forEach((client) => {
      if (client !== socket) {
        console.log("Sending editor changes");
        client.emit("custom-input-changed", payload);
      }
    });
  });
  socket.on("compile", () => {
    const room = socket.room;
    rooms[room].forEach((client) => {
      if (client !== socket) {
        client.emit("compile");
      }
    });
  });
  socket.on("theme-change", (data) => {
    const room = socket.room;
    console.log("theme change : ", data);
    rooms[room].forEach((client) => {
      if (client !== socket) {
        client.emit("theme-change", data);
      }
    });
  });
  socket.on("language-change", (data) => {
    const room = socket.room;
    console.log("language change : ", data);
    rooms[room].forEach((client) => {
      if (client !== socket) {
        client.emit("language-change", data);
      }
    });
  });
  socket.on("leave-room", () => {
    console.log(socket.userId, " leaving");
    leave(socket);
    console.log(rooms);
  });
  socket.on("disconnect", (reason) => {
    console.log("disconnect");
    if (socket["room"]) {
      leave(socket);
    }
  });
});
