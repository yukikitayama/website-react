import { Fragment } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

const DashboardCard = (props) => {
  return (
    <Fragment>
      <Card elevation={4}>
        <CardActionArea>
          <CardHeader
            title={props.title}
            subheader={props.subheader}
            avatar={props.icon}
            titleTypographyProps={{ variant: "h4" }}
          />
          {props.image && <CardMedia component="img" alt="Architecture" image={props.image} />}
          <CardContent>
            {/* <Typography variant="body1">{props.content}</Typography> */}
            <Typography component={"span"} variant={"body1"}>
              {props.content}
            </Typography>
            {/* {props.content} */}
          </CardContent>
        </CardActionArea>
      </Card>
    </Fragment>
  );
};

export default DashboardCard;
