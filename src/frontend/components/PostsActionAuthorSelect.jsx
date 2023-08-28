import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

PostsActionAuthorSelect.propTypes = {
	callback: PropTypes.func,
	data: PropTypes.object,
	status: PropTypes.bool,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionAuthorSelect(props) {
	const authorSelect = useRef(null);
	const {callback, data, status, dirtyCallback} = props;

	// Author select
	const setAuthor = current => {
		const select = authorSelect.current;
		if (current.length === 0) {
			select.value = '0';
		} else {
			select.value = current;
		}
	};

	useEffect(() => {
		if (data !== undefined) {
			setAuthor(data.current);
		}
	}, [data]);

	return (
		<div className='uk-width-1-1'>
			<label className='uk-form-label' htmlFor='post-author'>Author name</label>
			<select className={status ? 'uk-select uk-border-rounded uk-form-danger' : 'uk-select uk-border-rounded'} id='post-author' onFocus={() => callback(false)} onChange={() => dirtyCallback(true)} ref={authorSelect}>
				<option value='0'>Please select...</option>
				{data === undefined
					? null
					: data.select.map(item => <option key={item.id} data-id={item.id} value={item.name}>{item.name}</option>)
				}
			</select>
		</div>
	);
}
