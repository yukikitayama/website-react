import { Fragment } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

const DashboardCard = (props) => {
  return (
    <Fragment>
      <Card elevation={4}>
        <CardActionArea>
          <CardHeader title={props.title} subheader={props.subheader} avatar={props.icon} titleTypographyProps={{variant: 'h4'}} />
          <CardContent>
            {/* <Typography variant="body1">{props.content}</Typography> */}
            <Typography component={'span'} variant={'body1'}>{props.content}</Typography>
            {/* {props.content} */}
          </CardContent>
        </CardActionArea>
      </Card>
    </Fragment>
  );
};

export default DashboardCard;
