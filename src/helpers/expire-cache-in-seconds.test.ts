import { addDays } from "date-fns";
import { expireCacheInSeconds } from "./expire-cache-in-seconds";

const ONE_DAY_IN_SECONDS = 24 * 3600;
const NOW = new Date("2024-01-26T00:00:00.000Z");

describe("helpers/expire-cache-in-seconds", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("Should be able to return seconds when set a date ", () => {
    const tomorrow = addDays(NOW, 1);

    const expireIn = expireCacheInSeconds(tomorrow);

    expect(expireIn).toEqual(ONE_DAY_IN_SECONDS);
  });

  it("Should be able to return zero when future date is less than now ", () => {
    const tomorrow = addDays(NOW, -1);

    const expireIn = expireCacheInSeconds(tomorrow);

    expect(expireIn).toEqual(0);
  });
});
