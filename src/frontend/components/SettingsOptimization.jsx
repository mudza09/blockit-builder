import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

SettingsBlog.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function SettingsBlog(props) {
	const optimizationForm = useRef(null);
	const preloadRadio = useRef(null);
	const htmlCheck = useRef(null);
	const cssCheck = useRef(null);
	const jsCheck = useRef(null);
	const {data, dirtyCallback} = props;

	// Show minify check
	const minifyAssetsCheck = condition => {
		const form = optimizationForm.current;
		if (condition.html) {
			form.querySelector('#setting-minifying-html').checked = true;
		}

		if (condition.css) {
			form.querySelector('#setting-minifying-css').checked = true;
		}

		if (condition.js) {
			form.querySelector('#setting-minifying-js').checked = true;
		}
	};

	// Preload critical radio
	const preloadCriticalRadio = condition => {
		const form = optimizationForm.current;
		if (condition) {
			form.querySelector('#preload-critical-enable').checked = true;
		} else {
			form.querySelector('#preload-critical-disable').checked = true;
		}
	};

	// Handle optimization form
	const handleOptimizationForm = () => {
		const htmlCheckEnable = htmlCheck.current.checked;
		const cssCheckEnable = cssCheck.current.checked;
		const jsCheckEnable = jsCheck.current.checked;
		const preloadRadioEnable = preloadRadio.current.checked;

		data.minifyAssets.html = Boolean(htmlCheckEnable);
		data.minifyAssets.css = Boolean(cssCheckEnable);
		data.minifyAssets.js = Boolean(jsCheckEnable);
		data.preloadCritical = Boolean(preloadRadioEnable);
	};

	useEffect(() => {
		if (data !== undefined) {
			minifyAssetsCheck(data.minifyAssets);
			preloadCriticalRadio(data.preloadCritical);
		}
	}, [data]);

	return (
		<li className='blog'>
			<h4 className='uk-heading-line'><span>Optimization</span></h4>
			<form className='uk-form-horizontal uk-margin-medium' onChange={handleOptimizationForm} ref={optimizationForm}>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-show-widgets'>Minify assets</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-medium-right'><input className='uk-checkbox' type='checkbox' id='setting-minifying-html' ref={htmlCheck} onChange={() => dirtyCallback(true)} /> HTML files</label>
						<label className='small-label uk-margin-medium-right'><input className='uk-checkbox' type='checkbox' id='setting-minifying-css' ref={cssCheck} onChange={() => dirtyCallback(true)} /> CSS files</label>
						<label className='small-label'><input className='uk-checkbox' type='checkbox' id='setting-minifying-js' ref={jsCheck} onChange={() => dirtyCallback(true)} /> JS files</label>
					</div>
				</div>
				<div className='uk-margin'>
					<label className='uk-form-label' htmlFor='setting-display-preload'>Preload critical assets</label>
					<div className='uk-form-controls uk-form-controls-text'>
						<label className='small-label uk-margin-right'>
							<input
								id='preload-critical-enable'
								className='uk-radio'
								type='radio'
								value='enable'
								name='setting-preload-critical'
								ref={preloadRadio}
								onChange={() => dirtyCallback(true)}
							/> Enable
						</label>
						<label className='small-label'>
							<input
								id='preload-critical-disable'
								className='uk-radio'
								type='radio'
								value='disable'
								name='setting-preload-critical'
								onChange={() => dirtyCallback(true)}
							/> Disable
						</label>
					</div>
				</div>
			</form>
		</li>
	);
}
