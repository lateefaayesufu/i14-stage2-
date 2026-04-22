import styles from '../../../assets/styles/modules/modal/sub/confirmDelete.module.css';
import Button from '../../button/Button';
import localDB from '../../../services/localStorage';
import { useState } from 'react';

interface ConfirmDeleteProps { id: string; close: () => void; goHome: () => void; }

const ConfirmDelete = ({ id, close, goHome }: ConfirmDeleteProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleCancel = () => close();

  const handleDelete = () => {
    setIsClicked(true);
    localDB.remove(id);
    setIsClicked(false);
    close();
    goHome();
  };

  return (
    <>
      <h2 className='text--h2'>Confirm Deletion</h2>
      <p className='py-1 body-text-2'>
        Are you sure you want delete invoice{' '}
        <span className='standout'>#{id}</span>. This action cannot be undone.
      </p>
      <div className={styles.confirmDeleteBtn}>
        <Button variant='editButton' onClick={handleCancel}>Cancel</Button>
        <Button variant='deleteButton' onClick={handleDelete} disabled={isClicked}>Delete</Button>
      </div>
    </>
  );
};

export default ConfirmDelete;