# Meal Ticket Buddy Planner (Demo)

This is an application to help you plan your meal tickets.

식권 공동구매 설문조사를 목적으로 개발되었습니다.

추가 개발 계획: 미정

## Progress

- ❌: Users can register plans - Using hard coded `src/data/plans.json`.
- ❌: Server configuration - Using next.js API route.
- ❌: Database configuration - Using json file as a database.
- ❌: Plan recommendation - Only suggest one single plan, cannot combine multiple plans.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:6120](http://localhost:6120) with your browser to see the result.

## Changelog

### v0.2.3

- add cron job `ClearTickets` that clears survey results to reset demo app periodically.

### v0.2.2

- rename pie chart to SurveyPieChart
- remove repetative unit price column from the plans table

### v0.2.1

- fix build
- fix api route context type

### v0.2.0

- improve information section
- implement plans table
- remove package-lock.json

### v0.1.0

- implement result pie chart
- Initial commit
