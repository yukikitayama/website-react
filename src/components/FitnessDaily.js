import { Fragment, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

import { environment } from '../environments/environments';

const FitnessDaily = (props) => {
  const [dailyData, setDailyData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      var start = new Date();
      start.setMonth(start.getMonth() - 1);
      start = (new Date(start.getTime() - start.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
      var end = new Date();
      end = (new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
      const response = await fetch(`${environment.apiGatewayUrl}/fitness/daily?data=${props.data}&start=${start}&end=${end}`);
      const responseData = await response.json();
      setDailyData(responseData.data);
    };

    fetchData();
  }, [props.data]);

  return <Fragment>
    <Typography variant="h2" align="center">
      {props.title}
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 10}}>
        <XAxis dataKey="date" />
        <YAxis />
        <Line type="monotone" dataKey="value" dot={false} stroke="#80cbc4" strokeWidth={3} />
        <ReferenceLine y={props.target} stroke="#cddc39" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  </Fragment>
};

export default FitnessDaily;