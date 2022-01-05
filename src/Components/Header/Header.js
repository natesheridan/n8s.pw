import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import Bounce from 'react-reveal/Bounce';


const Header = () => {

    const navClick = () => {
        document.querySelector('#nav-check').checked = false;
    }

    return (
        <header className="header">
            <div className="nav">
                <input type="checkbox" id="nav-check"></input>
                <div className="nav-btn">
                    <label htmlFor="nav-check">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                </div>
                <div className="nav-header">
                <Bounce top delay={500}>
                    <img alt="logo" src='./logo.png'></img><h1 className="nav-logo">Nate Sheridan</h1>
                </Bounce>
                </div>
                    <Bounce top delay={500}>
                <div className="nav-links">
                    <NavLink onClick={() => navClick()} to="/home">home</NavLink>
                    <NavLink onClick={() => navClick()} to="/about">about</NavLink>
                    <NavLink onClick={() => navClick()} to="/projects">projects</NavLink>
                    <NavLink onClick={() => navClick()} to="/contact">contact</NavLink>
                </div>
                    </Bounce>
            </div>
        </header>
    )
}

export default Header
