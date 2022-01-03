import React from 'react'
import './Button.css'
import { Link } from 'react-router-dom';

const Button = ({to, href, color, size, label}) => {
    if (href){
        return (
            <a to={to}>
                <button className={`button button-${color} button-${size}`}>
                <span className="buttonspan">{label}</span>
                </button>
            </a>
        )
    }
    if (to){
        return (
            <Link to={to}>
                <button className={`button button-${color} button-${size}`}>
                <span className="buttonspan">{label}</span>
                </button>
            </Link>
        )
    }
    
}

export default Button
