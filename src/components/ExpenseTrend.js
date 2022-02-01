import { Fragment } from "react";
import { Typography } from "@mui/material";
import {
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { dateRange } from "../utils/helpers";
import { environment } from "../environments/environments";

const BUDGET = environment.budget;
const CUMULATIVE_DAILY_EXPENSE = [100, 200, 200, 250];

const ExpenseTrend = () => {

  // Make budget data
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const dates = dateRange(startDate, endDate);
  const data = [];
  var currentBudget = BUDGET / dates.length;
  dates.forEach((date) => {
    data.push({ 
      date: date.toISOString().split("T")[0],
      budget: currentBudget
    });
    currentBudget = currentBudget + BUDGET / dates.length;
  });
  CUMULATIVE_DAILY_EXPENSE.forEach((element, index) => {
    data[index].cumulativeDailyExpense = CUMULATIVE_DAILY_EXPENSE[index];
  });

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Expense Trend
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumulativeDailyExpense"
            fill="#80cbc4"
            stroke="#80cbc4"
          />
          <Line type="monotone" dot={false} dataKey="budget" stroke="#cddc39" />
        </ComposedChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default ExpenseTrend;
