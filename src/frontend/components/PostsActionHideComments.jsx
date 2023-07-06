import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

PostsActionHideComments.propTypes = {
	data: PropTypes.array,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionHideComments(props) {
	const hideCommentCheck = useRef(null);
	const {data, dirtyCallback} = props;

	useEffect(() => {
		if (data !== undefined && !data) {
			hideCommentCheck.current.checked = true;
		}
	}, [data]);

	return (
		<label className='uk-form-label uk-margin-left'>
			<input className='uk-checkbox' type='checkbox' id='hide-comment' ref={hideCommentCheck} onChange={() => dirtyCallback(true)} /> Hide comments
		</label>
	);
}
