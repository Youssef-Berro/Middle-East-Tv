import React from "react";
import './../css/Header.css'
import {useNavigate} from 'react-router-dom'


function Header() {
    const path = useNavigate()

    return (
        <>
            <div className="header">
                <p className="title" onClick={() => {path('/homepage')}}>
                    <span>Middle East TV</span> &nbsp;&nbsp;
                    <sub>Admin Page</sub>
                </p>
            </div>
        </>
    )
}


export default Header;