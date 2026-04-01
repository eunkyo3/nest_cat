import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './cats.schema';
import mongoose, { Model, Types } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import { CommentsSchema } from 'src/comments/comments.schema';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async findAll() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);

    const result = await this.catModel
      .find()
      .populate('comments', CommentsModel);
    return result;
  }

  async findCatByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    cat!.imgUrl = `http://localhost:8000/media/${fileName}`;
    const newCat = await cat?.save();
    console.log(newCat);
    return newCat!.readOnlyData;
  }

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<CatDocument | null> {
    const cat = await this.catModel.findById(catId).select('-password');
    return cat;
  }

  async findCatByEmail(email: string): Promise<CatDocument | null> {
    const user = await this.catModel.findOne({ email });
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.catModel.exists({ email });
      return !!result;
    } catch {
      throw new HttpException('db error', 400);
    }
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}
