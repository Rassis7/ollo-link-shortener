import { differenceInSeconds } from "date-fns";

export const expireCacheInSeconds = (futureDate: string | Date | number) => {
  const NOW = new Date();
  const futureDateInDate: Date =
    typeof futureDate === "number" || typeof futureDate === "string"
      ? new Date(futureDate)
      : futureDate;

  if (futureDateInDate.getTime() <= NOW.getTime()) {
    return 0;
  }

  return differenceInSeconds(futureDateInDate, NOW);
};
