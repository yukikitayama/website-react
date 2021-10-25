import { useParams } from 'react-router-dom';

const ExpenseUpdateItem = () => {
  const params = useParams();

  console.log(params.id);

  return <p>Expense Update Item</p>
};

export default ExpenseUpdateItem;