import { Prisma, Classes } from "@prisma/client";
import prisma from "../../../prisma";
import { MyData } from "../../common/tools";
import bot from "../../index";
import { TextChannel } from "discord.js";

const handleTimer = async (data: Classes) => {
  try {
    const exists = await prisma.classes.delete({ where: { id: data.id } });
    if (!exists?.id) {
      // Cancelled
      return;
    }
  } catch (e) {
    if (
      !(e instanceof Prisma.PrismaClientKnownRequestError) ||
      e.code !== "P2025"
    ) {
      console.log("Failed to delete timer entry: ", e);
    }
  }
};

const handleReminder = async (className: string, project: string) => {
  const guild = await bot.guilds.fetch(process.env.GUILD_ID);
  const channel = guild.channels.cache.find(
    (channel) => channel.name === "update-des-cours-bloc1"
  ) as TextChannel;
  await channel.send(
    `One day left for project: ${project}, class: ${className}`
  );
};

const scheduleTimer = async (data: Classes) => {
  const convertedData = data as unknown as MyData;
  const timeDiff = new Date(convertedData.dueDate).getTime() - Date.now();
  if (timeDiff <= 0) {
    await handleTimer(data);
  } else {
    setTimeout(() => handleTimer(data), timeDiff);
  }
};

const schedulerReminder = async (data: Classes) => {
  const convertedData = data as unknown as MyData;
  const dayBeforeDueDate = new Date().setDate(
    new Date(convertedData.dueDate).getDate() - 1
  );
  const timeDiff = data.dueDate.getTime() - dayBeforeDueDate;
  if (timeDiff <= 0) {
    await handleReminder(data.className, convertedData.assignment);
  }
};

export default scheduleTimer;
