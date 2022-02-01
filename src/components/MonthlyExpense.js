import { Fragment, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const MonthlyExpense = () => {
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/expense?startDate=2021-10-01&endDate=2022-02-01`
        );

        if (!response.ok) {
          throw new Error("Getting monthly expense failed");
        }

        const data = await response.json();

        // console.log("monthly expense: ", data);

        setExpense(data.expenses);
      } catch (error) {
        console.log("error: ", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Monthly Expense
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!isLoading && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={expense}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalExpense" fill="#80cbc4" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Fragment>
  );
};

export default MonthlyExpense;
