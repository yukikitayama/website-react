import { Fragment } from "react";
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardActionArea,
  Avatar,
} from "@mui/material";

import { environment } from '../environments/environments';

const API_URL = environment.apiGatewayUrl;

const SkillCard = (props) => {
  const history = useHistory();

  const getSinglePost = async () => {
    const response = await fetch(`${API_URL}/skill?id=${props.id}`);
    const data = await response.json();
    
    // console.log(data);

    // history.push(`/skill/${props.id}`);
    history.push({
      pathname: `/skill/${props.id}`,
      state: data.post
    });
  };

  return (
    <Fragment>
      <Card elevation={4}>
          <CardActionArea onClick={getSinglePost}>
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
