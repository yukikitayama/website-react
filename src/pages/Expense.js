import { Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  // CartesianGrid,
  // Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function createData(id, date, account, type, price, place, memo) {
  return { id, date, account, type, price, place, memo };
}

const rows = [
  createData("0", "2021-10-20", "Lunch", "Expenditure", 7, "Smashburger", ""),
  createData("1", "2021-10-20", "Dinner", "Expenditure", 2, "Home", "Cooked"),
  createData("2", "2021-10-20", "Salary", "Income", 10, "Company", ""),
];

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const Expense = () => {
  return (
    <Fragment>
      <p>Show the monthly total expenditure</p>
      <p>Show the monthly remaining amount divided by the income</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          // width={400}
          // height={400}
          data={rows}
          // margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          {/* <CartesianGrid /> */}
          <XAxis dataKey="account" />
          <YAxis />
          {/* <Tooltip /> */}
          <Legend />
          <Line type="monotone" dataKey="price" />
        </LineChart>
      </ResponsiveContainer>
      <p>Button to add a new expense or income item to database</p>
      <Button variant="contained" component={Link} to={"/expense/new-item"}>
        Add New Item
      </Button>
      <p>Show the latest items by each expenditures and incomes</p>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Memo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.account}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.place}</TableCell>
                <TableCell>{row.memo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default Expense;
