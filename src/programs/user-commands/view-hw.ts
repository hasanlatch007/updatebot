import { Prisma } from "@prisma/client";
import Discord, { Message } from "discord.js";
import prisma from "../../../prisma";
import Tools, { months, MyData } from "../../common/tools";

const getDates = async (selectedClass: Prisma.JsonValue[]) => {
  const unsortedDates: (Date | string)[] = [];
  const unknownDates: string[][] = [];
  selectedClass.forEach((entry: unknown | MyData) => {
    const data = <MyData>entry;
    if (data.dueDate != "Unknown date") {
      unsortedDates.push(data.dueDate);
    } else {
      unknownDates.push([data.assignment, data.dueDate]);
    }
  });
  return [unknownDates, unsortedDates.sort()];
};

const viewHW = async (message: Message) => {
  //!viewHW CLASS
  const words = message.content.split(" ").slice(1);
  const [...rest] = words;
  const className = rest.join(" ");

  if (!className) {
    await message.reply("Incorrect Syntax, Usage: `!viewHW CLASS`");
    await message.delete();
    return;
  }

  const doesExist = await prisma.classes.findFirst({
    where: { className: { in: className, mode: "insensitive" } },
  });

  if (!doesExist) {
    await message.reply("Could not find that class!");
    await message.delete();
    return;
  }
  //Implement here to order dates by order
  const todaysDate = new Date();
  let [unknownDates, sortedDates] = await getDates(doesExist.assignments);
  let dataToString = "";
  (sortedDates as Date[]).forEach((dateEntry) => {
    const foundDate = doesExist.assignments.find((entry: unknown | MyData) => {
      const data = <MyData>entry;
      return data.dueDate === dateEntry;
    });
    const convertedData = foundDate as unknown as MyData;
    const timeLeft = Tools.getTimeLeft(new Date(convertedData.dueDate));
    dataToString = dataToString.concat(
      `**${convertedData.assignment}** \n Deadline: ${
        months[new Date(convertedData.dueDate).getMonth()]
      } ${new Date(
        convertedData.dueDate
      ).getDate()} \n Time Left: ${timeLeft} Days \n\n`
    );
  });

  (unknownDates as string[][]).forEach((entry) => {
    dataToString = dataToString.concat(
      `**${entry[0]}** \n Deadline: Unkown Date \n Time Left: NA Days \n\n`
    );
  });

  const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle(doesExist.className)
    .setDescription(dataToString);

  await message.channel.send({ embeds: [embed] });
};

export default viewHW;
