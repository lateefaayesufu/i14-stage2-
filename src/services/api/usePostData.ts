import localDB from '../localStorage';
import { InvoiceType } from '../../types/InvoiceTypes';

export async function usePostData(_url: string, data: any): Promise<InvoiceType> {
  return localDB.create(data);
}

export async function usePostDataById(_url: string, id: string, data: any): Promise<void> {
  localDB.update(id, data);
}