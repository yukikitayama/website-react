import { Fragment } from "react";
import Grid from "@mui/material/Grid";

import SkillCard from "../components/SkillCard";
import GoogleCloud from "../assets/google_cloud.png";
import AWS from "../assets/aws.png";

const DUMMY = [
  {
    title: "Title 1",
    id: "1",
    category: "Google Cloud",
    date: "2022-01-23",
    src: GoogleCloud,
  },
  { title: "Title 2", id: "2", category: "AWS", date: "2022-01-24", src: AWS },
  { title: "Title 2", id: "3", category: "AWS", date: "2022-01-24", src: AWS },
  { title: "Title 2", id: "4", category: "AWS", date: "2022-01-24", src: AWS },
  { title: "Title 2", id: "5", category: "AWS", date: "2022-01-24", src: AWS },
  { title: "Title 2", id: "6", category: "AWS", date: "2022-01-24", src: AWS },
];

const Skill = () => {
  return (
    <Fragment>
      <Grid
        container
        spacing={2}
        rowSpacing={2}
        justifyContent="center"
        p={2}
        pb={10}
      >
        {DUMMY.map((data) => (
          <Grid item xs={12} md={6} key={data.id}>
            <SkillCard
              alt={data.category}
              src={data.src}
              title={data.title}
              subheader={`${data.category} | ${data.date}`}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};

export default Skill;
