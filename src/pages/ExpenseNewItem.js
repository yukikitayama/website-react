import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
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

const ExpenseNewItem = () => {
  const [value, setValue] = useState(new Date("2021-10-21T16:40:00"));
  const [type, setType] = useState("expense");

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const typeChangeHandler = (event) => {
    setType(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    console.log(event);
  };

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={formSubmissionHandler}>
          <Card sx={{ width: { md: "70%" }, mt: 3 }}>
            <CardHeader title="Add New Item" />
            <CardContent>
              <Stack spacing={1}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/dd/yyyy"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TextField label="Account" variant="outlined" />
                <Select value={type} label="Type" onChange={typeChangeHandler}>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                </Select>
                <TextField label="Amount" variant="outlined" />
                <TextField label="Place" variant="outlined" />
                <TextField label="Memo" variant="outlined" />
              </Stack>
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Submit</Button>
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
          </Card>
        </form>
      </LocalizationProvider>
    </Fragment>
  );
};

export default ExpenseNewItem;
