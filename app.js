/* eslint-disable @typescript-eslint/no-require-imports */
const { execFileSync } = require("node:child_process");

if (process.platform === "linux") {
  try {
    execFileSync("taskset", ["-p", "-c", "0-3", String(process.pid)], {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("taskset failed:", error.message);
  }
}

const { createServer } = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`Ready on http://${hostname}:${port}`);
  });
});
