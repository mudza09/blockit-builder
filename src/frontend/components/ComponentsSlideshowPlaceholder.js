import React from 'react'

export default function ComponentsSlideshowPlaceholder() {
    return (
        <div className="uk-text-center">
            <img className="missing-list-placeholder uk-margin-remove-bottom" src="../assets/img/blockit-missing-slide.svg" alt="icon" width="224" />
            <h5 className="uk-text-muted uk-margin-remove-top uk-margin-large-bottom">oops!, there is no slide here<br />click "add new slide" to create.</h5>
        </div>
    )
}