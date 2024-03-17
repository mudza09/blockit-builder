import {useState, useEffect} from 'react';
import {useNavigatingAway} from '../hooks/useNavigatingAway';
import bs from '../utils/bs';
import UIkit from 'uikit';
import ComponentsSlideshow from '../components/ComponentsSlideshow';
import ComponentsHeader from '../components/ComponentsHeader';
import ComponentsFooter from '../components/ComponentsFooter';
import ComponentsContactMap from '../components/ComponentsContactMap';
import ComponentsSocialMedia from '../components/ComponentsSocialMedia';
import ButtonLoader from '../components/ButtonLoader';

export default function Components() {
	const [data, setData] = useState({});

	// Leave page prompt
	const [isDirty, setIsDirty] = useState(false);
	const [showPrompt, confirmleave, cancelLeave] = useNavigatingAway(isDirty);

	// Get data from socket
	const socketComponents = () => {
		bs.socket.emit('getComponentsData', 'empty');
		bs.socket.once('componentsData', data => setData(data));
	};

	// Handle save components button
	const handleSaveComponents = () => {
		sessionStorage.clear();
		setIsDirty(false);

		delete data.footer.useLogo; // Clean unused footer hooks parameter
		bs.socket.emit('saveComponents', data);
	};

	// Components slideshow callback
	const componentsSlideshowCallback = (resultData, indexPosition, mode) => {
		if (mode === 'delete') {
			const filteredSlide = data.slideshow;
			filteredSlide[indexPosition].slides = resultData;

			setData({...data, slideshow: filteredSlide});
		}

		if (mode === 'add') {
			const filteredSlide = data.slideshow;
			filteredSlide[indexPosition].slides.push(resultData);

			setData({...data, slideshow: filteredSlide});
		}
	};

	useEffect(() => socketComponents(), []);
	useEffect(() => {
		if (showPrompt) {
			UIkit.modal.confirm('All changes will be lost. Do you really want to leave without saving?').then(() => {
				setIsDirty(false);
				confirmleave();
			}, () => cancelLeave());
		}
	}, [showPrompt]);

	return (
		<div className='tm-main uk-section blockit-components'>
			<div className='uk-container'>
				<div className='uk-grid'>
					<div className='uk-width-1-4'>
						<h3 className='head-title'>Components</h3>
					</div>
					<div className='uk-width-3-4 uk-flex uk-flex-right blockit-notif'>
						<ButtonLoader
							idName='save-components'
							cssClass='uk-button uk-button-primary uk-border-rounded'
							defaultMessage='Save components'
							successMessage='Saved successfully'
							callbackAction={handleSaveComponents}
						/>
					</div>
				</div>

				<div className='uk-grid'>
					<div className='uk-width-1-5'>
						<ul className='uk-tab-left' data-uk-tab='connect: #component-tab-left; animation: uk-animation-fade'>
							<li><a href='#slideshow'>Slideshow</a></li>
							<li><a href='#header'>Header</a></li>
							<li><a href='#footer'>Footer</a></li>
							<li><a href='#contact'>Contact &amp; Map</a></li>
							<li><a href='#social-media'>Social media</a></li>
						</ul>
					</div>
					<div className='uk-width-expand'>
						<div className='uk-card uk-card-default uk-card-body uk-border-rounded'>
							<ul id='component-tab-left' className='uk-switcher'>
								<ComponentsSlideshow data={data.slideshow} callback={componentsSlideshowCallback} dirtyCallback={setIsDirty} />
								<ComponentsHeader data={data.header} port={data.port} dirtyCallback={setIsDirty} />
								<ComponentsFooter data={data.footer} port={data.port} dirtyCallback={setIsDirty} />
								<ComponentsContactMap data={data.contactMap} dirtyCallback={setIsDirty} />
								<ComponentsSocialMedia data={data.socialMedia} dirtyCallback={setIsDirty} />
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
