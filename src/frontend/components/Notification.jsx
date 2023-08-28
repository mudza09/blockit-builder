import {useRef} from 'react';
import PropTypes from 'prop-types';

Notification.propTypes = {
	callback: PropTypes.func,
	message: PropTypes.string,
	status: PropTypes.object,
};

export default function Notification(props) {
	const {callback, message, status} = props;
	const notifWrap = useRef(null);

	if (status.status) {
		setTimeout(() => {
			notifWrap.current.classList.remove('uk-animation-slide-top-small');
			notifWrap.current.classList.add('uk-animation-slide-bottom-small', 'uk-animation-reverse');
		}, 3000);

		setTimeout(() => callback(false), 3300);

		return (
			<div className='uk-alert-primary uk-animation-slide-top-small' ref={notifWrap} data-uk-alert>
				<i className='ri-information-fill ri-1x'></i> &#34;{status.filename}&#34; {message}
			</div>
		);
	}

	return null;
}
