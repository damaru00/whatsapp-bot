const app = express();
const port = 3000

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {

    let chat = await message.getChat();
    //console.log(chat);
    chat.sendSeen();


	if(message.body === '!ping') {

        fs.readFile('/opt/whatsapp-bot/SomeFile.txt', 'utf8', function (err,data) {
  	if (err) {
    		return console.log(err);
  	}
  	console.log(data);
        client.sendMessage(groupid, data);

	});

        message.reply('pong');
        client.sendMessage(groupid, 'Legionarios a Desplegar!');
    }
    
});

client.initialize();


app.get("/send-backup-verifier/:date", (req,res) => {
    var date = req.params.date
    res.send(`message sent`)
    fs.readFile(`/opt/whatsapp-bot/text-files/#{date}`, 'utf8', function (err,data) {
        if (err) {
                return console.log(err);
        }
        //console.log(data);
        client.sendMessage(groupid, data);

    });
});

app.listen(port, () => console.log(`Server Listening at port ${port}`));
