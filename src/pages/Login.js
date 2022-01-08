import { Fragment, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Auth } from "aws-amplify";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from '@mui/material/LinearProgress';

import { authActions } from '../store/auth-slice';
import { calculateRemainingTime } from '../utils/helpers';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const logoutHandler = useCallback(async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      dispatch(authActions.logout());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }, [dispatch]);

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const signInResponse = await Auth.signIn(email, password);
      const idToken = signInResponse.signInUserSession.idToken;
      const jwtToken = idToken.jwtToken;
      // Type: number, unit: second, meaning: Datetime when the ID expires
      // By default, expires in 1 hour
      const exp = idToken.payload.exp;
      const expirationTime = new Date(exp * 1000);
      
      // Update state
      localStorage.setItem('token', jwtToken);
      // toISOString() return UTC datetime string
      localStorage.setItem('expirationTime', expirationTime.toISOString());
      dispatch(authActions.login({token: jwtToken}))

      const remainingTime = calculateRemainingTime(expirationTime);

      // Set auto logout timer
      setTimeout(logoutHandler, remainingTime);

      setIsLoading(false);
      console.log('signin success');
      history.replace('/dashboard');
    } catch (error) {
      setIsLoading(false);
      alert(`error signing in: ${error}`);
    }
  };

  return (
    <Fragment>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item sx={{ width: { xs: "100%", md: "70%" }, mt: 3 }}>
          <form onSubmit={formSubmissionHandler}>
            <Card>
              <CardHeader title="Login" />
              <CardContent>
                <Stack spacing={1}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    required
                    helperText="Required"
                    onChange={emailChangeHandler}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    required
                    helperText="Required"
                    onChange={passwordChangeHandler}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" type="submit">
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to={"/dashboard"}
                    variant="contained"
                    color="warning"
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardActions>
              {isLoading && <LinearProgress color="secondary" />}
            </Card>
          </form>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Login;
