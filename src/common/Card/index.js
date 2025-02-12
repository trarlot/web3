import { useEffect, useRef } from 'react';

export const Card = ({ children, className }) => {
    return (
        <div
            className={`p-6 size-fit border-2 rounded-xl border-transparent overflow-hidden ${className}`}
            style={{
                background: `linear-gradient(#2c2c2c, #2c2c2c), linear-gradient( #4540cc, #9b4298)`,
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'border-box',
            }}>
            {children}
        </div>
    );
};
