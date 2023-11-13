import bcrypt from "bcrypt";

type VerifyPasswordProps = {
  candidatePassword: string;
  hash: string;
};

export async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function verifyPassword({
  candidatePassword,
  hash,
}: VerifyPasswordProps) {
  return await bcrypt.compare(candidatePassword, hash);
}
