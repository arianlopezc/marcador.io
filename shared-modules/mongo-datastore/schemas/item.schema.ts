import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { DateTime } from 'luxon';

const schemaOptions: SchemaOptions = {
  autoCreate: true,
  autoIndex: true,
  collection: 'items',
  timestamps: {
    currentTime: () => DateTime.now().toMillis(),
  },
};

@Schema(schemaOptions)
export class Item extends Document {
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  itemId: string;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  total: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
    default: DateTime.now().toMillis(),
  })
  appliedOn: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.index({ itemId: 1 }, { unique: true });
