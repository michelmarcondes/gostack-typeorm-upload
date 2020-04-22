import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import sanitizeTransaction from '../utils/SanitizeTransaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const rawTransactions = await transactionRepository.find();

  const transactions = rawTransactions.map(transaction =>
    sanitizeTransaction(transaction),
  );

  const balance = await transactionRepository.getBalance(transactions);

  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  const cleanedTransaction = sanitizeTransaction(transaction);

  return response.json(cleanedTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute({ id });
  response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();

    // Promise.all(
    const transactions = await importTransactionService.execute({
      filename: request.file.filename,
    });
    // );

    response.status(204).json(transactions);
  },
);

export default transactionsRouter;
