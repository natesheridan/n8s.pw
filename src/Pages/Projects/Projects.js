import React, {useEffect, useState} from 'react'
import Fade from 'react-reveal/Fade'
import IframeResizer from 'iframe-resizer-react'
import './Projects.css'


const Projects = () => {

    useEffect(() => {
        // fetchArticles()
    }, [])

    return (
    <>
        <section className="content projects">
            <Fade left duration={1100}>
                <IframeResizer 
                    id='projectsFrame' 
                    heightCalculationMethod="lowestElement"
                    autoResize = 'true'
                    inPageLinks='true'
                    checkOrigin="false"
                    src="https://projects.n8s.pw/"
                    style={{ width: '1px', minWidth: '100%'}}
                    // warningTimeout='2000'
                />
            </Fade>
        </section>
    </>
    )
}

export default Projects
