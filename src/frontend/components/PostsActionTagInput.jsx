import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

PostsActionTagInput.propTypes = {
	data: PropTypes.array,
	mode: PropTypes.string,
	dirtyCallback: PropTypes.bool,
};

export default function PostsActionTagInput(props) {
	const [tagPost, setTagPost] = useState([]);
	const {data, mode, dirtyCallback} = props;

	useEffect(() => {
		if (mode === 'edit' && data !== undefined) {
			setTagPost(data === 'untagged' ? null : data.join(', '));
		}
	}, [data]);

	return (
		<div className='uk-width-1-1'>
			<label className='uk-form-label' htmlFor='post-tags'>Tags <i className='ri-information-fill ri-xs' data-uk-tooltip='title: Separate tags with commas; pos: right'></i></label>
			<input className='uk-input uk-border-rounded' id='post-tags' type='text' defaultValue={tagPost} onChange={() => dirtyCallback(true)} />
		</div>
	);
}
