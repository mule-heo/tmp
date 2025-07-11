import fs from "fs";
import path from "path";

const ticketsFilePath = path.join(process.cwd(), "src", "data", "tickets.json");

export function clearTickets() {
  try {
    fs.writeFileSync(ticketsFilePath, JSON.stringify([]));
    console.log("Successfully cleared tickets.json");
  } catch (error) {
    console.error("Failed to clear tickets.json:", error);
  }
}

if (require.main === module) {
  clearTickets();
}
