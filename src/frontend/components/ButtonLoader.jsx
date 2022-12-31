import {useState} from 'react';
import PropTypes from 'prop-types';

ButtonLoader.propTypes = {
	callbackAction: PropTypes.func,
	cssClass: PropTypes.string,
	defaultMessage: PropTypes.string,
	idName: PropTypes.string,
	successMessage: PropTypes.string,
	loadingStatus: PropTypes.bool,
	refElement: PropTypes.object,
};

export default function ButtonLoader(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [btnSuccess, setBtnSuccess] = useState(false);
	const {callbackAction, cssClass, defaultMessage, idName, successMessage, loadingStatus, refElement} = props;

	const handleButton = () => {
		if (callbackAction !== undefined) {
			callbackAction();

			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
				setBtnSuccess(true);
			}, 1500);
			setTimeout(() => {
				setBtnSuccess(false);
			}, 3000);
		} else if (loadingStatus === true && refElement !== undefined) {
			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
				setBtnSuccess(true);
			}, 1500);
			setTimeout(() => {
				setBtnSuccess(false);
			}, 3000);
		}
	};

	return (
		<button id={idName} className={cssClass} onClick={handleButton} ref={refElement}>
			{isLoading
				? <><i className='ri-loader-2-fill ri-1x ri-spin fa-sm uk-margin-small-right'></i>Loading...</>
				: btnSuccess
					? <><i className='ri-checkbox-circle-fill ri-1x uk-margin-small-right'></i>{successMessage}</>
					: <><i className='ri-save-2-fill ri-1x uk-margin-small-right'></i>{defaultMessage}</>
			}
		</button>
	);
}
