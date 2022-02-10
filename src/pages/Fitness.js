import { Fragment } from "react";
import { Grid } from "@mui/material";

import FitnessDaily from '../components/FitnessDaily';

const Fitness = () => {
  return (
    <Fragment>
      <Grid container spacing={2} pt={2} pb={10}>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Sleep" data="sleep" target={420} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Deep Sleep" data="deep-sleep" target={0.18} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Water Intake" data="water" target={2000} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Steps" data="steps" target={8000} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Weight" data="weight" target={60} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FitnessDaily title="Calories Burn" data="calories" target={2500} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Fitness;
