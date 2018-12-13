import React from 'react';
import ContentContainer from 'components/common/ContentContainer';
import './Home.scss';

// import princessLayer from 'images/princessLayer.png';
// import cluckbacka from 'images/cluckbacka.png';

export default class Home extends React.Component<{}, {}> {
    render(): JSX.Element {
        return (
            <div className="home-container">
                <div className="top-image-container">
                    <div className="img-container">
                        <img src="../images/SleepingFowl.png" className="cover-photo"/>
                    </div>
                </div>
                <div className="main-content-container">
                    <div className="header-text">
                        <h2>Learn how to take care of your back yard chickens like a pro!</h2>
                        <p>Ever wondered what your back yard ladies are thinking? Did you know you can tell</p>
                        <p> what they're thinking by their call? Need help with a broody hen? Then keep reading!</p>
                    </div>
                    <div className="star-wars-chickens-container">
                        <div className="container">
                            <img src="../images/KyloHen.png" className="kylo-hen-cover"/>
                        </div>
                        <div className="princess-layer-container">
                            <img src="../images/PrincessLayer.png" className="princess-layer-cover"/>
                        </div>
                    </div>
                    <div className="header-text">
                       <h4>Yes, chickens love pasta!</h4>
                    </div>
                    <div className="img-container">
                        <img src="../images/chickenSpaghetti.jpg" className="cover-photo"/>
                    </div>
                </div>
            </div>
        );
    }
}