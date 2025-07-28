import React from 'react';
import './DynamicBox.css';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}>
                        <img alt={header} className = {image.imgStyle} src={image.url}></img>
                    </motion.div>
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
                    <iframe
                        id={`${id}_frame`}
                        src={iframe.url}
                        style={{ width: '1px', minWidth: '100%', height: `${iframe.height}px`, border: 'none' }}
                        title={header}
                    />
                }
                {link && 
                    <a rel="noreferrer" target="_blank" href={link.url}>{link.title}</a>
                }
        </div>
    )
}

export default DynamicBox
