import React from 'react';
import { doLogout } from '../../state/app/app.thunks';
import {useDispatch} from "react-redux";
export default function NavBar({ user }) {
    const dispatch = useDispatch();
    const logOut = () => {
        dispatch(doLogout())
    }
    if (user) {
        return (
            <nav className="navbar navbar-expand-md navbar-dark site-header">
                <a className="navbar-brand" href="#">MindLogger</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {user.firstName}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="/changepassword">Settings</a>
                                <a className="dropdown-item" href="/profile">Profile</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" onClick={() => logOut()} href="logout">LogOut</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="navbar navbar-expand-md navbar-dark site-header">
                <a className="navbar-brand" href="#">MindLogger</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="/login">Login <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div>
            </nav>

        );
    }
}

