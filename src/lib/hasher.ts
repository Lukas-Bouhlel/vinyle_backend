const {
  scryptSync,
  randomBytes,
  timingSafeEqual,
} = await import("node:crypto");

export const hasher = {
  do: (plainText: string): string => {
    const saltySalty = randomBytes(16).toString("hex");
    const hashedBuffer = scryptSync(plainText, saltySalty, 64, { N: 1024 });
    return `${saltySalty}:${hashedBuffer.toString("hex")}`;
  },
  verify: async (plainText: string, stored: string): Promise<boolean> => {
    const [salt, storedHash] = stored.split(":");
    const hash = scryptSync(plainText, salt, 64, { N: 1024 });
    return timingSafeEqual(
      Buffer.from(storedHash, "hex"),
      hash,
    );
  },
};
