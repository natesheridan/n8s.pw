import React, { useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './StoryScroller.css';

const componentMap = {
  CarSvg: lazy(() => import('../CarSvg/CarSvg')),
  ServerRack: lazy(() => import('../ServerRack/ServerRack')),
  Image: ({ src, alt, imgStyle, align, ...props }) => {
    const className = imgStyle || undefined;
    if (/\.(mp4|webm)$/i.test(src)) {
      return (
        <video
          className={className}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          {...props}
        >
          <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      );
    }
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" {...props} />;
  },
  Terminal: lazy(() => import('../Terminal/Terminal')),
  ServerStack: lazy(() => import('../ServerStack/ServerStack')),
};

const getAnimation = (animationType, scrollYProgress, start, end, direction) => {
    const slideDuration = end - start;
    const transitionTime = slideDuration * 0.25;
    const inEnd = start + transitionTime;
    const outStart = end - transitionTime;

    const safeOpacity = useTransform(scrollYProgress, [start, inEnd, outStart, end], [0, 1, 1, 0]);

    switch (animationType) {
        case 'drive-and-grow':
            return {
                x: useTransform(scrollYProgress, [start, end], ['-50%', '150%']),
                scale: useTransform(scrollYProgress, [start, end], [0.5, 2.5]),
                opacity: useTransform(scrollYProgress, [start, inEnd, end - (slideDuration*0.1), end], [0, 1, 1, 0])
            };
        case 'drive-and-grow-rtl':
            return {
                x: useTransform(scrollYProgress, [start, end], ['150%', '-50%']),
                scale: useTransform(scrollYProgress, [start, end], [0.5, 2.5]),
                opacity: useTransform(scrollYProgress, [start, inEnd, end - (slideDuration*0.1), end], [0, 1, 1, 0])
            };
        case 'park-top-right':
            // comes from LEFT → parks → pauses during text → exits RIGHT, growing in scale
            return {
                x: useTransform(scrollYProgress,
                    [start, start + slideDuration * 0.35, start + slideDuration * 0.82, end],
                    ['-180%', '0%', '0%', '260%']),
                scale: useTransform(scrollYProgress,
                    [start + slideDuration * 0.82, end],
                    [1, 2.4]),
                opacity: useTransform(scrollYProgress, [start, start + slideDuration * 0.18], [0, 1])
            };
        case 'park-top-left':
            // comes from RIGHT → parks → pauses during text → exits LEFT, same scale
            return {
                x: useTransform(scrollYProgress,
                    [start, start + slideDuration * 0.35, start + slideDuration * 0.82, end],
                    ['180%', '0%', '0%', '-260%']),
                opacity: useTransform(scrollYProgress, [start, start + slideDuration * 0.18], [0, 1])
            };
        case 'slide-in-left':
            return {
                x: useTransform(scrollYProgress, [start, inEnd, outStart, end], ['-50%', '0%', '0%', '-50%']),
                opacity: safeOpacity
            };
        case 'slide-in-right':
            return {
                x: useTransform(scrollYProgress, [start, inEnd, outStart, end], ['50%', '0%', '0%', '50%']),
                opacity: safeOpacity
            };
        case 'zoom-in':
            return {
                scale: useTransform(scrollYProgress, [start, inEnd, outStart, end], [0.5, 1, 1, 0.5]),
                opacity: safeOpacity
            };
        case 'fade-in':
            return {
                opacity: safeOpacity
            };
        case 'drive-by':
        default:
            return {
                x: useTransform(
                    scrollYProgress,
                    [start, (start + end) / 2, end],
                    direction === 'left-to-right' ? ['-100%', '50%', '200%'] : ['200%', '50%', '-100%']
                ),
                scale: useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.5, 1, 0.5]),
                opacity: useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]),
            };
    }
}

