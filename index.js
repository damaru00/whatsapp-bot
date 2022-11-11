const express = require('express')
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const puppeteer = require("puppeteer");

let groupid = '120363043458747929@g.us';
let groupid2 = '120363039385345311@g.us';

const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');


const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--unhandled-rejections=strict'] }
});


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
 chat.sendSeen();

 if (chat.isGroup) {

 let grpid = chat.id._serialized; 

   if(grpid === groupid || grpid === groupid2) {

    if(message.body === '!help') {

       var m = `Commands: 
!backup-verifier mm-dd-yyyy  
!help`;

       message.reply(m);
      }
    }
  }

});

client.initialize();


app.get("/send-backup-verifier/:date", (req,res) => {
    var date = req.params.date;
    res.send("message sent");
    fs.readFile(`/opt/whatsapp-bot/text-files/${date}.txt`, 'utf8', function (err,data) {
        if (err) {
                return console.log(err);
        }
        client.sendMessage(groupid, data);
        client.sendMessage(groupid2, data);
    });
});

app.get("/send-daily-monitoring-report/:date", (req,res) => {
  var date = req.params.date;
  res.send("message sent");

  (async () => {
  const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
  const page = await browser.newPage();
  await page.goto(`http://server-usage.biotechfarms.net/${date}.html`);
  await page.screenshot({path: `images/${date}.png`, fullPage: true });

  await browser.close();

       const media = MessageMedia.fromFilePath(`/opt/whatsapp-bot/images/${date}.png`);
       client.sendMessage(groupid,media);

  })();


});

app.listen(port, () => console.log(`Server Listening at port ${port}`));
