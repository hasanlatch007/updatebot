import { Message } from "discord.js";
import prisma from "../../../prisma";

const deleteClass = async (message: Message) => {
  //!deleteClass CLASSNAME
  const className = message.content.split(" ")[1];

  if (!className) {
    await message.reply("Incorrect Syntax, Usage: `!deleteClass CLASS_NAME`");
    await message.delete();
    return;
  }

  const maybeClass = await prisma.classes.findFirst({
    where: { className: { in: className, mode: "insensitive" } },
  });

  if (!maybeClass) {
    await message.reply("I could not find that class!");
    await message.delete();
    return;
  }

  await prisma.classes.delete({ where: { id: maybeClass.id } });
  await message.reply("Class deleted!");
};

export default deleteClass;
