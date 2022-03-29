import prisma from "../../../prisma";
import scheduleTimer from "./timer.service";

const timerEvent = async () => {
  const timers = await prisma.classes.findMany();
  for (const timer of timers) {
    await scheduleTimer(timer);
  }
};

export default timerEvent;
