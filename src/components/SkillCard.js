import { Fragment } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";

const SkillCard = (props) => {
  return (
    <Fragment>
      <Card elevation={4}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar alt={props.alt} src={props.src}>
                {props.alt}
              </Avatar>
            }
            title={props.title}
            subheader={props.subheader}
          ></CardHeader>
        </CardActionArea>
      </Card>
    </Fragment>
  );
};

export default SkillCard;
