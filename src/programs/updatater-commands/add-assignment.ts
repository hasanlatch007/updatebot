import { CollectorFilter, Emoji, Message, MessageReaction, User } from "discord.js";
import prisma from "../../../prisma";
import Tools, { months } from "../../common/tools";



async function addAssignment(message: Message) {
    //!addHW className assignment
    const [, className, assignment] = message.content.split(" ")

    if (!className || !assignment) {
        await message.reply("Incorrect Syntax, Usage: `!addHW CLASS_NAME ASSIGNMENT`");
        return;
    }

    const maybeClass = await prisma.classes.findMany({where: {className: {in: className, mode: "insensitive"}}})

    if (!maybeClass) {
        await message.reply("Class not found!")
        return
    }

    const askDate = await message.channel.send("Is there a due date for this assignment? If yes click on ✅, otherwise click on ❎")
    await askDate.react("✅")
    await askDate.react("❎")
    const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) =>
    (reaction.emoji.name === "❎" || reaction.emoji.name === "✅") && !user.bot;
    const hasDate = (await askDate.awaitReactions({filter, time: 60000, max: 1})).first()
    switch (hasDate.emoji.toString()) {
        case "✅":
            await message.channel.send("Okay you can send the date here format: MMM-DD (MMM as the name of the month)")
            const answer = (await message.channel.awaitMessages({filter: answerReply => !answerReply.author.bot && answerReply.author == message.author, time: 60000, max: 1})).first().toString()
            if (answer.length < 2) {
                await message.reply("I prefer if you use a name for the month!");
                return;
            }
            const date = await Tools.getDate(answer)
            if (date == null) {
                await message.reply("I'm unable to understand that date. Could you please specify it in month-date form? Like this: `!birthday december-24`. Thank you!")
                return
            }
            const askConfirmation = await message.channel.send(`Please confirm if this is the correct date! ${months[date.getMonth()]}-${date.getDate()}`)
            await askConfirmation.react("✅")
            await askConfirmation.react("❎")
            const confirmation = (await askConfirmation.awaitReactions({filter: filter, time:60000, max:1})).first()

            if (confirmation.emoji.toString() === "❎") {
                await message.reply("Oof whoever coded this bot sucks, lets try again, or just contact him and yell his bot sucks :')")
                return
            }
            
            await message.channel.send("Attempting to add assignment!")

        case "❎":
            await message.channel.send("Attempting to add assignment!")
    }
}