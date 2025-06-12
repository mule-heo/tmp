// app/page.tsx (or src/app/page.tsx)
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartPieInteractive } from "@/components/ui/chart-pie-interactive";
import { Table } from "@/components/ui/table";

type Ticket = {
  _ticketId: string;
  username: string;
  quantity: number;
};

export default function Home() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [username, setUsername] = useState("");
  const [quantity, setQuantity] = useState(0);
  const handleChangeQuantity = (value: number) => {
    setQuantity(Math.max(0, value));
  };

  useEffect(() => {
    const saved = localStorage.getItem("ticketId");
    if (saved) {
      setTicket({ _ticketId: saved, username: "SavedUser", quantity: 30 }); // simulate fetch
    }
  }, []);

  const handleSubmit = () => {
    const _ticketId = Math.random().toString(36).slice(2);
    const newTicket = { _ticketId, username, quantity };
    localStorage.setItem("ticketId", _ticketId);
    setTicket(newTicket);
  };

  const handleCancel = () => {
    if (ticket) {
      localStorage.removeItem("ticketId");
      setTicket(null);
    }
  };

  return (
    <main className="p-10 max-w-md mx-auto space-y-4">
      <Table />
      {!ticket ? (
        <>
          <Input
            placeholder="닉네임"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="number"
            placeholder="수량"
            value={quantity}
            min={0}
            onChange={(e) => handleChangeQuantity(parseInt(e.target.value))}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </>
      ) : (
        <SurveyResult ticket={ticket} handleCancel={handleCancel} />
      )}
    </main>
  );
}

function SurveyResult({
  ticket,
  handleCancel,
}: {
  ticket: Ticket;
  handleCancel: () => void;
}) {
  return (
    <>
      <ChartPieInteractive defaultValue={ticket._ticketId} values={[]} />
      <Button onClick={handleCancel} variant="destructive">
        Cancel
      </Button>
    </>
  );
}
