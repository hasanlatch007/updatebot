import { Prisma } from "@prisma/client";
import { Message } from "discord.js";
import prisma from "../../../prisma";
import { MyData } from "../../common/tools";

const deleteAssignment = async (message: Message) => {
  //!deleteHW CLASSNAME
  const words = message.content.split(" ").slice(1);
  const [...rest] = words;
  const className = rest.join(" ");

  if (!className) {
    await message.reply(
      "Incorrect Syntax, Usage: `!updateAssignment CLASS_NAME"
    );
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

  message.channel.send("Could you please send me the old assignment name?");
  const collectedOldAssignment = (
    await message.channel.awaitMessages({
      filter: (answerReply) =>
        !answerReply.author.bot && answerReply.author == message.author,
      time: 60000,
      max: 1,
    })
  ).first().content;
  const dataArray = maybeClass.assignments as unknown as Array<MyData>;
  const data = dataArray.find(
    (info) => info.assignment === collectedOldAssignment
  );
  const indexOfData = dataArray.indexOf(data);
  dataArray.splice(indexOfData, 1);

  try {
    await prisma.classes.update({
      where: { id: maybeClass.id },
      data: { assignments: dataArray as unknown as Prisma.JsonValue },
    });
    await message.reply("Assignment deleted!");
  } catch (e) {
    await message.reply("Failed to delete assignment, contact Duck friend");
    console.log("Failed to delete assignment", e);
  }
};

export default deleteAssignment;
