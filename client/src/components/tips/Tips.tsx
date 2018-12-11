import React from 'react';
import './Tips.scss';

// import princessLayer from 'images/princessLayer.png';
// import cluckbacka from 'images/cluckbacka.png';

export default class Tips extends React.Component<{}, {}> {
    render(): JSX.Element {
        return (
            <div className="under-construction">
                <div className="container">
                    <img src="../images/cluckbacka.png" className="cover-photo"/>
                </div>
                <div className="under-construction">
                    <h4>
                        Why are you looking here? This place is under construction!
                    </h4>
                </div>
            </div>
        );
    }

}