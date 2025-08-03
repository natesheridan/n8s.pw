import React from 'react';
import { motion } from 'framer-motion';
import WhiteboardExperience from '../../Components/WhiteboardExperience/WhiteboardExperience';
import './WhiteboardPage.css';

const WhiteboardPage = () => {
    const handleClose = () => {
        // Navigate back to projects
        window.location.href = '/projects';
    };

    return (
        <motion.div 
            className="whiteboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <WhiteboardExperience onClose={handleClose} />
        </motion.div>
    );
};

export default WhiteboardPage;