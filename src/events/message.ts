import { Message, TextChannel } from "discord.js";
import Tools from "../common/tools";
import addAssignment from "../programs/updatater-commands/add-assignment";
import createClass from "../programs/updatater-commands/create-class";
import deleteAssignment from "../programs/updatater-commands/delete-assignment";
import deleteClass from "../programs/updatater-commands/delete-class";
import updateAssignment from "../programs/updatater-commands/update-assignment";
import search from "../programs/user-commands/search-classes";
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
  if (firstWord === "!updateHW")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await updateAssignment(message)
      : null;
  if (firstWord === "!deleteClass")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await deleteClass(message)
      : null;
  if (firstWord === "!deleteHW")
    Tools.hasRole(message.member, "Updateter BLOC-1")
      ? await deleteAssignment(message)
      : null;
  if (firstWord === "!viewHW") await viewHW(message);
  if (firstWord === "!classes") await search(message)
};

export default routeMessage;
