import Discord, { Message } from "discord.js"
import prisma from "../../../prisma"



const search = async (message: Message) => {
    const classes = await prisma.classes.findMany()
    let classesString = ""
    classes.forEach(className => classesString = classesString.concat(`${className.className} \n\n`))
    const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("Classes")
    .setDescription(classesString)
    .setFooter({text: "Use !viewHW CLASS_NAME to see assignments for the request class"});

    await message.channel.send({embeds: [embed]})
}

export default search;