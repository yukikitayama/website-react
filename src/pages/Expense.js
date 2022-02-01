import { Fragment, useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Button,
  LinearProgress,
  Typography,
  Grid,
  Box,
} from "@mui/material";

import ExpenseCard from "../components/ExpenseCard";
import TablePaginationActions from "../components/TablePaginationActions";
import { environment } from "../environments/environments";
import MonthlyExpense from "../components/MonthlyExpense";
import ExpenseTrend from '../components/ExpenseTrend';

const API_URL = environment.apiGatewayUrl;

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const history = useHistory();

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - expenses.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clickTableRowHandler = (event, id) => {
    history.push(`/expense/update-item/${id}`);
  };

  return (
    <Fragment>
      <Grid container spacing={2} pt={2} pb={10}>
        <Grid item xs={12} md={6}>
          <ExpenseCard content={<MonthlyExpense />} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpenseCard content={<ExpenseTrend />} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" component="div" align="center">
            Ledger
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* <Grid container justifyContent="center"> */}
            <Button
              variant="contained"
              component={Link}
              to={"/expense/new-item"}
              sx={{ width: { xs: "100%", md: "30%" } }}
            >
              Add New Item
            </Button>
          {/* </Grid> */}
        </Grid>
        <Grid item xs={12}>
          <Box>
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
                  {(rowsPerPage > 0
                    ? expenses.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : expenses
                  ).map((row) => (
                    <TableRow
                      key={row._id}
                      hover={true}
                      onClick={(event) => clickTableRowHandler(event, row._id)}
                    >
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.place}</TableCell>
                      <TableCell>{row.memo}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        10,
                        50,
                        100,
                        { value: -1, label: "All" },
                      ]}
                      count={expenses.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Expense;
