import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, LinearProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const TrendStackOverflow = () => {
  const [tagCount, setTagCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const mode = useSelector((state) => state.mode.mode);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/trend/stack-overflow`);
      const data = await response.json();
      setTagCount(data.data);
      // console.log(data.data);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // const renderLabel = (entry) => {
  //   return entry.name;
  // };

  return (
    <Fragment>
      {isLoading && <LinearProgress color="secondary" />}
      <Typography variant="h2" component="div" align="center" pt={2}>
        Stack Overflow
      </Typography>
      <ResponsiveContainer width="100%" height={700}>
        <PieChart>
          <Tooltip />
          <Pie
            data={tagCount}
            dataKey="count"
            nameKey="name"
            // label={renderLabel}
            // labelLine={true}
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={5}
            fill="#80cbc4"
            stroke="#80cbc4"
          >
            <LabelList
              dataKey="name"
              position="inside"
              stroke={mode === "dark" ? "#ffffff" : "#000000"}
              fill={mode === "dark" ? "#ffffff" : "#000000"}
              style={{ fontSize: "100%" }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

export default TrendStackOverflow;
