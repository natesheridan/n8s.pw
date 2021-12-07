import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import Bounce from 'react-reveal/Bounce';


const Header = () => {
    return (
        <div className="header">
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
                <Bounce left>
                    <img src='./logo.png'></img><h1 className="nav-logo">Nate Sheridan</h1>
                </Bounce>
                </div>
                    <Bounce top delay={100}>
                <div className="nav-links">
                    <NavLink to="/home">home</NavLink>
                    <NavLink to="/about">about</NavLink>
                    <NavLink to="/projects">projects</NavLink>
                    <NavLink to="/contact">contacts</NavLink>
                </div>
                    </Bounce>
            </div>
        </div>
    )
}

export default Header
