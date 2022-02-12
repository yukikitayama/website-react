import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "@mui/material";

import { environment } from "../environments/environments";

const FitnessDaily = (props) => {
  const [dailyData, setDailyData] = useState();
  const mode = useSelector((state) => state.mode.mode);

  useEffect(() => {
    const fetchData = async () => {
      var start = new Date();
      start.setMonth(start.getMonth() - 1);
      start = new Date(start.getTime() - start.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
      var end = new Date();
      end = new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const response = await fetch(
        `${environment.apiGatewayUrl}/fitness/daily?data=${props.data}&start=${start}&end=${end}`
      );
      const responseData = await response.json();
      setDailyData(responseData.data);
    };

    fetchData();
  }, [props.data]);

  return (
    <Fragment>
      <Typography variant="h2" align="center">
        {props.title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dailyData}
          margin={{ top: 10, right: 30, left: 5, bottom: 10 }}
        >
          <XAxis dataKey="date" />
          {props.yAxisDomain ? (
            <YAxis
              label={{
                value: `${props.yAxisLabel}`,
                angle: -90,
                position: "insideLeft",
                fill: mode === "dark" ? "#ffffff" : "#000000",
              }}
              type="number"
              domain={[props.yAxisDomain.min, props.yAxisDomain.max]}
            />
          ) : (
            <YAxis
              label={{
                value: `${props.yAxisLabel}`,
                angle: -90,
                position: "insideLeft",
                fill: mode === "dark" ? "#ffffff" : "#000000",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            dot={false}
            stroke="#80cbc4"
            strokeWidth={3}
          />
          <ReferenceLine
            y={props.target}
            stroke="#cddc39"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default FitnessDaily;
