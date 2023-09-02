import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDeleteResult } from 'src/common/interfaces/delete-result.interface';
import { ObjId } from 'src/common/types/obj-id.type';
import { ConfirmationDocument, ConfirmationModel } from './../schemas/confirmation.schema';

@Injectable()
export class ConfirmationsService {
  constructor(
    @InjectModel(ConfirmationModel.name) private confirmationModel: Model<ConfirmationModel>
  ) {}

  async createOne(confirmation: Partial<ConfirmationDocument>): Promise<ConfirmationDocument> {
    return this.confirmationModel.create(confirmation);
  }

  async findOneOrFail(query): Promise<ConfirmationDocument> {
    const foundConfirmation: ConfirmationDocument = await this.confirmationModel.findOne(query);
    if (!foundConfirmation) {
      throw new NotFoundException();
    }
    return foundConfirmation;
  }

  async deleteOneById(confirmationId: ObjId): Promise<IDeleteResult> {
    return this.confirmationModel.deleteOne({
      _id: confirmationId,
    });
  }
}
