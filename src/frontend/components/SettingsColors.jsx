import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

SettingsColors.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function SettingsColors(props) {
	const colorsForm = useRef(null);
	const {data, dirtyCallback} = props;

	// Coloris button color for meta theme color
	const buttonSettingsColor = () => {
		const form = colorsForm.current;

		form.querySelectorAll('.uk-input').forEach(each => {
			const colorName = each.getAttribute('id').split('-').splice(1).join('-').replace(/-([a-z-0-9])/g, w => w[1].toUpperCase());

			window.coloris({
				el: `#${each.getAttribute('id')}`,
				theme: 'polaroid',
				alpha: false,
			});

			each.addEventListener('change', e => {
				dirtyCallback(true);
				data[colorName] = e.target.value;
			});
		});
	};

	useEffect(() => {
		if (data !== undefined) {
			buttonSettingsColor();
		}
	}, [data]);

	return (
		<li className='colors'>
			<h4 className='uk-heading-line'><span>Colors</span></h4>
			<form className='uk-form-horizontal uk-margin-medium setting-colors' ref={colorsForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-primary-color'>Primary color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-primary-color' type='text' defaultValue={data === undefined ? '' : data.primaryColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-secondary-color'>Secondary color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-secondary-color' type='text' defaultValue={data === undefined ? '' : data.secondaryColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-success-color'>Success color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-success-color' type='text' defaultValue={data === undefined ? '' : data.successColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-info-color'>Info color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-info-color' type='text' defaultValue={data === undefined ? '' : data.infoColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-warning-color'>Warning color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-warning-color' type='text' defaultValue={data === undefined ? '' : data.warningColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-danger-color'>Danger color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-danger-color' type='text' defaultValue={data === undefined ? '' : data.dangerColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-light-color'>Light color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-light-color' type='text' defaultValue={data === undefined ? '' : data.lightColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-dark-color'>Dark color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-dark-color' type='text' defaultValue={data === undefined ? '' : data.darkColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-background-color'>Background color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-background-color' type='text' defaultValue={data === undefined ? '' : data.backgroundColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-text-color'>Text color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-text-color' type='text' defaultValue={data === undefined ? '' : data.textColor} />
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-link-color'>Link color</label>
					<div className='uk-form-controls'>
						<input className='uk-input uk-border-rounded' id='setting-link-color' type='text' defaultValue={data === undefined ? '' : data.linkColor} />
					</div>
				</div>
			</form>
		</li>
	);
}
