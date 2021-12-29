import React, {useEffect, useState} from 'react'
import IframeResizer from 'iframe-resizer-react'
import './Projects.css'


const Projects = () => {

    useEffect(() => {
        // fetchArticles()
    }, [])

    return (
    <>
        <h2>projects</h2>
        <section className="content projects">
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
        </section>
    </>
    )
}

export default Projects