const CustomComponent = ({ component, scrollYProgress, start, end }) => {
    const Component = component ? componentMap[component.name] : null;

    if (!Component) return null;

    const { animationType = 'drive-by', direction = 'left-to-right', ...restProps } = component.props || {};
    
    const animation = getAnimation(animationType, scrollYProgress, start, end, direction);

    return (
        <Suspense fallback={<div />}>
            <motion.div
                className={`story-scroller-component ${component.props?.align || ''} ${animationType}`}
                style={animation}
            >
                <Component {...restProps} />
            </motion.div>
        </Suspense>
    );
};

const TextBlock = ({ textBlock, opacity }) => {
    const { text, align = 'center', style = 'default' } = textBlock;
    return (
        <motion.div style={{ opacity }} className={`text-block ${align} ${style}`}>
            <p>{text}</p>
        </motion.div>
    )
}

const StoryScroller = ({ story }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });

    let lastBgIndex = -1;
    const storyWithFallbacks = story.map((item, index) => {
        if (item.background) {
            lastBgIndex = index;
            return item;
        }
        return { ...item, background: story[lastBgIndex]?.background };
    });

    return (
        <div ref={targetRef} className="story-scroller-container" style={{ height: `${story.length * 100}vh` }}>
            <div className="story-scroller-sticky">
                {storyWithFallbacks.map((item, index) => {
                    const start = index / story.length;
                    const end = (index + 1) / story.length;
                    
                    const opacity = useTransform(
                        scrollYProgress,
                        [start, start + 0.1, end - 0.1, end],
                        index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0]
                    );

                    if (!item.background) return null;

                    return (
                        <motion.div
                            key={index}
                            className="story-scroller-background"
                            style={{
                                backgroundImage: `url(${item.background})`,
                                opacity: opacity,
                            }}
                        />
                    );
                })}

                <div className="story-content-container">
                    {story.map((item, index) => {
                        const start = index / story.length;
                        const end = (index + 1) / story.length;
                        
                        const slideDuration = end - start;
                        const transitionTime = slideDuration * 0.25;
                        const inEnd = start + transitionTime;
                        const outStart = end - transitionTime;
                        
                        const opacity = useTransform(
                            scrollYProgress,
                            [start, inEnd, outStart, end],
                            [0, 1, 1, 0]
                        );

                        // cars-converge text: fades in after cars park, fades out before cars exit
                        const carTextOpacity = useTransform(
                            scrollYProgress,
                            [
                                start + slideDuration * 0.35,
                                start + slideDuration * 0.50,
                                start + slideDuration * 0.72,
                                start + slideDuration * 0.82,
                            ],
                            [0, 1, 1, 0]
                        );

                                                    return (
                                <div key={index} className={`story-slide ${item.layout || 'center'}`}>
                                    {item.layout === 'side-by-side' ? (
                                        <>
                                            <div className="story-content">
                                                {item.textBlock && <TextBlock textBlock={item.textBlock} opacity={opacity} />}
                                            </div>
                                            {item.component &&
                                                <CustomComponent
                                                    component={item.component}
                                                    scrollYProgress={scrollYProgress}
                                                    start={start}
                                                    end={end}
                                                />
                                            }
                                        </>
                                    ) : item.layout === 'cars-converge' ? (
                                        <>
                                            {item.components && item.components.map((comp, ci) => (
                                                <CustomComponent
                                                    key={ci}
                                                    component={comp}
                                                    scrollYProgress={scrollYProgress}
                                                    start={start}
                                                    end={end}
                                                />
                                            ))}
                                            {item.textBlock && <TextBlock textBlock={item.textBlock} opacity={carTextOpacity} />}
                                        </>
                                    ) : (
                                        <>
                                            <div className="story-content">
                                                {item.text && <motion.p className="default-text" style={{ opacity }}>{item.text}</motion.p>}
                                                {item.textBlock && <TextBlock textBlock={item.textBlock} opacity={opacity} />}
                                            </div>
                                            {item.component &&
                                                <CustomComponent
                                                    component={item.component}
                                                    scrollYProgress={scrollYProgress}
                                                    start={start}
                                                    end={end}
                                                />
                                            }
                                        </>
                                    )}
                                </div>
                            );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StoryScroller;
