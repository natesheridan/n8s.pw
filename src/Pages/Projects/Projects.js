import React, {useEffect, useState} from 'react'
import IframeResizer from 'iframe-resizer-react'
import './Projects.css'


const Projects = () => {

    useEffect(() => {
        // fetchArticles()
    }, [])

    return (
    <>
        <h2>projects directory</h2>
        <section className="content projects">
            <IframeResizer 
                id='projectsFrame' 
                heightCalculationMethod="lowestElement"
                inPageLinks
                log
                src="http://projects.n8s.pw/"
                style={{ width: '1px', minWidth: '100%'}}
            />
        </section>
    </>
    )
}

export default Projects
