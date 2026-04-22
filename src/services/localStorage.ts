import data from "../data/data.json";
import { InvoiceType } from "../types/InvoiceTypes";

const KEY = "invoices";

const generateId = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = () => letters[Math.floor(Math.random() * 26)];
  const N = () => Math.floor(1000 + Math.random() * 9000);
  return `${L()}${L()}${N()}`;
};

const getAll = (): InvoiceType[] => {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return JSON.parse(stored);
    // seed with sample data on first load
    const seed = (data as any).invoices as InvoiceType[];
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  } catch {
    return [];
  }
};

const getById = (id: string): InvoiceType | undefined => {
  return getAll().find((inv) => inv.id === id);
};

const create = (invoice: Omit<InvoiceType, "id">): InvoiceType => {
  const all = getAll();
  const newInvoice = { ...invoice, id: generateId() } as InvoiceType;
  localStorage.setItem(KEY, JSON.stringify([...all, newInvoice]));
  window.dispatchEvent(new Event("storage"));
  return newInvoice;
};

const update = (
  id: string,
  updates: Partial<InvoiceType>,
): InvoiceType | undefined => {
  const all = getAll();
  const updated = all.map((inv) =>
    inv.id === id ? { ...inv, ...updates } : inv,
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated.find((inv) => inv.id === id);
};

const remove = (id: string): void => {
  const all = getAll().filter((inv) => inv.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
};

const localDB = { getAll, getById, create, update, remove };
export default localDB;
