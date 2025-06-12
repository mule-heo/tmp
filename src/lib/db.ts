import fs from "fs/promises";
import path from "path";
import { Ticket } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "src", "data", "tickets.json");

export async function readTickets(): Promise<Record<string, Ticket>> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function writeTickets(tickets: Record<string, Ticket>) {
  await fs.writeFile(DB_PATH, JSON.stringify(tickets, null, 2));
}
