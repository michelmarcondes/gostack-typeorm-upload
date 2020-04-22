import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  categoryTitle: string;
}

const defaultCategory = 'Misc';

class CreateCategoryService {
  public async execute({ categoryTitle }: Request): Promise<Category> {
    // if a category doesn't exist, create
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
      await categoryRepository.save(newCategory);
    } catch (err) {
      const defaultCategoryObj = await categoryRepository.findOne({
        where: { title: defaultCategory },
      });

      if (!defaultCategoryObj) {
        const defaultCategoryCreated = categoryRepository.create({
          title: defaultCategory,
        });

        await categoryRepository.save(defaultCategoryCreated);

        return defaultCategoryCreated;
      }

      return defaultCategoryObj;
    }

    return newCategory;
  }
}

export default CreateCategoryService;
