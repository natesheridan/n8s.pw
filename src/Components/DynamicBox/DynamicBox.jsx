import React, { useRef } from 'react';
import './DynamicBox.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import Typewriter from 'typewriter-effect';

const DynamicBox = (props) => {
    const { side, color, image, header, subheader, content, link, id, typeDelay, iframe, component } = props;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    if (component) {
        return null; 
    }

    return (
        <article 
            id={id} 
            className={`dynamic-box ${color}`}
            ref={ref}
        >
            {image && 
                <div className={`image-container ${side}`}>
                    <motion.img 
                        src={image.url} 
                        alt={header} 
                        className={`dynamic-image ${image.imgStyle}`} 
                        style={{ y }}
                    />
                </div>
            }
            <div className="content-container">
                {header && <h2>{header}</h2>}
                {subheader && (
                    <Typewriter
                        options={{
                            strings: subheader,
                            autoStart: true,
                            loop: true,
                            wrapperClassName: 'h2',
                            cursorClassName: 'h2cursor',
                            delay: typeDelay,
                        }}
                    />
                )}
                {content && <p>{content}</p>}
                {iframe && (
                    <iframe
                        id={`${id}_frame`}
                        src={iframe.url}
                        style={{ width: '1px', minWidth: '100%', height: `${iframe.height}px`, border: 'none' }}
                        title={header}
                    />
                )}
                {link && (
                    <a rel="noreferrer" target="_blank" href={link.url}>
                        {link.title}
                    </a>
                )}
            </div>
        </article>
    );
}

export default DynamicBox
