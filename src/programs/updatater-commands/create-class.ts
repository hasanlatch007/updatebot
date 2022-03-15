import { Message } from "discord.js";
import prisma from "../../../prisma";


async function createClass(message: Message) {
    //!createClass 
    const className = message.content.split(" ")[1];

    if (!className) {
        await message.reply("Incorrect Syntax, Usage: `!createClass CLASS_NAME`");
        await message.delete();
        return;
    }

    await prisma.classes.create({ data: { className: className } });
}

export default createClass