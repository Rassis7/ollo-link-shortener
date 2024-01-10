import { generateHash, verifyPassword } from "@/helpers";
import bcrypt from "bcrypt";

describe("helpers/hash", () => {
  it("should generate a hash passing a password", async () => {
    const hash = await generateHash("12345");

    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should verify password and return true if to be correctly", async () => {
    const bcryptCompareSuccess = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompareSuccess;

    const hash = "any_hash";
    const candidatePassword = "12345";

    const isTruthy = await verifyPassword({ candidatePassword, hash });
    expect(isTruthy).toBeTruthy();
  });

  it("should verify password and return false if to be not correctly", async () => {
    const hash = "any_hash";
    const candidatePassword = "any_password";

    const isFalsy = await verifyPassword({ candidatePassword, hash });
    expect(isFalsy).toBeFalsy();
  });
});
