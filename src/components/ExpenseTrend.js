import { Fragment, useEffect, useState } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
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
const API_URL = environment.apiGatewayUrl;

const ExpenseTrend = () => {
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Make budget data
      const today = new Date();
      var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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

      // Get actual expense data
      startDate = (new Date(today.getFullYear(), today.getMonth(), 1)).toISOString().split('T')[0];
      endDate = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/expense?type=daily&startDate=${startDate}&endDate=${endDate}`);
      const expenses = await response.json();

      // Merge
      var cumulativeDailyExpense = 0;
      endDate = new Date();
      endDate = (new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
      const mergedData = [];
      data.forEach((element) => {
        var merged = {date: element.date, budget: element.budget};

        expenses.expenses.forEach((element) => {
          if (merged.date === element.date) {
            cumulativeDailyExpense = cumulativeDailyExpense + element.totalExpense;
            merged.cumulativeDailyExpense = cumulativeDailyExpense;
          }

        if (!merged.cumulativeDailyExpense && merged.date <= endDate) {
          merged.cumulativeDailyExpense = cumulativeDailyExpense;
        }
        });

        mergedData.push(merged)
      });

      setExpense(mergedData);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Expense Trend
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!isLoading && <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={expense}>
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
      </ResponsiveContainer>}
    </Fragment>
  );
};

export default ExpenseTrend;
