import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

PostsActionHidePost.propTypes = {
	data: PropTypes.array,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionHidePost(props) {
	const hidePostCheck = useRef(null);
	const {data, dirtyCallback} = props;

	useEffect(() => {
		if (data !== undefined && data) {
			hidePostCheck.current.checked = true;
		}
	}, [data]);

	return (
		<label className='uk-form-label'>
			<input className='uk-checkbox' type='checkbox' id='hide-post' ref={hidePostCheck} onChange={() => dirtyCallback(true)} /> Hide this post
		</label>
	);
}
