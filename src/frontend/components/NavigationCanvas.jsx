import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import UIkit from 'uikit';

NavigationCanvas.propTypes = {
	addChildNav: PropTypes.func,
	data: PropTypes.array,
	deleteNav: PropTypes.func,
	editNav: PropTypes.func,
	internalData: PropTypes.array,
	placeholderStatus: PropTypes.bool,
};

export default function NavigationCanvas(props) {
	const navWrap = useRef(null);
	const {addChildNav, data, deleteNav, editNav, internalData, placeholderStatus} = props;

	// Handle drag and drop event
	const handleDragDrop = () => {
		UIkit.util.on(navWrap.current, 'moved', item => {
			const navName = item.detail[1].querySelector('.label-name').textContent;
			const prevIndex = item.detail[0].origin.index;
			const newIndex = item.detail[0].items.map(el => el.querySelector('.label-name').textContent).indexOf(navName);

			// Parent condition
			if (data[0] !== undefined && item.detail[1].children[0].classList.contains('parent-nav')) {
				handleArrayMenu(data, prevIndex, newIndex);
			}

			// Child condition
			if (data[0] !== undefined && item.detail[1].children[0].classList.contains('child-nav')) {
				const parentName = item.detail[1].parentElement.previousElementSibling.querySelector('.label-name').textContent;
				const parentActive = data.find(item => item.title === parentName);
				handleArrayMenu(parentActive.dropdown.child, prevIndex, newIndex);
			}
		});
	};

	// Handle array index position of menu
	const handleArrayMenu = (arr, fromIndex, toIndex) => {
		const element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
	};

	// Handle navigation child
	const handleNavigationChild = nav => {
		if (nav.dropdown !== undefined && nav.dropdown.child !== undefined) {
			return (
				<ul className='as-child uk-list uk-margin-medium-left' data-uk-sortable='handle: .child-nav; cls-custom: drag-nav' hidden={nav.dropdown.child.length === 0}>
					{nav.dropdown.child.map((item, index) => (
						<li key={index}>
							<div className='wrap-nav child-nav'>
								{item.icon === undefined
									? <span className='label-name' data-label-link={item.link}><i className='ri-arrow-right-down-line ri-1x uk-margin-small-right'></i>{item.title}</span>
									: <span className='label-name' data-label-link={item.link} data-label-icon={item.icon.name}><i className='ri-arrow-right-down-line ri-1x uk-margin-small-right'></i>{item.title}</span>
								}
								<button className='btn-edit uk-button uk-button-text uk-button-small uk-margin-left' onClick={e => editNav(e, item, internalData)}>Edit</button>
								<div className='uk-position-top-right'>
									<a className='btn-delete ri-delete-bin-line ri-1x' onClick={e => deleteNav(e, item, data)}></a>
								</div>
							</div>
						</li>
					))}
				</ul>
			);
		}
	};

	// Handle navigation child text
	const handleNavigationChildText = nav => {
		if (nav.dropdown !== undefined && nav.dropdown.childText !== undefined) {
			return (
				<div className='wrap-nav text-nav uk-margin-medium-left uk-transition-toggle'>
					{nav.dropdown.childText}
				</div>
			);
		}
	};

	useEffect(() => handleDragDrop(), [data]);

	return (
		<div className='nav-arrange'>
			{placeholderStatus
			&& <>
				<div className='nav-placeholder'>
					<img src='../assets/img/blockit-missing-navigation.svg' alt='navigation-placeholder' width='224' />
					<h5 className='uk-text-muted uk-margin-remove-top'>oops!, there is no menu item here.</h5>
				</div>
			</>
			}

			<ul className='as-parent uk-list' data-uk-sortable='handle: .parent-nav; cls-custom: drag-nav' ref={navWrap}>
				{data.map((item, index) => (
					<li key={index}>
						<div className='wrap-nav parent-nav'>
							<span className='label-name' data-label-link={item.link}><i className='ri-menu-line uk-margin-small-right'></i>{item.title}</span>
							<button className='btn-edit uk-button uk-button-text uk-button-small uk-margin-left' onClick={e => editNav(e, item, internalData)}>Edit</button>
							<button className='btn-child uk-button uk-button-text uk-button-small' onClick={() => addChildNav(item)}>Add child</button>
							<div className='uk-position-top-right'>
								<a className='btn-delete ri-delete-bin-line ri-1x' onClick={e => deleteNav(e, item, data)}></a>
							</div>
						</div>
						{handleNavigationChildText(item)}
						{handleNavigationChild(item)}
					</li>
				))}
			</ul>
		</div>
	);
}
