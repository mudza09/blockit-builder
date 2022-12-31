/* eslint-disable camelcase */
import {useEffect, useContext} from 'react';
import {UNSAFE_NavigationContext} from 'react-router-dom';

export function navigationBlocker(navigationBlockerHandler,	canShowDialogPrompt) {
	const {navigator} = useContext(UNSAFE_NavigationContext);

	useEffect(() => {
		if (!canShowDialogPrompt) {
			return;
		}

		// For me, this is the dark part of the code
		// maybe because I didn't work with React Router 5,
		// and it emulates that
		const unblock = navigator.block(tx => {
			const autoUnblockingTx = {
				...tx,
				retry() {
					unblock();
					tx.retry();
				},
			};

			navigationBlockerHandler(autoUnblockingTx);
		});

		return unblock;
	});
}
