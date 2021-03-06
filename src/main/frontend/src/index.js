import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/store';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {LoginPage} from "./pages/loginpage/LoginPage";
import {Dashboard} from "./pages/dashboard/Dashboard";
import {ProfileHome} from "./pages/profile/ProfileHome";
import {MoviePage} from "./pages/movie/MoviePage";
import "./pages/loginpage/home.scss";
import "./pages/dashboard/dashboard.scss";
import "./pages/profile/profile.scss";
import "./pages/movie/movie.scss";
import "./index.scss";
import "./pages/searchresult/searchresult.scss";
import "./pages/reset/reset.scss";
import "./pages/menubar/menubar.scss";
import {SearchResult} from "./pages/searchresult/SearchResult";
import {Reset} from "./pages/reset/Reset";

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/home" component={LoginPage}/>
                <Route exact path="/dashboard" component={Dashboard}/>
                <Route exact path="/profile_home" component={ProfileHome}/>
                <Route exact path="/movie" component={MoviePage}/>
                <Route exact path="/search" component={SearchResult}/>
                <Route exact path="/reset" component={Reset}/>
                <Redirect from="/" to="/home"/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);