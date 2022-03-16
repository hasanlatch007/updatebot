import { GuildMember, Message } from "discord.js";

export interface MyData {
  dueDate: string;
  assignment: string;
}

export const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

class Tools {
  static hasRole(member: GuildMember, roleName: string) {
    return !!member.roles.cache.find((role) => role.name === roleName);
  }

  static async getDate(message: string): Promise<Date> {
    const words = message.split(/[\s,-\/.]\s?/);

    const monthNameMatches = months.find((month) =>
      words.find((word) => word.toLowerCase().includes(month))
    );

    let monthNumMatch = -1;
    if (monthNameMatches === undefined) {
      // This will brute force by taking the first word that's a pure number..
      const matches = words.filter((word) => {
        if (word.length > 2) {
          return false;
        }
        const n = parseInt(word);
        if (isNaN(n)) {
          return false;
        }
        return n > 0 && n <= 12;
      });

      if (matches.length > 1 && matches[0] !== matches[1]) {
        // Maybe a bit harsh, but we abort early if we find >= 2 numbers in the message
        // where both of them are numbers <= 12 but not the same.
        return null;
      }
      monthNumMatch = parseInt(matches[0]);
    }

    let messageWithoutMonthNumber = message;
    if (monthNameMatches === undefined) {
      const pre = message.substr(0, message.indexOf(monthNumMatch.toString()));
      const post = message.substr(pre.length + monthNumMatch.toString().length);
      messageWithoutMonthNumber = pre + post;
    }

    const dayMatches = messageWithoutMonthNumber.match(
      /(0[1-9]|[1-3]0|[1-9]+)(st|nd|rd|th)?/
    );

    if (!dayMatches || dayMatches.length < 2) {
      console.log(`Couldn't find a match for a day in ${message}`);
      return null;
    }

    // First one is the JS direct match, 2nd one is first capture group (\d+), which is the actual date
    const day = parseInt(dayMatches[1]);

    if (isNaN(day)) {
      console.log(`Failed to parse ${dayMatches[1]} as an int`);
      return null;
    }

    const month =
      monthNameMatches !== undefined
        ? months.indexOf(monthNameMatches)
        : monthNumMatch - 1;

    if (
      monthNameMatches === undefined &&
      monthNumMatch !== day &&
      monthNumMatch <= 12 &&
      day <= 12
    ) {
      // Cannot find out since i don't know which is month and which is date
      return null;
    }

    return new Date(1972, month, day);
  }
}

export default Tools;
