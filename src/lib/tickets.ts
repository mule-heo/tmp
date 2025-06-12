import plans from "@/data/plans.json";
import { Ticket } from "./types";

interface Plan {
  quantity: number;
  return_quantity: number;
  unit_price: number;
}

export class Tickets {
  public static getNearestPlan(tickets: Ticket[]) {
    const totalTickets = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );
    return plans.find((plan) => plan.return_quantity >= totalTickets);
  }
  public static getDiscountedAmmounts(tickets: Ticket[], plan: Plan) {
    const totalTickets = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );
    if (plan.return_quantity !== totalTickets) {
      throw new Error("Tickets do not match the plan requirements");
    }
    const bonus = (plan.return_quantity - plan.quantity) * plan.unit_price;
    return tickets.map((ticket) => {
      ticket.ammount = Math.floor(
        ticket.quantity * plan.unit_price -
          (ticket.quantity / plan.return_quantity) * bonus
      );
      return ticket;
    });
  }
}

export default Tickets;
