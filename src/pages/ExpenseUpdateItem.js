import { Fragment, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from "@mui/material/LinearProgress";

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const ExpenseUpdateItem = () => {
  const params = useParams();
  const [date, setDate] = useState(new Date());
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(0);
  const [place, setPlace] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenseHandler = async (id) => {
    setIsLoading(true);
    const response = await fetch(`${API_URL}/expense?id=${id}`);
    const data = await response.json();
    const expense = data.expense;

    console.log(expense);
    setDate(expense.date);
    setItem(expense.item);
    setType(expense.type);
    setAmount(expense.amount);
    setPlace(expense.place);
    setMemo(expense.memo);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExpenseHandler(params.id);
  }, [params.id]);

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

  const formSubmissionHandler = () => {

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
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                    <Button
                      component={Link}
                      to={"/expense"}
                      variant="contained"
                      color="warning"
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" color="error">
                      Delete
                    </Button>
                  </Stack>
                </CardActions>
                {isLoading && <LinearProgress color="secondary" />}
              </Card>
            </form>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ExpenseUpdateItem;
