import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import Bounce from 'react-reveal/Bounce';

const Header = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Show header at the top of the page
            if (currentScrollY < 100) {
                setIsHidden(false);
                setLastScrollY(currentScrollY);
                return;
            }

            // Hide header when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY) {
                setIsHidden(true);
                // Close mobile menu when hiding header
                setIsMobileMenuOpen(false);
            } else {
                setIsHidden(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlHeader);

        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY]);

    return (
        <header className={`header ${isHidden ? 'header-hidden' : ''}`}>
            <div className="nav">
                <button 
                    className="nav-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    <span className={isMobileMenuOpen ? 'open' : ''}></span>
                    <span className={isMobileMenuOpen ? 'open' : ''}></span>
                    <span className={isMobileMenuOpen ? 'open' : ''}></span>
                </button>
                <div className="nav-header">
                    <Bounce top delay={500}>
                        <img alt="logo" src='./logo.png'></img>
                    </Bounce>
                </div>
                <Bounce top delay={500}>
                    <div className={`nav-links ${isMobileMenuOpen ? 'menu-open' : ''}`}>
                        <NavLink onClick={closeMenu} to="/home">home</NavLink>
                        <NavLink onClick={closeMenu} to="/about">about</NavLink>
                        <NavLink onClick={closeMenu} to="/projects">projects</NavLink>
                        <NavLink onClick={closeMenu} to="/contact">contact</NavLink>
                    </div>
                </Bounce>
            </div>
        </header>
    );
}

export default Header;
