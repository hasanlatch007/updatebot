import Discord, { Message } from "discord.js";
import Tools from "../../common/tools";

const sendHelpMessage = async (message: Message) => {
  const isUpdatater = await Tools.hasRole(message.member, "Updateter BLOC-1");
  let helpMessage =
    "Here is all user commands: \n`!classes`: To see all available classes \n`!viewHW CLASS_NAME`: To see all assignments for this class.";

  if (isUpdatater)
    helpMessage =
      "Here is all user commands: \n`!classes`: To see all available classes \n`!viewHW CLASS_NAME`: To see all assignments for this class. \n\nSince you are an Updatater you have access to special commands: \n`!createClass CLASS_NAME`: Create a new class \n`!addHW CLASS_NAME PROJECT_NAME`: Add an assingment to the selected class\n`!updateHW CLASS_NAME`: Update a project name or deadline in selected class\n`!deleteClass CLASS_NAME`: Delete a class completely\n`!deleteHW CLASS_NAME`: Delete an assignment";
  const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription("Help Menu")
    .setDescription(helpMessage);
  await message.reply({ embeds: [embed] });
};

export default sendHelpMessage;
