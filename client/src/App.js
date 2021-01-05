import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Score from './components/Score';

function App() {
    return (
        <Router>
            <Route exact path="/" component={Landing} />
            <Switch>
                <Route exact path="/game/:id" component={Score} />
            </Switch>
        </Router>
    );
}

export default App;
