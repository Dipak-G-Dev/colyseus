import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import path from 'path';
import serveIndex from 'serve-index';
import express from 'express';
import { LobbyRoom, RelayRoom } from 'colyseus';
import { ChatRoom } from "./rooms/MyRoom";

export default Arena({
    getId: () => "Your Colyseus App",
    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        gameServer.define("lobby", LobbyRoom);

        // Define "relay" room
        gameServer.define("relay", RelayRoom, { maxClients: 4 })
            .enableRealtimeListing();

        // Define "chat" room
        gameServer.define("chat", ChatRoom)
            .enableRealtimeListing();
        gameServer.define("chat_with_options", ChatRoom, {
            custom_options: "you can use me on Room#onCreate"
        });

        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
          });


    },

    initializeExpress: (app) => {
        app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use('/', express.static(path.join(__dirname, "static")));
        app.use('/colyseus', monitor());
    },


    beforeListen: () => {
    }
});