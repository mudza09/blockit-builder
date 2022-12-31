import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

PostsActionCategorySelect.propTypes = {
	data: PropTypes.object,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionCategorySelect(props) {
	const categorySelect = useRef(null);
	const {data, dirtyCallback} = props;

	// Category select
	const setCategory = current => {
		const select = categorySelect.current;
		if (current.length === 0 || current === 'Uncategorized') {
			select.value = '0';
		} else {
			select.value = current;
		}
	};

	useEffect(() => {
		if (data !== undefined) {
			setCategory(data.current);
		}
	}, [data]);

	return (
		<div className='uk-width-1-1'>
			<label className='uk-form-label' htmlFor='post-category'>Category</label>
			<select className='uk-select uk-border-rounded' id='post-category' ref={categorySelect} onChange={() => dirtyCallback(true)}>
				<option value='0'>Uncategorized</option>
				{data !== undefined
					&& data.select.map(item => <option key={item} value={item}>{item}</option>)
				}
			</select>
		</div>
	);
}
