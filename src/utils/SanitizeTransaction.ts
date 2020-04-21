import Transaction from '../models/Transaction';

function sanitizeTransaction(transaction: Transaction): Transaction {
  const cleanedTransaction = transaction;
  delete cleanedTransaction.created_at;
  delete cleanedTransaction.updated_at;
  delete cleanedTransaction.category.created_at;
  delete cleanedTransaction.category.updated_at;
  cleanedTransaction.value = parseFloat(cleanedTransaction.value.toString());

  return cleanedTransaction;
}

export default sanitizeTransaction;
