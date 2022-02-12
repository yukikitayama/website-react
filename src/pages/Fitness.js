import { Fragment } from "react";
import { Grid } from "@mui/material";

import FitnessDaily from '../components/FitnessDaily';

const Fitness = () => {
  return (
    <Fragment>
      <Grid container spacing={2} pt={2} pb={10}>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Sleep" data="sleep" target={420} yAxisLabel="Minutes" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Deep Sleep" data="deep-sleep" target={0.18} yAxisLabel="Percent" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Water Intake" data="water" target={2000} yAxisLabel="ml" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Steps" data="steps" target={8000} yAxisLabel="Steps" />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Weight" data="weight" target={60} yAxisLabel="kg" yAxisDomain={{ min: 55, max: 65}} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Calories Burn" data="calories" target={2500} yAxisLabel="Calories" />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Fitness;
