import { CACHE_PREFIX, cache } from "@/infra";
import { faker } from "@faker-js/faker";
import {
  getChangePasswordRequestEmail,
  invalidChangePasswordLink,
} from "../services/change-password.service";

const LINK_ID = faker.string.uuid();
const EMAIL = faker.internet.email();

describe("modules/user/ChangePassword.unit", () => {
  describe("Verify link id", () => {
    it("Link is expired", async () => {
      jest.spyOn(cache, "ttl").mockResolvedValue(1);
      jest.spyOn(cache, "get").mockResolvedValue(EMAIL);

      expect(async () =>
        getChangePasswordRequestEmail(LINK_ID)
      ).rejects.toThrow(/o link está expirado/i);
    });
    it("Link is invalid", async () => {
      jest.spyOn(cache, "ttl").mockResolvedValue(800);
      jest.spyOn(cache, "get").mockResolvedValue(null);

      expect(async () =>
        getChangePasswordRequestEmail(LINK_ID)
      ).rejects.toThrow(/link de alteração de senha inválido/i);
    });
    it("Link is valid", async () => {
      jest.spyOn(cache, "ttl").mockResolvedValue(800);
      jest.spyOn(cache, "get").mockResolvedValue(EMAIL);

      const email = await getChangePasswordRequestEmail(LINK_ID);
      expect(email).toBe(EMAIL);
    });
  });

  describe("Verify link id", () => {
    it("Should be able to invalid change password cache", async () => {
      jest.spyOn(cache, "del").mockResolvedValue();

      await invalidChangePasswordLink(LINK_ID);

      expect(cache.del).toHaveBeenCalledWith(
        CACHE_PREFIX.RECOVERY_PASSWORD,
        LINK_ID
      );
    });
  });
});
