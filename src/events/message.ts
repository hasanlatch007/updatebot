import { Message, TextChannel } from "discord.js";
import Tools from "../common/tools";
import addAssignment from "../programs/updatater-commands/add-assignment";
import createClass from "../programs/updatater-commands/create-class";
import updateAssignment from "../programs/updatater-commands/update-assignment";
import viewHW from "../programs/user-commands/view-hw";

const routeMessage = async (message: Message) => {
  if (message.channel.type === "DM" || message.author.bot) return;
  await handleServerMessages(message);
};

const handleServerMessages = async (message: Message) => {
  const words = message.content.split(" ");
  const channel = <TextChannel>message.channel;
  const firstWord = words[0];

  if (firstWord === "!createClass")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await createClass(message)
      : null;
  if (firstWord === "!addHW")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await addAssignment(message)
      : null;
  if (firstWord === "!updateAssignment")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await updateAssignment(message)
      : null;
  if (firstWord === "!viewHW") await viewHW(message);
};

export default routeMessage;
