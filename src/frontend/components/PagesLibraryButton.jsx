import PropTypes from 'prop-types';
import UIkit from 'uikit';

PagesLibraryButton.propTypes = {
	data: PropTypes.array,
};

export default function PagesLibraryButton(props) {
	const {data} = props;

	return (
		<div className='button-library-wrap'>
			<button className='uk-button uk-button-default uk-border-rounded btn-library-filter' type='button'>Filter categories<i className='ri-arrow-down-s-fill ri-1x uk-margin-small-left'></i></button>
			<div className='dropdown-library' data-uk-dropdown='offset: -6; mode: click; pos: bottom-justify; delay-hide: 80'>
				<hr className='uk-margin-small-bottom'/>
				<ul className='uk-nav uk-dropdown-nav'>
					<li data-uk-filter-control=''><a onClick={() => UIkit.dropdown('.dropdown-library').hide()}><i className='ri-folder-5-line ri-1x uk-margin-small-right'></i>All sections</a></li>
					{data.map(library => (
						<li key={library.name} data-uk-filter-control={'#wrap-' + library.name.toLowerCase().split(' ').join('-')}><a onClick={() => UIkit.dropdown('.dropdown-library').hide()}><i className={library.icon + ' ri-1x uk-margin-small-right'}></i>{library.name}</a></li>
					))}
				</ul>
			</div>
		</div>
	);
}
