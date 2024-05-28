const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const app = express();

app.use("/", function(req, res) {
    res.sendFile(path.join(__dirname, './chair1.html'));
});

app.listen(8080);

const websocket = require('ws');

const wss = new websocket.Server({port:8081});

wss.on('connection', (ws)=>{
    ws.on('message',(msg)=>{
        if(msg=='start')
            {
                console.log('start')
                if(msg=='isChair1')
                    {
                        ws.send('Chair1');
                        console.log('이용중인 좌석입니다.');
                    };
                
        
                if(msg=='noChair1')
                    {
                        console.log('이용가능한 좌석입니다.');
                        ws.send('NoChair1');
                    };
            }
    });
});