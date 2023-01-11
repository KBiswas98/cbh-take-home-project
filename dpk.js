const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  // return incase no event is passed.
  if (!event) return TRIVIAL_PARTITION_KEY;

  const partitionKey = event?.partitionKey;
  let candidate = partitionKey || JSON.stringify(event);

  if (!partitionKey) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};
