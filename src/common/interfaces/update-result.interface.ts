import { ObjId } from '../types/obj-id.type';

export interface IUpdateResult {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: ObjId;
  upsertedCount: number;
  matchedCount: number;
}