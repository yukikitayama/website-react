import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  LinearProgress,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;
var initialStart = new Date();
initialStart.setDate(initialStart.getDate() - 7);
const initialEnd = new Date();
const initialTop = 1;
const initialBottom = 30;

const TrendStackOverflow = () => {
  const [tagCount, setTagCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const mode = useSelector((state) => state.mode.mode);
  const [top, setTop] = useState(initialTop);
  const [bottom, setBottom] = useState(initialBottom);
  const [dates, setDates] = useState([initialStart, initialEnd]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/trend/stack-overflow?top=${initialTop}&bottom=${initialBottom}&start=${initialStart.toISOString()}&end=${initialEnd.toISOString()}`
      );
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

  const topChangeHandler = (event) => {
    setTop(event.target.value);
  };

  const bottomChangeHandler = (event) => {
    setBottom(event.target.value);
  };

  const updateHandler = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_URL}/trend/stack-overflow?top=${top}&bottom=${bottom}&start=${dates[0].toISOString()}&end=${dates[1].toISOString()}`
    );
    const data = await response.json();
    setTagCount(data.data);

    setIsLoading(false);
  };

  return (
    <Fragment>
      {isLoading && <LinearProgress color="secondary" />}
      <Typography variant="h2" component="div" align="center" pt={2}>
        Stack Overflow
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
          }}
        >
          <Pie
            data={tagCount}
            dataKey="count"
            nameKey="name"
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={5}
            fill="#80cbc4"
            stroke="#80cbc4"
            isAnimationActive={false} // With true, label rendering fails
            // label={renderLabel} // Use when showing tags outside with line connected
            // labelLine={true}
          >
            <LabelList
              dataKey="name"
              position="outside"
              style={{ fontSize: "80%" }}
              stroke={mode === "dark" ? "#ffffff" : "#000000"}
              fill={mode === "dark" ? "#ffffff" : "#000000"}
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Grid container justifyContent="center" spacing={2} pt={2}>
        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            label="Top"
            defaultValue={top}
            onChange={topChangeHandler}
            required
            variant="filled"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            label="Bottom"
            defaultValue={bottom}
            onChange={bottomChangeHandler}
            required
            variant="filled"
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          startText="Start"
          endText="End"
          value={dates}
          onChange={(newDates) => {
            setDates(newDates);
          }}
          renderInput={(startProps, endProps) => (
            <Fragment>
              <Grid container justifyContent="center" spacing={2} pt={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    {...startProps}
                    variant="filled"
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    {...endProps}
                    variant="filled"
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Fragment>
          )}
        />
      </LocalizationProvider>
      <Grid container justifyContent="center" pt={2} pb={10}>
        <Grid item xs={12} md={4}>
          <Button variant="contained" onClick={updateHandler} fullWidth size="large">
            Update
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TrendStackOverflow;
