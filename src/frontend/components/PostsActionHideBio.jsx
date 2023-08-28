import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

PostsActionHideBio.propTypes = {
	data: PropTypes.array,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionHideBio(props) {
	const hideBioCheck = useRef(null);
	const {data, dirtyCallback} = props;

	useEffect(() => {
		if (data !== undefined && !data) {
			hideBioCheck.current.checked = true;
		}
	}, [data]);

	return (
		<label className='uk-form-label'>
			<input className='uk-checkbox' type='checkbox' id='hide-bio' ref={hideBioCheck} onChange={() => dirtyCallback(true)} /> Hide biography
		</label>
	);
}
