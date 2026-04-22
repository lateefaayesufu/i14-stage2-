import styles from '../../assets/styles/modules/offcanvas/offcanvas.module.css';
import thisCanvasStyles from '../../assets/styles/modules/offcanvas/createinvoicecanvas.module.css';
import Button from '../button/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { toggleCanvas, onLoadCanvas } from '../../redux/offcanvas/offCanvasSlice';
import OffCanvasForm from './form/OffCanvasForm';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import localDB from '../../services/localStorage';
import { FormDataType } from '../../types';

const EditInvoiceCanvas = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<FormDataType>();
  const [editedFormData, setEditedFormData] = useState<FormDataType>();

  const updateForm = (data: FormDataType) => {
    setEditedFormData(data);
  };

  const submitData = () => {
    if (editedFormData && params.id) {
      const { id: _id, ...updates } = editedFormData as any;
      localDB.update(params.id, updates);
      navigate(0); // refresh page
    }
  };

  const handleClose = () => {
    dispatch(toggleCanvas());
    dispatch(onLoadCanvas(''));
  };

  const handleSave = () => {
    submitData();
    handleClose();
  };

  useEffect(() => {
    if (params.id) {
      const invoice = localDB.getById(params.id);
      setData(invoice as any ?? {});
    }
  }, []);

  return (
    <div className={`${styles.canvas} animate animate--very-slow animate-ease-in-out slideToRight`}>
      <OffCanvasForm
        header='Edit Form'
        close={handleClose}
        data={data}
        updateForm={updateForm}
      />
      <div className={thisCanvasStyles.buttons}>
        <Button variant='editButton' onClick={handleClose}>Cancel</Button>
        {data && data.status === 'draft' ? (
          <Button variant='saveAsDraftButton' onClick={handleSave}>Save Draft</Button>
        ) : (
          <Button onClick={handleSave}>Save Changes</Button>
        )}
        {data && data.status === 'draft' && (
          <Button onClick={handleClose}>Save and Send</Button>
        )}
      </div>
    </div>
  );
};

export default EditInvoiceCanvas;