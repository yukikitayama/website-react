import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  ReferenceLine,
  Label,
} from "recharts";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const MonthlyExpense = () => {
  const [expense, setExpense] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const mode = useSelector((state) => state.mode.mode);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Start date is the first day of a 6 months-ago month
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      startDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000
      );
      startDate.setDate(1);
      startDate = startDate.toISOString().split("T")[0];
      // End date is today
      var endDate = new Date();
      endDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      try {
        const response = await fetch(
          `${API_URL}/expense?startDate=${startDate}&endDate=${endDate}`
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
            <YAxis
              label={{
                value: "USD",
                angle: -90,
                position: "insideLeft",
                fill: mode === "dark" ? "#ffffff" : "#000000",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalExpense" fill="#80cbc4" />
            <ReferenceLine y={environment.budget} stroke="#cddc39">
              <Label
                value={`Budget $${environment.budget}`}
                position="top"
                fill="#cddc39"
              />
            </ReferenceLine>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Fragment>
  );
};

export default MonthlyExpense;
