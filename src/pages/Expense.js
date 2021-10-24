import { Fragment, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
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

import { environment } from "../environments/environments";

const API_URL = environment.apiGatewayUrl;

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchExpensesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/expense`);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      setExpenses(data.expenses);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // useEffect() with [] empty dependency, this will never run again
  // except the component firstly is loaded
  useEffect(() => {
    fetchExpensesHandler();
  }, [fetchExpensesHandler]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Fragment>
      <p>Show the monthly total expenditure</p>
      <p>Show the monthly remaining amount divided by the income</p>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          // width={400}
          // height={400}
          data={expenses}
          // margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          {/* <CartesianGrid /> */}
          <XAxis dataKey="item" />
          <YAxis />
          {/* <Tooltip /> */}
          <Legend />
          <Line type="monotone" dataKey="amount" />
        </LineChart>
      </ResponsiveContainer>
      <Button variant="contained" component={Link} to={"/expense/new-item"}>
        Add New Item
      </Button>
      <p>Show the latest items by each expenditures and incomes</p>
      {isLoading && <LinearProgress color="secondary" />}
      {!isLoading && error && <p>{error}</p>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Memo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.place}</TableCell>
                <TableCell>{row.memo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 5, 10]}
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default Expense;
