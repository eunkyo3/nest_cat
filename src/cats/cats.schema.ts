import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Comments } from 'src/comments/comments.schema';

export type CatDocument = HydratedDocument<Cat>;

@Schema({ timestamps: true })
export class Cat {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'email',
    required: true,
  })
  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'user',
    description: 'name',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1234',
    description: 'password',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'img',
    description: 'img',
  })
  @Prop({
    default:
      'https://busan.fnnews.com/resource/media/image/2018/08/01/201808010053335858_l.jpg',
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
    comments: Comments[];
  };

  readonly comments: Comments[];
}

const _CatSchema = SchemaFactory.createForClass(Cat);

_CatSchema.virtual('readOnlyData').get(function (this: CatDocument) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

_CatSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'info',
});
_CatSchema.set('toObject', { virtuals: true });
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;
