import dns from "node:dns";

declare global {
  var __dailyRoutineDnsConfigured: boolean | undefined;
}

export function ensureMongoDnsResolution() {
  if (globalThis.__dailyRoutineDnsConfigured) {
    return;
  }

  const configuredServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredServers?.length) {
    dns.setServers(configuredServers);
  } else if (process.platform === "win32") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  }

  globalThis.__dailyRoutineDnsConfigured = true;
}
