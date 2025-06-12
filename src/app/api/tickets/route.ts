import { NextResponse } from "next/server";
import { readTickets, writeTickets } from "@/lib/db";
import { Ticket } from "@/lib/types";

export async function POST(req: Request) {
  const { username, quantity } = await req.json();

  if (!username || typeof quantity !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const _ticketId = Math.random().toString(36).slice(2);
  const newTicket: Ticket = { _ticketId, username, quantity };

  const tickets = await readTickets();
  tickets[_ticketId] = newTicket;

  await writeTickets(tickets);

  return NextResponse.json(newTicket);
}

export async function GET() {
  const tickets = await readTickets();
  return NextResponse.json(Object.values(tickets));
}
