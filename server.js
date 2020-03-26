const WS = require('ws')

let chat = {
    id: "chat_test",
    name: "User name or chat name",
    user: {
        connection: true,
        statusText: "ready to start working!"
    },
    messages: [
        {
            user: {
                id: "interlocutor_id",
                name: "Vladimir",
                img: "https://image.freepik.com/free-vector/_18591-58479.jpg"
            },
            msg: "Привет!",
            uptime: 1585033112
        }
    ]
}
let msgNum = 0
const msgReference = ['Как дела?', 'Отлично', 'Хорошая погода', 'Снег', 'И так далее...' ]

const wss = new WS.Server({ port: 3000 })

wss.broadcast = function (data) {
    wss.clients.forEach(client => {
        if(data) client.send(JSON.stringify(data))
    })
}

wss.interlocutor = function () {
    setTimeout(() => {
        chat.messages.push({
            user: {
                id: "interlocutor_id",
                name: "Vladimir",
                img: "https://image.freepik.com/free-vector/_18591-58479.jpg"
            },
            msg: msgReference[msgNum],
            uptime: 1585033112
        })
        wss.broadcast(chat)
        msgNum += 1
        if(msgReference.length === msgNum) msgNum = 0
    }, 2500)
}

wss.on('connection', ws => {
    ws.on('message', msg => {
        try {
            let message = JSON.parse(msg)
            switch (message.type) {
                case 'join':
                    wss.broadcast(chat)
                    break;
                case 'message':
                    chat.messages.push(message.data)
                    wss.broadcast(chat)
                    wss.interlocutor()
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error)
        }
    })
})

console.log('server is running')