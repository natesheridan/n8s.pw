import React from 'react';
import './DynamicBox.css';
import Fade from 'react-reveal/Fade';
import Typewriter from 'typewriter-effect';
import IframeResizer from 'iframe-resizer-react'





const DynamicBox = ({type, color, image, header, subheader, content, link, side, id, typeDelay, iframe}) => {
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
                        // [contentWrapped]
                        <></>
                    }
                    {link && 
                        <a href={link.url}>{link.title}</a>
                    }
            </div>
        )
    }
    
    return (
        <div key={id} id={id} className = {`box bc-${color} bf-${side}`}>
                {image && 
                    <Fade delay={1100}>
                        <img className = {image.imgStyle} src={image.url}></img>
                    </Fade>
                }
                {header &&
                    <h1 className="h1">{header}</h1>
                }
                {subheader && 
                    <Typewriter
                    options={{
                        stringSplitter : true,
                        strings: subheader,
                        autoStart: true,
                        wrapperClassName:'h2',
                        cursorClassName:'h2cursor',
                        
                        delay: typeDelay,
                    }}
                    />
                }
                
                {content && 
                        <p>{content}</p>
                }
                {iframe && 
                    <IframeResizer 
                    id={`${id}_frame`} 
                    heightCalculationMethod="lowestElement"
                    warningTimeout={0}
                    src={iframe.url}
                    style={{ width: '1px', minWidth: '100%', height: `${iframe.height}px` }}
                    // warningTimeout='2000'
                    />
                }
                {link && 
                    <a target="_blank" href={link.url}>{link.title}</a>
                }
        </div>
    )
}

export default DynamicBox
