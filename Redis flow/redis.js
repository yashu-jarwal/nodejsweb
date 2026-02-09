const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379"
});

client.on("error", (err) => console.log("Redis Error:", err));

(async () => {
  await client.connect();
  console.log("Redis Connected");
})();

module.exports = client;
