import PropTypes from 'prop-types';
import ShortUniqueId from 'short-unique-id';
import bs from '../utils/bs';
import ComponentsSlideshowForm from './ComponentsSlideshowForm';
import ComponentsSlideshowPlaceholder from './ComponentsSlideshowPlaceholder';

ComponentsSlideshow.propTypes = {
	data: PropTypes.object,
	callback: PropTypes.func,
	dirtyCallback: PropTypes.bool,
};

export default function ComponentsSlideshow(props) {
	const {data, callback, dirtyCallback} = props;

	// Id generator
	const uid = new ShortUniqueId({length: 6});

	// Handle add slide item
	const handleAddSlide = async e => {
		const indexPosition = e.target.closest('li').classList[0].split('-')[2] - 1;
		const newSlide = uid();

		dirtyCallback(true);

		bs.socket.emit('getSlideItem', `slide-${newSlide}`);
		await new Promise(resolve => {
			bs.socket.once('slideItem', data => resolve(sessionStorage.setItem(data.blocks[0].id, JSON.stringify(data))));
		});

		const resultSlide = {
			id: newSlide,
			text: JSON.parse(sessionStorage.getItem(`slide-${newSlide}`)).blocks[0].data.text,
		};
		callback(resultSlide, indexPosition, 'add');
	};

	// Handle delete slide item
	const handleDeleteSlide = (e, data, parentData) => {
		e.preventDefault();
		dirtyCallback(true);

		const groupPosition = e.target.closest('li').classList[0].split('-')[2] - 1;
		const rawData = parentData.slides;
		const deletedSlide = rawData.filter(item => item.id !== data);
		callback(deletedSlide, groupPosition, 'delete');
		sessionStorage.removeItem(`slide-${data}`);
	};

	return (
		<li className='slideshows'>
			<h4 className='uk-heading-line'><span>Slideshow</span></h4>
			<div className='slideshows-form-wrap uk-margin-medium'>
				<ul className='uk-subnav uk-subnav-pill slide-group-nav' data-uk-switcher='animation: uk-animation-fade'>
					{data !== undefined
						&& data.map((group, index) => (
							<li key={index + 1}>
								<a href='#'>Preset {index + 1}</a>
							</li>
						))
					}
				</ul>
				<ul className='uk-switcher uk-margin slide-group-content'>
					{data !== undefined
						&& data.map((group, index) => (
							<li key={index + 1} className={`slide-group-${index + 1}`}>
								{
									group.slides.length === 0
										? <ComponentsSlideshowPlaceholder />
										: group.slides.map((each, index) => (
											<ComponentsSlideshowForm key={index + 1} data={each} parentData={group} callback={handleDeleteSlide} />
										))
								}
								<hr className='uk-margin-medium-top' />
								<div className='uk-width-1-1 uk-flex uk-flex-right uk-margin-small-bottom'>
									<button className='add-slide uk-button uk-button-secondary uk-border-rounded' onClick={e => handleAddSlide(e)}>
										<i className='ri-add-circle-fill ri-1x uk-margin-small-right'></i>Add new slide
									</button>
								</div>
							</li>
						))
					}
				</ul>
			</div>
		</li>
	);
}
