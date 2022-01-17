import { Fragment, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const Sleep = () => {
  const [sleep, setSleep] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/fitness/sleep`);
      const data = await response.json();
      setSleep(data.data);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Typography variant="h2" component="div">
        Sleep Log
      </Typography>
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {!isLoading && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={sleep}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalMinutesAsleep" />
            <ReferenceLine y={420} stroke="red" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Fragment>
  );
};

export default Sleep;
