import {useRef} from 'react';
import PropTypes from 'prop-types';

ComponentsSocialMedia.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function ComponentsSocialMedia(props) {
	const socialMediaForm = useRef(null);
	const {data, dirtyCallback} = props;

	// Handle social media form
	const handleSocialMediaForm = () => {
		const form = socialMediaForm.current;

		data[0].facebook = form.querySelector('#setting-social-facebook').value;
		data[1].twitter = form.querySelector('#setting-social-twitter').value;
		data[2].instagram = form.querySelector('#setting-social-instagram').value;
		data[3].linkedin = form.querySelector('#setting-social-linkedin').value;
		data[4].behance = form.querySelector('#setting-social-behance').value;
		data[5].whatsapp = form.querySelector('#setting-social-whatsapp').value;
		data[6].telegram = form.querySelector('#setting-social-telegram').value;
		data[7].youtube = form.querySelector('#setting-social-youtube').value;
	};

	return (
		<li className='social-media'>
			<h4 className='uk-heading-line'><span>Social media</span></h4>
			<span className='uk-text-small uk-text-muted setting-info'><i className='ri-information-fill ri-sm uk-margin-small-right'></i>Leave blank if you don&apos;t want use</span>
			<form className='uk-form-horizontal uk-margin-medium' onKeyUp={handleSocialMediaForm} ref={socialMediaForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-facebook'><i className='ri-facebook-circle-line ri-lg uk-margin-small-right'></i>Facebook</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-facebook' type='text' defaultValue={data === undefined ? '' : data[0].facebook} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-twitter'><i className='ri-twitter-line ri-lg uk-margin-small-right'></i>Twitter</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-twitter' type='text' defaultValue={data === undefined ? '' : data[1].twitter} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-instagram'><i className='ri-instagram-line ri-lg uk-margin-small-right'></i>Instagram</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-instagram' type='text' defaultValue={data === undefined ? '' : data[2].instagram} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-linkedin'><i className='ri-linkedin-box-line ri-lg uk-margin-small-right'></i>Linkedin</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-linkedin' type='text' defaultValue={data === undefined ? '' : data[3].linkedin} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-behance'><i className='ri-behance-line ri-lg uk-margin-small-right'></i>Behance</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-behance' type='text' defaultValue={data === undefined ? '' : data[4].behance} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-whatsapp'><i className='ri-whatsapp-line ri-lg uk-margin-small-right'></i>Whatsapp</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-whatsapp' type='text' defaultValue={data === undefined ? '' : data[5].whatsapp} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-telegram'><i className='ri-telegram-line ri-lg uk-margin-small-right'></i>Telegram</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-telegram' type='text' defaultValue={data === undefined ? '' : data[6].telegram} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-social-youtube'><i className='ri-youtube-line ri-lg uk-margin-small-right'></i>Youtube</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-social-youtube' type='text' defaultValue={data === undefined ? '' : data[7].youtube} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
			</form>
		</li>
	);
}
