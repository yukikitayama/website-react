import { Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const ExpenseNewItem = () => {
  const [date, setDate] = useState(new Date());
  const [item, setItem] = useState("grocery");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState(0);
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const idToken = useSelector((state) => state.auth.token);

  const dateChangeHandler = (newValue) => {
    setDate(newValue);
  };

  const itemChangeHandler = (event) => {
    setItem(event.target.value);
  };

  const typeChangeHandler = (event) => {
    setType(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
  };

  const placeChangeHandler = (event) => {
    setPlace(event.target.value);
  };

  const memoChangeHandler = (event) => {
    setMemo(event.target.value);
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    // Do this extra step since DATE.toISOString() does not returns YYYY-MM-DD in UTC, but I want it in local timezone
    // Get date string in format YYYY-MM-DD in the local timezone
    // getTime() returns milliseconds since Unix Epoch
    // getTimezoneOffset() returns minutes from UTC
    // Newly created Date object has the same date and time, but in UTC
    const yyyyMmDd = (new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)).toISOString().split("T")[0];

    setIsSubmitting(true);

    const response = await fetch(`${API_URL}/expense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This authorization is configured by Amazon Cognito and Amazon API Gateway
        "Authorization": idToken
      },
      body: JSON.stringify({
        date: yyyyMmDd,
        item: item,
        type: type,
        amount: amount,
        place: place,
        memo: memo,
      }),
    });

    response
      .json()
      .then((data) => {
        setIsSubmitting(false);
        console.log(`Success: ${data.message}`);
        history.push("/expense");
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.log(`Error: ${error}`);
      });
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={formSubmissionHandler}>
              <Card>
                <CardHeader title="Add New Item" />
                <CardContent>
                  <Stack spacing={1}>
                    <DesktopDatePicker
                      label="Date *"
                      inputFormat="MM/dd/yyyy"
                      value={date}
                      onChange={dateChangeHandler}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          helperText={params?.inputProps?.placeholder}
                        />
                      )}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="item-label">Item *</InputLabel>
                      <Select
                        labelId="item-label"
                        value={item}
                        label="Item *"
                        onChange={itemChangeHandler}
                      >
                        <MenuItem value="grocery">Grocery</MenuItem>
                        <MenuItem value="lunch">Lunch</MenuItem>
                        <MenuItem value="dinner">Dinner</MenuItem>
                        <MenuItem value="washer">Washer</MenuItem>
                        <MenuItem value="dryer">Dryer</MenuItem>
                        <MenuItem value="rent">Rent</MenuItem>
                        <MenuItem value="google fi">Google Fi</MenuItem>
                        <MenuItem value="cloud computing">Cloud computing</MenuItem>
                        <MenuItem value="education">Education</MenuItem>
                      </Select>
                      <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <FormControl>
                      <InputLabel id="type-label">Type *</InputLabel>
                      <Select
                        labelId="type-label"
                        value={type}
                        label="Type *"
                        onChange={typeChangeHandler}
                      >
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                      </Select>
                      <FormHelperText>Required</FormHelperText>
                    </FormControl>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      required
                      // type="number"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9.]*" }}
                      helperText="Required"
                      defaultValue={amount}
                      onChange={amountChangeHandler}
                    />
                    <TextField
                      label="Place"
                      variant="outlined"
                      required
                      helperText="Required"
                      defaultValue={place}
                      onChange={placeChangeHandler}
                    />
                    <TextField
                      label="Memo"
                      variant="outlined"
                      defaultValue={memo}
                      onChange={memoChangeHandler}
                    />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit" disabled={!isAuth}>
                      Submit
                    </Button>
                    <Button
                      component={Link}
                      to={"/expense"}
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Stack>
                </CardActions>
                {isSubmitting && <LinearProgress color="secondary" />}
              </Card>
            </form>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ExpenseNewItem;
