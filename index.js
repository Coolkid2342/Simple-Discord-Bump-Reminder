const Discord = require("discord.js");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILD_MESSAGES]});
const { token } = require("./config.json");
const fs = require("fs");
client.login(token);

client.on("ready", () => {
  console.log("Logged in as " + client.user.username);
  setInterval(() => {
    if (fs.existsSync("./bumps.json")) {
      fs.readFile("./bumps.json", "utf8", (err, data) => {
        var obj = JSON.parse(data);
        if (obj.endtime < Date.now()) {
          bumpReady(obj, client);
        }
      });
    }
  }, 5000);
});
async function bumpReady(obj, client) {
  var embed = new Discord.MessageEmbed()
    .setTitle("Bump Ready!")
    .setDescription("The server bump is now ready!");
  await client.channels.fetch(obj.channelID).then((channel) => {
    channel.send(embed);
  });
  fs.unlinkSync("./bumps.json");
}
client.on("message", (message) => {
  if (message.author.id === "302050872383242240") {
    if (message.embeds[0].description.includes("Bump done")) {
      var timeforfinish = Date.now() + 7200000;
      var forTheFile = `{
    "endtime": ${timeforfinish},
    "channelID": "${message.channel.id}"
  }`;
      fs.writeFile("./bumps.json", forTheFile, (err) => {
        if (err) {
          message.channel.send(err);
        } else {
          message.react("⏰");
        }
      });
    }
  } else if (message.content.startsWith("!forceReminder")) {
    var timeforfinish = Date.now() + 7200000;
    var forTheFile = `{
  "endtime": ${timeforfinish},
  "channelID": "${message.channel.id}"
}`;
    fs.writeFile("./bumps.json", forTheFile, (err) => {
      if (err) {
        message.channel.send(err);
      } else {
        message.react("⏰");
      }
    });
  }
});
