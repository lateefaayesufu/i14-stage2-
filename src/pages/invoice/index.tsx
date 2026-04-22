import Invoice from './component/Invoice';
import { LoaderFunction } from 'react-router-dom';
import { InvoiceType } from '../../types';
import localDB from '../../services/localStorage';

export interface paramsType {
  id: string;
  invoice: InvoiceType;
}

export const invoiceLoader: LoaderFunction<paramsType> = async ({ params }) => {
  const id = params.id ?? '';
  const invoice = localDB.getById(id);
  return { id, invoice };
};

const InvoicePage = () => {
  return <Invoice />;
};

export default InvoicePage;