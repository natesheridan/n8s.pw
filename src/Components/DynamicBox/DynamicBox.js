import React from 'react';
import './DynamicBox.css';
import Fade from 'react-reveal/Fade';


const DynamicBox = ({type, color, image, header, subheader, content, link, side}) => {
    if(type==="slider"){
        return (
            <div className = {`box bc-${color} bf-${side}`}>
                    {header && 
                        <h1>{header}</h1>
                    }
                    {subheader && 
                        <h2>{subheader}</h2>
                    }

                    {content && 
                        [contentWrapped]
                    }
                    {link && 
                        <a href={link.url}>{link.title}</a>
                    }
            </div>
        )
    }
    const contentWrapped = content.map(paragraph => {
            return (
            <p>{paragraph}</p>
        )
    })
    
    return (
        <div key={header.split(' ').join('-')} id={header.split(' ').join('-')} className = {`box bc-${color} bf-${side}`}>
                {image && 
                    <Fade delay={500}>
                        <img className = {image.clipStyle} src={image.url}></img>
                    </Fade>
                }
                {header && 
                    <h1>{header}</h1>
                }
                {subheader && 
                    <h2>{subheader}</h2>
                }
                
                {content && 
                    [contentWrapped]
                }
                {link && 
                    <a href={link.url}>{link.title}</a>
                }
        </div>
    )
}

export default DynamicBox
