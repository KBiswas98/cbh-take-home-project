const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("should handle when passed event is an array", () => {
    const event = [1, 2, 3];
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe("string");
  });

  it("should handle when passed event is a boolean value", () => {
    const event = true;
    const result = deterministicPartitionKey(event);
    expect(typeof result).toBe("string");
  });

  it("should return the partitionKey if it is present", () => {
    const event = { partitionKey: "123" };
    const result = deterministicPartitionKey(event);
    expect(result).toBe("123");
  });

  it("should return the SHA3-512 hash of the event if partitionKey is not present", () => {
    const event = { data: "my ticket" };
    const hash = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");
    const result = deterministicPartitionKey(event);
    expect(result).toBe(hash);
  });

  it("should return the truncated SHA3-512 hash of the event if partitionKey is too long", () => {
    const longKey = "a".repeat(300);
    const event = { partitionKey: longKey };
    const hash = crypto.createHash("sha3-512").update(longKey).digest("hex");
    const result = deterministicPartitionKey(event);
    expect(result).toBe(hash);
  });
});
