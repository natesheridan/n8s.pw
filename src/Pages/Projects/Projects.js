import React, {useEffect, useState} from 'react'
import Fade from 'react-reveal/Fade'
import IframeResizer from 'iframe-resizer-react'
import './Projects.css'


const Projects = () => {
    const [url, setUrl] = useState("https://projects.n8s.pw/")

    useEffect(() => {
        // fetchArticles()
    }, [])

    const checkFrameUrl = () => {
        const currentUrl = document.getElementById("projectsFrame").contentWindow.location.href
        console.log(currentUrl)
        if(url === currentUrl){
            setUrl(currentUrl)

        }
    }
    return (
    <>
        <section className="content projects">
            <Fade left duration={1100}>
                <IframeResizer 
                    onClick={()=>{checkFrameUrl()}}
                    id='projectsFrame' 
                    heightCalculationMethod="lowestElement"
                    autoResize = 'true'
                    checkOrigin="false"
                    src="https://n8s.pw/wp/"
                    style={{ width: '1px', minWidth: '100%'}}
                    // warningTimeout='2000'
                />
            </Fade>
        </section>
    </>
    )
}

export default Projects
