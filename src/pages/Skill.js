import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";

import SkillCard from "../components/SkillCard";
import GoogleCloudPng from "../assets/google_cloud.png";
import AwsJpg from "../assets/aws.jpg";
import PythonPng from '../assets/python.png';
import VideoPng from '../assets/video.png';
import DataPng from '../assets/data.png';
import WebsitePng from '../assets/website.png'
import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

// Mapping to show icons
const categoryToIcon = new Map();
categoryToIcon.set('Google Cloud', GoogleCloudPng);
categoryToIcon.set('AWS', AwsJpg);
categoryToIcon.set('Data', DataPng);
categoryToIcon.set('Python', PythonPng);
categoryToIcon.set('Video', VideoPng);
categoryToIcon.set('Website', WebsitePng);

const Skill = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/skill`);
      const data = await response.json();
      setPosts(data.posts);

      // console.log(data.posts);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      {isLoading && <LinearProgress color="secondary" />}
      <Grid
        container
        spacing={2}
        rowSpacing={2}
        justifyContent="center"
        pt={2}
        pb={10}
      >
        {!isLoading &&
          posts.map((post) => (
            <Grid item xs={12} md={6} key={post._id}>
              <SkillCard
                id={post._id}
                alt={post.category}
                title={post.title}
                src={categoryToIcon.get(post.category)}
                subheader={`${post.category} | ${post.date}`}
              />
            </Grid>
          ))}
      </Grid>
    </Fragment>
  );
};

export default Skill;
