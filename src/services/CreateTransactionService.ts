import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import GetCategoryService from './GetCategoryService';
import TransactionRepository from '../repositories/TransactionsRepository';
import sanitizeTransaction from '../utils/SanitizeTransaction';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // get category
    const categoryService = new GetCategoryService();
    const persistedCategory = await categoryService.execute({
      categoryTitle: category,
    });

    if (!persistedCategory) {
      throw new AppError('Impossible create or get a category.');
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    // check balance
    const rawTransactions = await transactionRepository.find();
    const transactions = rawTransactions.map(transaction =>
      sanitizeTransaction(transaction),
    );

    const { total } = await transactionRepository.getBalance(transactions);

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Not enough money.');
    }

    // create transaction
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: persistedCategory,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
