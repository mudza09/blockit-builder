import PropTypes from 'prop-types';

PagesLibraryButton.propTypes = {
	data: PropTypes.array,
};

export default function PagesLibraryButton(props) {
	const {data} = props;

	return (
		<div className='button-library-wrap'>
			<button className='uk-button uk-button-default uk-border-rounded btn-library-filter'>Show categories<i className='ri-arrow-down-s-fill ri-1x uk-margin-small-left'></i></button>
			<div data-uk-dropdown='offset: -6; mode: click; pos: bottom-justify;'>
				<hr className='uk-margin-small-bottom'/>
				<ul className='uk-nav uk-dropdown-nav'>
					{data.map(library => (
						<li key={library.name}><a href={'#wrap-' + library.name.toLowerCase()} data-uk-scroll><i className={library.icon + ' ri-1x uk-margin-small-right'}></i>{library.name}</a></li>
					))}
				</ul>
			</div>
		</div>
	);
}
