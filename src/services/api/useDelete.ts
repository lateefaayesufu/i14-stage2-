import localDB from '../localStorage';

export async function useDelete(_url: string, id: string): Promise<void> {
  localDB.remove(id);
}