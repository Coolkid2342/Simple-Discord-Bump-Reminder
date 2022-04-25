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
  // Check if message is from the DISBOARD bot
  if (message.author.id === "302050872383242240") {
    // Check if the message is about the bump
    if (message.embeds[0].description.includes("Bump done")) {
      // Create variables for the bump.json file
      var timeforfinish = Date.now() + 7200000;
      var forTheFile = `{
    "endtime": ${timeforfinish},
    "channelID": "${message.channel.id}"
  }`;
      // Create the bump.json file
      fs.writeFile("./bumps.json", forTheFile, (err) => {
        if (err) {
          // If the file write fails sends error to channel the bump happened
          message.channel.send(err);
        } else {
          // If everything runs smoothly react to the message to simplize it worked.
          message.react("⏰");
        }
      });
    }
    // If message starts with !forceReminder run this function
  } else if (message.content.startsWith("!forceReminder")) {
          // Create variables for the bump.json file
    var timeforfinish = Date.now() + 7200000;
    var forTheFile = `{
  "endtime": ${timeforfinish},
  "channelID": "${message.channel.id}"
}`;
    // Create the bumps.json file
    fs.writeFile("./bumps.json", forTheFile, (err) => {
      if (err) {
        // If the file write fails sends error to channel the bump happened
        message.channel.send(err);
      } else {
        // If everything runs smoothly react to the message to simplize it worked.
        message.react("⏰");
      }
    });
  }
});
