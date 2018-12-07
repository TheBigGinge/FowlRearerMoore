import React from 'react';
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
                        { this._renderPage() }
                    </div>
                </div>
            </div>
        );
    }

    private _renderPage(): JSX.Element {
        return <div>
            HELLO MOFO!
        </div>;
    }
}

// @ts-ignore
// const app = connect(mapStateToProps)(App);
