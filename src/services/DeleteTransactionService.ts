import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found.');
    }

    const { affected } = await transactionRepository.delete(id);

    if (!affected || affected < 1) {
      throw new AppError('Operation Failed', 500);
    }
  }
}

export default DeleteTransactionService;
