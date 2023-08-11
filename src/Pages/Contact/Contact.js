import React from 'react'
import Fade from 'react-reveal/Fade'
import IframeResizer from 'iframe-resizer-react'


const Contact = () => {
    return (
    <>
        <section className="content contact">
            <Fade left delay={300}>
                <div>
                <IframeResizer 
                    id='contactForm' 
                    heightCalculationMethod="lowestElement"
                    autoResize = 'true'
                    checkOrigin="false"
                    src="https://n8s.pw/wp/contact-form"
                    style={{ width: '1px', minWidth: '100%'}}
                    />
                </div>
            </Fade>
        </section>
    </>
    )
}

export default Contact
