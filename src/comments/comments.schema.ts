import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CommentsDocument = HydratedDocument<Comments>;

@Schema({ timestamps: true })
export class Comments {
  @ApiProperty({
    description: '작성한 고양이 id',
    required: true,
  })
  @Prop({ type: Types.ObjectId, required: true, ref: 'Cat' })
  @IsString()
  @IsNotEmpty()
  author: Types.ObjectId;

  @ApiProperty({
    description: '댓글 콘텐츠',
    required: true,
  })
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({ default: 0 })
  @IsPositive()
  likeCount: number;

  @ApiProperty({
    description: '작성 대상(게시글, 정보글)',
    required: true,
  })
  @Prop({ type: Types.ObjectId, required: true, ref: 'Cat' })
  @IsNotEmpty()
  info: Types.ObjectId;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
