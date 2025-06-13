import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Ticket } from "@/lib/types";
import Tickets from "@/lib/tickets";
import plans from "@/data/plans.json";

interface Plan {
  quantity: number;
  unit_price: number;
  discount_rate: number;
  return_quantity: number;
}

interface PlanTableProps {
  tickets?: Ticket[];
}

export function PlanTable({ tickets }: PlanTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const targetPlan = tickets ? Tickets.getNearestPlan(tickets) : null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>구입매수</TableHead>
          <TableHead>단가</TableHead>
          <TableHead>할인율</TableHead>
          <TableHead>식권교부매수</TableHead>
          <TableHead>총 금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan: Plan) => (
          <TableRow
            key={plan.quantity}
            className={cn(
              "transition-colors",
              targetPlan?.quantity === plan.quantity && [
                "bg-primary/20",
                "border-2",
                "font-extrabold",
              ]
            )}
          >
            <TableCell>{plan.quantity.toLocaleString()}장</TableCell>
            <TableCell>{formatCurrency(plan.unit_price)}</TableCell>
            <TableCell>{formatPercentage(plan.discount_rate)}</TableCell>
            <TableCell>{plan.return_quantity.toLocaleString()}장</TableCell>
            <TableCell>
              {formatCurrency(plan.quantity * plan.unit_price)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PlanTableSection(props: PlanTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>식권 할인 가격표</CardTitle>
        <CardDescription>
          구매 수량에 따른 할인율과 식권 교부 매수를 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlanTable {...props} />
      </CardContent>
    </Card>
  );
}
