import React from 'react'
import * as FontAwesome from "react-icons/fa";
import './SocialButton.css'


const SocialButton = ({to, faIcon, size, label}) => {
    const Icon = FontAwesome[faIcon];
    const iconStyle = {
        width: size,
        height: size,
    }
    const onClick = (link) => {
        window.open(link, '_blank');

    }
    return (
        <div onClick={() => onClick(to)}  key = {label} className="social-button">
            <button className="social-btn">
                <Icon className="social-svg" style={iconStyle}/>
            </button>
            <p className="social-label">{label}</p>
        </div>
        
    )
}

export default SocialButton
