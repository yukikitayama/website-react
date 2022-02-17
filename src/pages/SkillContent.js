import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  // Typography,
  IconButton,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import parse from "html-react-parser";

import classes from "./SkillContent.module.css";

const SkillContent = () => {
  const location = useLocation();
  const { title, category, date, content, view, alt, src } = location.state;

  return (
    <Fragment>
      <Grid container pt={2} pb={10} justifyContent="center">
        <Grid item xs={12}>
          <Card elevation={4}>
            <CardHeader
              title={title}
              titleTypographyProps={{ variant: "h4" }}
              subheader={`${category} | ${date} | ${view} views`}
              avatar={
                <Avatar alt={alt} src={src}>
                  {alt}
                </Avatar>
              }
            />
            <CardContent className={classes.content}>
              {/* <Typography variant="body2">Some content</Typography> */}
              {/* <Typography component={'span'} variant="body2">{parse(content)}</Typography> */}
              {parse(content)}
            </CardContent>
            <CardActions>
              <IconButton aria-label="like it">
                <FavoriteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SkillContent;
