import { useRef, useState } from 'react';

export const useDraggable = ({
    setDragging, targetContainer, setEntered, onDrop, item
}: any) => {
    const nodeRef = useRef(null);
    const [entered, setInternalEntered] = useState(false);

    const handleStart = () => {
        console.log("starting");
    };

    const handleDrag = (e) => {
        setDragging(true);
        console.log("dragging");
        const { clientX, clientY } = e;
        const container = targetContainer.current?.getBoundingClientRect();
        console.log(container);
        if (container &&
            clientX > container.x &&
            clientX < container.x + container.width &&
            clientY > container.y &&
            clientY < container.y + container.height) {
            setEntered(true);
            setInternalEntered(true);
        } else {
            setEntered(false);
            setInternalEntered(false);
        }
    };

    const handleStop = () => {
        console.log("stopping");
        if (entered) {
            onDrop && onDrop();
        }
        setDragging(false);
        setEntered(false);
        setInternalEntered(false);
    };

    return {
        draggableProps: {
            onDrag: handleDrag,
            position: { x: 0, y: 0 },
            ref: nodeRef,
            onStop: handleStop,
            onStart: handleStart
        }
    };
};
