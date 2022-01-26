import { Fragment } from "react";
import { useLocation } from 'react-router-dom';
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
import parse from 'html-react-parser';

const SkillContent = () => {
  const location = useLocation();
  const {title, category, date, content} = location.state;

  return (
    <Fragment>
      <Grid container p={4} pb={10} justifyContent="center">
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={title}
              titleTypographyProps={{ variant: "h4" }}
              subheader={`${category} | ${date}`}
              avatar={<Avatar></Avatar>}
            />
            <CardContent>
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
