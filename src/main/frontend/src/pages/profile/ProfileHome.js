import {useDispatch, useSelector} from "react-redux";
import {userToken} from "../../redux/UserSlice";
import React, {useEffect, useState} from "react";
import {fetchUserData, loadMovie, modifyWatchLater} from "../../api/apicalls";
import {Helmet} from "react-helmet";
import not_found from "../searchresult/not_found.png";

export function ProfileHome(props) {
    const user = useSelector(userToken);
    const dispatch = useDispatch();

    const [userdetails, setUserdetails] = useState({});
    const [watchlater, setWatchlater] = useState([]);

    useEffect(() => {
        fetchUserData({
            user
        }).then((response) => {
            setUserdetails(response.data)
        })

        modifyWatchLater({
            user
        }, {"action": "GET_LIST", "movie_id": "0"}).then((response) => {
            setWatchlater(response.data.map((movie) => (
                    <li id={movie.id} onClick={handleMovieClick}>
                        <img alt="pic"
                             src={movie.poster_path === null ? not_found : ("https://image.tmdb.org/t/p/original" + movie.poster_path)}
                             width="100px" id={movie.id} onClick={handleMovieClick}/>
                        <div className="movie_li_div" id={movie.id} onClick={handleMovieClick}>
                            <span className="movie_title" id={movie.id}
                                  onClick={handleMovieClick}>{movie.title}</span>
                            <span className="movie_release_date" id={movie.id}
                                  onClick={handleMovieClick}> {movie.release_date === null ? "" : movie.release_date}</span>
                            <br/>
                            <span id={movie.id}
                                  onClick={handleMovieClick}>Original title: {movie.original_title === null ? "" : movie.original_title}</span>
                            <br/>
                            <span id={movie.id} onClick={handleMovieClick}>Ratings</span>
                            <buttom id={movie.id} onClick={handleWatchLaterRemove}>Remove</buttom>
                        </div>
                    </li>
                )))

        })

    }, [])

    function handleSwitchToDashboard() {
        props.history.push("/dashboard");
    }

    function handleWatchLaterRemove(event){
        modifyWatchLater(user, {"action": "REMOVE", "movie_id":event.target.id})
    }

    function handleMovieClick(event) {
        window.location.href = "/movie?" + event.target.id;
    }

    return (
        <div className="profile">
            <Helmet>
                <meta charSet="UTF-8"/>
                <title>Your profile</title>
            </Helmet>
            <div id="body">
                <div className="container">
                    <div className="form">
                        <h1>Welcome to your profile, <span id="firstSpan">{userdetails.firstName}</span>!</h1>
                        <div className="info">Here is your personal information:</div>
                        <table>
                            <tr>
                                <td>Nickname:</td>
                                <td><span>{userdetails.nickname}</span></td>
                            </tr>
                            <tr>
                                <td>First name:</td>
                                <td><span>{userdetails.firstName}</span></td>
                            </tr>
                            <tr>
                                <td>Last name:</td>
                                <td><span>{userdetails.lastName}</span></td>
                            </tr>
                            <tr>
                                <td>Email address:</td>
                                <td><span>{userdetails.email}</span></td>
                            </tr>
                            <tr>
                                <td>Account created at:</td>
                                <td><span>{userdetails.registerDate}</span></td>
                            </tr>
                        </table>
                        <div>Your watchlater list:</div>
                        <div>
                            <ul>
                                {watchlater}
                            </ul>
                        </div>
                        <button className="back-button" onClick={handleSwitchToDashboard}>Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
}