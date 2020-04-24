import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  categoryTitle: string;
}

class CreateCategoryService {
  public async execute({ categoryTitle }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    if (category) {
      return category;
    }

    const newCategory = categoryRepository.create({
      title: categoryTitle,
    });

    try {
      await categoryRepository.save(newCategory).then(() => {
        return newCategory;
      });
    } catch (err) {
      const fallBackCategory = await categoryRepository.findOne({
        where: { title: categoryTitle },
      });

      if (fallBackCategory) return fallBackCategory;
    }

    return newCategory;
  }
}

export default CreateCategoryService;
