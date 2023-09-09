import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDeleteResult } from 'src/common/interfaces/delete-result.interface';
import { IUpdateResult } from 'src/common/interfaces/update-result.interface';
import { ObjId } from 'src/common/types/obj-id.type';
import { SessionDocument, SessionModel } from '../schemas/sessions.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(SessionModel.name) private sessionModel: Model<SessionModel>
  ) {}

  async createOne(confirmation: Partial<SessionDocument>): Promise<SessionDocument> {
    return this.sessionModel.create(confirmation);
  }

  async findOneOrFail(query): Promise<SessionDocument> {
    const foundConfirmation: SessionDocument = await this.sessionModel.findOne(query);
    if (!foundConfirmation) {
      throw new NotFoundException();
    }
    return foundConfirmation;
  }

  async findOneByUserId(userId: ObjId): Promise<SessionDocument> {
    return this.sessionModel.findOne({ userId });
  }

  async upsertRefreshTokenForUser(userId: ObjId, newRefreshTokenHash: string): Promise<IUpdateResult> {
    const expiresAtTimestamp: number = Date.now() + parseInt(process.env.SESSION_LIFESPAN_MS);
    return this.sessionModel.updateOne(
      { 
        userId, 
      },
      { 
        refreshTokenHash: newRefreshTokenHash,
        expiresAt: new Date(expiresAtTimestamp),
      },
      {
        upsert: true,
      }
    );
  }

  async deleteOneById(confirmationId: ObjId): Promise<IDeleteResult> {
    return this.sessionModel.deleteOne({
      _id: confirmationId,
    });
  }
}
