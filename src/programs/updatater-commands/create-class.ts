import { Message } from "discord.js";
import prisma from "../../../prisma";

async function createClass(message: Message) {
  //!createClass
  const words = message.content.split(" ").slice(1);
  const [...rest] = words;
  const className = rest.join(" ");

  if (!className) {
    await message.reply("Incorrect Syntax, Usage: `!createClass CLASS_NAME`");
    await message.delete();
    return;
  }

  const maybeClass = await prisma.classes.findFirst({
    where: { className: { in: className, mode: "insensitive" } },
  });

  if (maybeClass) {
    await message.reply("Class is already created!");
    await message.delete();
    return;
  }

  await prisma.classes.create({ data: { className: className } });
  await message.reply("Created class!");
  await message.delete();
}

export default createClass;
