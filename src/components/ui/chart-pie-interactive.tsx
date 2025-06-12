"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import "@/lib/tickets";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket } from "@/lib/types";
import Tickets from "@/lib/tickets";

export const description = "An interactive pie chart";

const colors = [
  "#3b82f6", // Blue
  "#f43f5e", // Rose
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#0ea5e9", // Sky
  "#84cc16", // Lime
  "#64748b", // Slate
];

const createChartConfig = (data: Ticket[]) => {
  return data.reduce((acc, item, idx) => {
    acc[item._ticketId] = {
      _ticketId: item._ticketId,
      label: item.username,
      color: colors[idx % colors.length],
    };
    return acc;
  }, {} as Record<string, { _ticketId: string; label: string; color: string }>);
};

export function ChartPieInteractive({
  defaultValue = "",
  values,
}: {
  defaultValue?: string;
  values: Ticket[];
}) {
  const id = "pie-interactive";
  const [activeSection, setActiveSection] = React.useState(
    defaultValue || values[0]._ticketId
  );

  const plan = React.useMemo(() => {
    return Tickets.getNearestPlan(values);
  }, [values]);

  const modifiedValues = React.useMemo(() => {
    if (!plan) return values;
    const totalQuantity = values.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );
    return Tickets.getDiscountedAmmounts(
      [
        ...values,
        {
          _ticketId: "joker",
          username: "Joker",
          quantity: plan.return_quantity - totalQuantity,
        },
      ],
      plan
    );
  }, [values, plan]);

  const chartConfig: ChartConfig = React.useMemo(
    () => createChartConfig(modifiedValues),
    [modifiedValues]
  );

  const activeIndex = React.useMemo(
    () => modifiedValues.findIndex((item) => item._ticketId === activeSection),
    [modifiedValues, activeSection]
  );
  const ids = React.useMemo(
    () => modifiedValues.map((item) => item._ticketId),
    [modifiedValues]
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>식권 공동구매 모집 현황</CardTitle>
        </div>
        <div className="text-xs text-muted-foreground">
          {plan
            ? `현재 단계: ${plan.quantity}개 구매 시 ${plan.return_quantity}개 제공`
            : "식권 개수 한계 초과(1,070개)"}
        </div>
        <Select value={activeSection} onValueChange={setActiveSection}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {ids.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];
              if (!config) {
                return null;
              }
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config.color ?? "var(--color-chart-1)",
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={modifiedValues.map((item) => ({
                ...item,
                fill:
                  chartConfig[item._ticketId]?.color ?? "var(--color-chart-1)",
              }))}
              dataKey="quantity"
              nameKey="username"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => {
                return (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                );
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {modifiedValues[
                            activeIndex
                          ].quantity.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {(
                            modifiedValues[activeIndex].ammount ?? "-"
                          ).toLocaleString()}
                          원
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
