import localDB from '../localStorage';
import { InvoiceType } from '../../types/InvoiceTypes';

export const useFetchData = async (_url: string): Promise<{ invoices: InvoiceType[] }> => {
  return { invoices: localDB.getAll() };
};

export const useFetchDatabyId = async (_url: string, params: { id: string }): Promise<{ invoice: InvoiceType | undefined }> => {
  return { invoice: localDB.getById(params.id) };
};