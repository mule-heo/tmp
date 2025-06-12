"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartPieInteractive } from "@/components/ui/chart-pie-interactive";
import useSWR from "swr";
import { Ticket } from "@/lib/types";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function Home() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [username, setUsername] = useState("");
  const [quantity, setQuantity] = useState(0);
  const handleChangeQuantity = (value: number) => {
    if (isNaN(value)) setQuantity(0);
    else setQuantity(clamp(value, 0, 1000));
  };

  useEffect(() => {
    const saved = localStorage.getItem("ticketId");
    if (saved) {
      setTicket(JSON.parse(saved));
    }
  }, []);

  const {
    data: tickets,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<Ticket[]>("/api/tickets", async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch tickets");
    }
    return res.json();
  });

  if (isLoading || !tickets || isValidating) {
    return null;
  }

  const handleSubmit = () => {
    const newTicket = { username, quantity };

    fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create ticket");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("ticketId", JSON.stringify(data));
        setTicket(data);
        mutate();
      })
      .catch((error) => {
        console.error("Error creating ticket:", error);
      });
  };

  const handleCancel = () => {
    if (ticket) {
      fetch(`/api/tickets/${ticket._ticketId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete ticket");
          }
          return res.json();
        })
        .then(() => {
          localStorage.removeItem("ticketId");
          setTicket(null);
          mutate();
        })
        .catch((error) => {
          console.error("Error deleting ticket:", error);
        });
    }
  };

  return (
    <main className="p-10 xl:min-w-xl md:min-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">식권 공동구매 설문조사</h1>
      <SurveyResult
        tickets={tickets}
        ticket={ticket}
        handleCancel={handleCancel}
      />
      {!ticket && (
        <SurveyFormInner
          username={username}
          setUsername={setUsername}
          quantity={quantity}
          handleChangeQuantity={handleChangeQuantity}
          handleSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

function SurveyFormInner({
  username,
  setUsername,
  quantity,
  handleChangeQuantity,
  handleSubmit,
}: {
  username: string;
  setUsername: (value: string) => void;
  quantity: number;
  handleChangeQuantity: (value: number) => void;
  handleSubmit: () => void;
}) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        이름과 구매를 원하는 식권 수량을 입력해주세요.
      </p>
      <label className="block mb-2">이름</label>
      <Input
        placeholder="이름을 입력하세요"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="block mt-4 mb-2">수량</label>
      <Input
        type="number"
        placeholder="수량을 입력하세요"
        value={quantity}
        min={0}
        max={1000}
        onChange={(e) => handleChangeQuantity(parseInt(e.target.value))}
      />
      <Button onClick={handleSubmit} disabled={!username || quantity <= 0}>
        등록
      </Button>
    </>
  );
}

function SurveyResult({
  tickets,
  ticket,
  handleCancel,
}: {
  tickets: Ticket[];
  ticket: Ticket | null;
  handleCancel: () => void;
}) {
  return (
    <>
      <ChartPieInteractive defaultValue={ticket?._ticketId} values={tickets} />
      {ticket && (
        <Button onClick={handleCancel} variant="destructive">
          취소
        </Button>
      )}
    </>
  );
}
