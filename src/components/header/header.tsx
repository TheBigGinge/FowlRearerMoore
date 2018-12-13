import React from 'react';
import { Link } from 'react-router-dom';
import './header.scss';
import { connect } from 'react-redux';

class Header extends React.Component<{}, {}>  {

    render(): JSX.Element {
        return (
            <div>
                {this.renderAltHeader()}
            </div>
        );
    }

    renderJimHeader(): JSX.Element {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button
                            type="button"
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1"
                            aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    <Link className="navbar-brand" to="/">Fowl Fanciness</Link>
                </div>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="nav navbar-nav">
                        <li><Link to="/Blogs" className="button-text">Blogs
                            <span className="sr-only"></span></Link></li>
                        <li><Link to="/Tips" className="button-text">Chicken Tips</Link></li>
                        <li><Link to="/Picks" className="button-text">Chick Picks</Link></li>
                    </ul>
                </div>
            </div>
        </nav>);
    }

    renderAltHeader(): JSX.Element {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark">
                <Link className="navbar-brand" to="/">Fowl Fanciness</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link to="/Blogs" className="button-text">Blogs</Link>
                        <Link to="/Tips" className="button-text">Chicken Tips</Link>
                        <Link to="/Picks" className="button-text">Chick Picks</Link>
                    </div>
                </div>
            </nav>
        );
    }
 }

export default Header;