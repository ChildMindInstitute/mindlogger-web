import React from 'react';
import {useSelector} from "react-redux";
import {userInfoSelector} from "../../state/user/user.selectors";

export default function Profile() {
    let user = useSelector(state => userInfoSelector(state));
    return (
        <div class="mt-3 mb-3 h-100">
            <div class="heading">
                <h1>
                    {user?.firstName} {user?.lastName}
                </h1>
            </div>
            <hr/>
                <div>
                    Download MindLogger to get started.
                </div>

                <div>
                    Thank you for creating an account with MindLogger.
                    Download MindLogger on an iOS or Android device to get started.
                </div>
        </div>
);
}
