import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-panel p-6 ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
