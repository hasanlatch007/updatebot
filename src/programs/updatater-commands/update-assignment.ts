import { Prisma } from "@prisma/client";
import { CollectorFilter, Message, MessageReaction, User } from "discord.js";
import prisma from "../../../prisma";
import Tools, { MyData } from "../../common/tools";

const updateAssignment = async (message: Message) => {
  //!updateHW CLASSNAME
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

  const maybeChangeDeadline = await message.channel.send(
    "Would you like to update the deadline?"
  );
  await maybeChangeDeadline.react("✅");
  await maybeChangeDeadline.react("❎");
  const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) =>
    (reaction.emoji.name === "❎" || reaction.emoji.name === "✅") && !user.bot;
  const maybeChangeDate = (
    await maybeChangeDeadline.awaitReactions({ filter, time: 60000, max: 1 })
  ).first();

  switch (maybeChangeDate.emoji.toString()) {
    case "✅":
      await message.channel.send(
        "Okay you can send the date here format: MMM-DD (MMM as the name of the month)"
      );

      const answer = (
        await message.channel.awaitMessages({
          filter: (answerReply) =>
            !answerReply.author.bot && answerReply.author == message.author,
          time: 60000,
          max: 1,
        })
      )
        .first()
        .toString();
      if (answer.length < 2) {
        await message.reply("I prefer if you use a name for the month!");
        return;
      }
      const date = await Tools.getDate(answer);
      if (date == null) {
        await message.reply(
          "I'm unable to understand that date. Could you please specify it in month-date form? Like this: `december-24`. Thank you!"
        );
        return;
      }
      dataArray[indexOfData] = {
        dueDate: date.toString(),
        assignment: collectedNewAssignment,
      };
  }

  try {
    //also very ugly but again oh well :KEKW: x2
    await prisma.classes.update({
      where: { id: maybeClass.id },
      data: { assignments: dataArray as unknown as Prisma.JsonValue },
    });
    await message.reply(`Updated assignment to ${collectedNewAssignment}`);
  } catch (e) {
    await message.reply("Failed to updated assignment, contact Duck Friend");
    console.log("Failed to update assignment", e);
  }
};

export default updateAssignment;
