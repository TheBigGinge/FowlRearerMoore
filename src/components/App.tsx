import React from 'react';
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router-dom';
import Home from './home/Home';
import Header from 'components/header/Header';
import FeaturedPics from 'components/featuredPics/FeaturedPics';
import Tips from 'components/tips/Tips';
import { connect } from 'react-redux';

// styles
import './App.scss';

export interface AppProps {
    dispatch?: Function;
}

export default class App extends React.Component<AppProps, {}> {

    constructor(props: AppProps) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <div key="app" className="app">
                <div className="page-container" >
                    <div className="page">
                    <Header />
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route path="/Picks" component={FeaturedPics} />
                        <Route path="/Tips" component={Tips} />
                    </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

// @ts-ignore
// const app = connect(mapStateToProps)(App);
