import React from 'react'
import './Button.css'
import { Link } from 'react-router-dom';

const Button = ({to, color, size, label}) => {
    return (
        <Link to={to}>
            <button className="button">
            <span className="buttonspan">{label}</span>
            </button>
        </Link>
    )
}

export default Button
