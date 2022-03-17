import Discord, { Message } from "discord.js";
import prisma from "../../../prisma";
import { MyData } from "../../common/tools";

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
  let dataToString = "";
  doesExist.assignments.forEach((entry: unknown | MyData) => {
    //very very ugly but meh it works :kekw:
    const data = <MyData>entry;
    const date =
      data.dueDate === "Unknown date"
        ? data.dueDate
        : data.dueDate.split(" ")[1] + " " + data.dueDate.split(" ")[2];
    dataToString = dataToString.concat(
      `**${data.assignment}** \n Deadline: ${date} \n\n`
    );
  });

  const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle(doesExist.className)
    .setDescription(dataToString);

  await message.channel.send({ embeds: [embed] });
};

export default viewHW;
