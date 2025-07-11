import cron from "node-cron";
import { clearTickets } from "./clear-tickets";

cron.schedule("*/30 * * * *", () => {
  console.info(`${new Date().toISOString()}: ClearTickets cron job started`);
  clearTickets();
  console.info(`${new Date().toISOString()}: ClearTickets cron job finished`);
});
