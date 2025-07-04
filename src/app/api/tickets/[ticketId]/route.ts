import { NextResponse } from "next/server";
import { readTickets, writeTickets } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const tickets = await readTickets();
  const { ticketId } = await params;

  if (!tickets[ticketId]) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  delete tickets[ticketId];
  await writeTickets(tickets);

  return NextResponse.json({ success: true });
}
