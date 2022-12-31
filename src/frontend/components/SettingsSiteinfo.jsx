import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import uploadImage from '../utils/uploadImage';
import removeParam from '../utils/removeParam';

SettingsSiteinfo.propTypes = {
	authorsSelect: PropTypes.array,
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function SettingsSiteinfo(props) {
	const siteInfoForm = useRef(null);
	const {authorsSelect, data, dirtyCallback} = props;

	// Favicon and touch icon
	const [faviconLoading, setFaviconLoading] = useState(false);
	const [touchIconLoading, setTouchIconLoading] = useState(false);
	const [imageFavicon, setImageFavicon] = useState('http://localhost:3000/img/in-lazy.gif');
	const [imageTouchIcon, setImageTouchIcon] = useState('http://localhost:3000/img/in-lazy.gif');

	// Coloris button color for meta theme color
	const buttonMetaThemeColor = () => {
		const form = siteInfoForm.current;

		window.coloris({
			el: '#setting-meta-themecolor',
			theme: 'polaroid',
			alpha: false,
		});

		form.querySelector('#setting-meta-themecolor').addEventListener('change', e => {
			dirtyCallback(true);
			data.metaThemeColor = e.target.value;
		});
	};

	// Handle site info form
	const handleSiteInfoForm = () => {
		const form = siteInfoForm.current;
		const favicon = form.querySelector('img[alt="setting-favicon"]').getAttribute('src').replace('http://localhost:3000/', '');
		const touchIcon = form.querySelector('img[alt="setting-touch-icon"]').getAttribute('src').replace('http://localhost:3000/', '');

		data.pageTitle = form.querySelector('#setting-page-title').value;
		data.metaDescription = form.querySelector('#setting-meta-description').value;
		data.metaKeywords = form.querySelector('#setting-meta-keywords').value.replace(/\s/g, '').split(',');
		data.metaAuthor = form.querySelector('#setting-meta-author').value;
		data.favicon = removeParam('browsersync', favicon);
		data.touchIcon = removeParam('browsersync', touchIcon);
	};

	// Handle upload favicon
	const handleUploadFavicon = e => {
		uploadImage({
			favicon: true,
			inputEvent: e.target,
			selector: 'setting-favicon',
			fileName: 'favicon',
			useButton: true,
			loading: setFaviconLoading,
			path: setImageFavicon,
		});
		dirtyCallback(true);
		setTimeout(() => {
			handleSiteInfoForm();
		}, 500);
	};

	// Handle upload touch icon
	const handleUploadTouchIcon = e => {
		uploadImage({
			touchIcon: true,
			inputEvent: e.target,
			selector: 'setting-touch-icon',
			fileName: 'touch-icon',
			useButton: true,
			loading: setTouchIconLoading,
			path: setImageTouchIcon,
		});
		dirtyCallback(true);
		setTimeout(() => {
			handleSiteInfoForm();
		}, 500);
	};

	useEffect(() => {
		if (data !== undefined) {
			buttonMetaThemeColor();
			setImageFavicon(`http://localhost:3000/${data.favicon}`);
			setImageTouchIcon(`http://localhost:3000/${data.touchIcon}`);
		}
	}, [data]);

	return (
		<li className='site-info'>
			<h4 className='uk-heading-line'><span>Site info</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleSiteInfoForm} ref={siteInfoForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-page-title'>Page Title</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-page-title' type='text' defaultValue={data === undefined ? '' : data.pageTitle} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-meta-description'>Meta description</label>
					<div className='uk-form-controls'>
						<textarea className='uk-textarea uk-border-rounded' id='setting-meta-description' rows='4' defaultValue={data === undefined ? '' : data.metaDescription} onChange={() => dirtyCallback(true)}></textarea>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-meta-keywords'>Meta keywords <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Separate tags with commas; pos: right'></i></label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-meta-keywords' type='text' defaultValue={data === undefined ? '' : data.metaKeywords.join(', ')} onChange={() => dirtyCallback(true)} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-meta-author'>Meta author</label>
					<div className='uk-form-controls'>
						<select className='uk-select uk-border-rounded' id='setting-meta-author' defaultValue={data === undefined ? '' : data.metaAuthor} onChange={() => dirtyCallback(true)}>
							{authorsSelect !== undefined
								&& authorsSelect.map(item => <option key={item.id} data-id={item.id} value={item.name}>{item.name}</option>)
							}
						</select>
					</div>
				</div>
				<div className='uk-margin setting-colors'>
					<label className='uk-form-label' htmlFor='setting-meta-themecolor'>Meta theme color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-meta-themecolor' type='text' defaultValue={data === undefined ? '' : data.metaThemeColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-favicon'>Favicon</label>
					<div className='uk-grid-small uk-flex uk-flex-middle setting-favicon' data-uk-grid>
						<div className='uk-width-auto uk-flex uk-flex-center uk-flex-middle'>
							<img src={imageFavicon} alt='setting-favicon' />
						</div>
						<div className='uk-width-expand'>
							<div data-uk-form-custom>
								<input className='favicon-upload' type='file' onChange={handleUploadFavicon} />
								<button className='uk-button uk-button-secondary uk-border-rounded upload-favicon-btn' type='button'>
									{faviconLoading
										? <><i className='ri-loader-2-fill ri-1x ri-spin uk-margin-small-right'></i>Loading...</>
										: <><i className='ri-upload-2-line ri-1x uk-margin-small-right'></i>Change favicon</>
									}
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-touch-icon'>Touch icon</label>
					<div className='uk-grid-small uk-flex uk-flex-middle setting-touch-icon' data-uk-grid>
						<div className='uk-width-auto uk-flex uk-flex-center uk-flex-middle'>
							<img src={imageTouchIcon} alt='setting-touch-icon' />
						</div>
						<div className='uk-width-expand'>
							<div data-uk-form-custom>
								<input className='touch-icon-upload' type='file' onChange={handleUploadTouchIcon} />
								<button className='uk-button uk-button-secondary uk-border-rounded upload-touch-icon-btn' type='button'>
									{touchIconLoading
										? <><i className='ri-loader-2-fill ri-1x ri-spin uk-margin-small-right'></i>Loading...</>
										: <><i className='ri-upload-2-line ri-1x uk-margin-small-right'></i>Change icon</>
									}
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</li>
	);
}
