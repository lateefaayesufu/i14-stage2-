import styles from '../../assets/styles/modules/buttons.module.css';
import { useNavigate } from 'react-router-dom';

// images
import arrowLeft from '../../assets/svg/icon-arrow-left.svg';

const GoBack = () => {
	const navigate = useNavigate();

	return (
		<div className={styles.goBack} onClick={() => navigate(-1)} style={{cursor:"pointer"}}>
			<img
				src={arrowLeft}
				alt='arrow left'
			/>
			<p>Go back</p>
		</div>
	);
};

export default GoBack;
