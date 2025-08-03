import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useObserver } from 'preact-intersection-observer';
import './BuildBreakAnimation.css';

const BuildBreakAnimation = () => {
    const [word, setWord] = useState('break');
    const [highlighted, setHighlighted] = useState(false);
    const [showCursor, setShowCursor] = useState(false);
    const [showUnderline, setShowUnderline] = useState(false);
    const controls = useAnimation();
    const cursorControls = useAnimation();
    const wordRef = useRef(null);

    const [ref, inView] = useObserver({
        triggerOnce: true,
        threshold: 0.5,
    });

    useEffect(() => {
        const sequence = async () => {
            if (inView) {
                await new Promise(res => setTimeout(res, 1000)); // 1-second delay
                setShowUnderline(true);
                setShowCursor(true);

                // Animate cursor to the start of the word
                await cursorControls.start({
                    x: wordRef.current.offsetLeft,
                    opacity: 1,
                    transition: { duration: 0.5 }
                });

                // Highlight "break" letter by letter
                const letters = wordRef.current.children;
                for (let i = 0; i < letters.length; i++) {
                    await cursorControls.start({
                        x: letters[i].offsetLeft + letters[i].offsetWidth,
                        transition: { duration: 0.1 }
                    });
                    letters[i].classList.add('highlighted');
                }
                setHighlighted(true);
                await new Promise(res => setTimeout(res, 300));

                // Delete "break"
                const breakWord = 'break';
                for (let i = breakWord.length; i > 0; i--) {
                    setWord(breakWord.substring(0, i - 1));
                    await new Promise(res => setTimeout(res, 100));
                }

                // Type "build"
                const buildWord = 'build';
                for (let i = 1; i <= buildWord.length; i++) {
                    setWord(buildWord.substring(0, i));
                    await new Promise(res => setTimeout(res, 150));
                }
                
                // Finish
                setShowUnderline(false);
                setHighlighted(false); // Remove highlight
                await cursorControls.start({ opacity: 0, transition: { duration: 0.3 } });
                setShowCursor(false);
            }
        };
        sequence();
    }, [inView, cursorControls]);

    return (
        <h1 ref={ref} className="build-break-animation">
            Hi, I'm Nate, a another nerd who just really, really likes to&nbsp;
            <span className={`word-wrapper ${highlighted ? 'final-highlight' : ''}`}>
                <span ref={wordRef} className="word break">
                    {word.split('').map((char, i) => <span key={i}>{char}</span>)}
                </span>
                {showCursor && <motion.div className="mouse-cursor" animate={cursorControls} />}
                <div className={`squiggly-underline ${showUnderline ? 'active' : ''}`}></div>
            </span>
            &nbsp;things.
        </h1>
    );
};

export default BuildBreakAnimation;
