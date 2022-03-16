import { Prisma } from "@prisma/client";
import { Message } from "discord.js";
import prisma from "../../../prisma";
import { MyData } from "../../common/tools";

const updateAssignment = async (message: Message) => {
  //!updateAssignment CLASSNAME
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

  message.channel.send("Could you please send the updated assignment?");
  const collectedNewAssignment = (
    await message.channel.awaitMessages({
      filter: (answerReply) =>
        !answerReply.author.bot && answerReply.author == message.author,
      time: 60000,
      max: 1,
    })
  ).first().content;

  dataArray[indexOfData] = {
    dueDate: dataArray[indexOfData].dueDate,
    assignment: collectedNewAssignment,
  };
  dataArray.splice(1, indexOfData);

  //also very ugly but again oh well :KEKW: x2
  await prisma.classes.update({
    where: { id: maybeClass.id },
    data: { assignments: dataArray as unknown as Prisma.JsonValue },
  });
};

export default updateAssignment;
