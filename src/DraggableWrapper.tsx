import { useState } from 'react';
import Draggable from 'react-draggable';
import React from 'react';
import { useDraggable } from './useDraggable';

export const DraggableWrapper = ({
    children, targetContainer, setEntered, onDrop
}: any) => {
    const [dragging, setDragging] = useState(false);
    const { draggableProps } = useDraggable({
        setDragging,
        targetContainer,
        setEntered,
        onDrop
    });

    const cloneChild = React.isValidElement(children)
        ? React.cloneElement<any>(children, { ...(children?.props as {} || {}), draggable: true })
        : children;


    return (
        <div style={{ position: "relative" }}>
            <div style={{ opacity: dragging ? 0.5 : 1 }}>
                {children}
            </div>
            <Draggable {...draggableProps}>
                <div style={{ position: "absolute", top: 0, left: 0, opacity: dragging ? 1 : 0, zIndex: 5, cursor: "pointer", width: "100%" }}>
                    {cloneChild}
                </div>
            </Draggable>
        </div>
    );
};
