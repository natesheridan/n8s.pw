import React from 'react';
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div>©{new Date().getFullYear()} Nate Sheridan</div>
            <div>
                <a href="https://n8.wtf" target="_blank" rel="noopener noreferrer">n8.wtf</a>
                {' ▶ '}
                <a href="https://n8s.pw" target="_blank" rel="noopener noreferrer">n8s.pw</a>
                {' ◀ '}
                <a href="https://autofoc.us" target="_blank" rel="noopener noreferrer">autofoc.us</a>
            </div>
        </footer>
    )
}

export default Footer
