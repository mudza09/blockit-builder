import {useRef} from 'react';
import PropTypes from 'prop-types';

ComponentsContactMap.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function ComponentsContactMap(props) {
	const contactForm = useRef(null);
	const {data, dirtyCallback} = props;

	// Handle contact form
	const handleContactForm = () => {
		const form = contactForm.current;
		const mapPath = document.createElement('div');
		mapPath.innerHTML = form.querySelector('.contact-map-iframe').value;

		data.email = form.querySelector('.contact-email-address').value;
		data.mapIframe = form.querySelector('.contact-map-iframe').value;
		data.mapSrc = mapPath.children[0].getAttribute('src');
	};

	return (
		<li className='contact'>
			<h4 className='uk-heading-line'><span>Contact &amp; Map</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleContactForm} ref={contactForm}>
				<div className='uk-margin'>
					<label className='uk-form-label'htmlFor='contact-email'>Email <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Used on the contact form; pos: right'></i></label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded contact-email-address' type='text' defaultValue={data === undefined ? '' : data.email} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='contact-map'>Map Location <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Use share iframe from google map; pos: right'></i></label>
					<div className='uk-form-controls'>
						<textarea className='uk-textarea uk-border-rounded contact-map-iframe' id='contact-map-form' rows='6' defaultValue={data === undefined ? '' : data.mapIframe} onChange={() => dirtyCallback(true)}></textarea>
					</div>
				</div>
			</form>
		</li>
	);
}
