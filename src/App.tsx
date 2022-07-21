import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import DragMove from './Test'
import Draggable from 'react-draggable'
import styled from 'styled-components'
import React from 'react'

const useDraggable = ({
  setDragging, targetContainer, setEntered, onDrop, item
}: any) => {
  const nodeRef = useRef(null);
  const [entered, setInternalEntered] = useState(false)

  const handleStart = () => {
    console.log("starting")
  }

  const handleDrag = (e) => {
    setDragging(true)
    console.log("dragging")
    const { clientX, clientY } = e
    const container = targetContainer.current?.getBoundingClientRect();
    console.log(container)
    if (
      container &&
      clientX > container.x &&
      clientX < container.x + container.width &&
      clientY > container.y &&
      clientY < container.y + container.height
    ) {
      setEntered(true)
      setInternalEntered(true)
    } else {
      setEntered(false)
      setInternalEntered(false)
    }
  }

  const handleStop = () => {
    console.log("stopping")
    if (entered) {
      onDrop && onDrop()
    }
    setDragging(false)
    setEntered(false)
    setInternalEntered(false)
  }

  return {
    draggableProps: {
      onDrag: handleDrag,
      position: { x: 0, y: 0 },
      ref: nodeRef,
      onStop: handleStop,
      onStart: handleStart
    }
  }
}

const DraggableWrapper = ({
  children, targetContainer, setEntered, onDrop
}: any) => {
  const [dragging, setDragging] = useState(false)
  const { draggableProps } = useDraggable({
    setDragging,
    targetContainer,
    setEntered,
    onDrop
  })

  const cloneChild = React.isValidElement(children)
    ? React.cloneElement<any>(children, { ...(children?.props as {} || {}), draggable: true })
    : children


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
  )
}

const Item = ({ text, draggable, handleClick, clicked }: any) => {
  // console.log({ clicked })
  const handleCheckClick = (e: any) => {
    console.log("here")
    handleClick && handleClick()
    if (draggable) {
      console.log("this")
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }
  return (
    <StyledItem>
      {text}
      <div>
        <button
          style={{
            zIndex: 10, backgroundColor: clicked ? "skyblue" : "yellow",
            opacity: draggable ? 0 : 1
          }}
          onClick={handleCheckClick}>Checkbox</button>
      </div>
    </StyledItem >
  )
}

function App() {
  const [entered1, setEntered1] = useState(false)
  const [entered2, setEntered2] = useState(false)

  const targetContainer1 = useRef<HTMLHeadingElement>(null)
  const targetContainer2 = useRef<HTMLHeadingElement>(null)

  const [selected1, setSelected1] = useState<string[]>([])
  const [selected2, setSelected2] = useState<string[]>([])

  const [items1, setItems1] = useState([ // unassigned facilities
    "ABC",
    "XYZ",
    "Drag this!"
  ])

  const [items2, setItems2] = useState([ // assigned facilities
    "123",
    "Numbers!!",
  ])

  const handleDrop1 = (...items: any) => {
    setItems1(items1.filter(i => !items.includes(i)))
    setItems2([...items2, ...items])
    setSelected1(selected1.filter(s => !items.includes(s)))
  }

  const handleDrop2 = (...items: any) => {
    setItems2(items2.filter(i => !items.includes(i)))
    setItems1([...items1, ...items])
    setSelected2(selected2.filter(s => !items.includes(s)))
  }

  const handleSelect1 = (item: string) => {
    if (selected1.includes(item)) {
      setSelected1(selected1.filter(s => s !== item))
    } else {
      setSelected1([...selected1, item])
    }
  }

  const handleSelect2 = (item: string) => {
    if (selected2.includes(item)) {
      setSelected2(selected2.filter(s => s !== item))
    } else {
      setSelected2([...selected2, item])
    }
  }

  return (
    <div style={{ display: "flex", width: "100vw", gap: "50px" }}>

      {/** List 1 */}
      <List
        highlight={entered2}
        ref={targetContainer1}>
        {items1.map((item: string) => (
          <DraggableWrapper
            targetContainer={targetContainer2}
            onDrop={() => handleDrop1(item)}
            setEntered={setEntered1}>
            <Item
              clicked={selected1.includes(item)}
              text={item}
              handleClick={() => handleSelect1(item)} />
          </DraggableWrapper>
        ))}
      </List>

      {/** Transfer Buttons */}
      <ButtonContainer>
        <button
          disabled={!selected1.length}
          onClick={() => handleDrop1(...selected1)}
        >{">"}</button>
        <button
          onClick={() => handleDrop1(...items1)}
        >{">>"}</button>
        <button
          onClick={() => handleDrop2(...items2)}
        >{"<<"}</button>
        <button
          disabled={!selected2.length}
          onClick={() => handleDrop2(...selected2)}
        >{"<"}</button>
      </ButtonContainer>

      {/** List 2 */}
      <List
        highlight={entered1}
        ref={targetContainer2}>
        {items2.map((item: string) => (
          <DraggableWrapper
            targetContainer={targetContainer1}
            onDrop={() => handleDrop2(item)}
            setEntered={setEntered2}>
            <Item
              text={item}
              clicked={selected2.includes(item)}
              handleClick={() => handleSelect2(item)}
            />
          </DraggableWrapper>
        ))}
      </List>
    </div>
  )
}

const ButtonContainer = styled.div({
  fontWeight: 700,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "75px",
  height: "300px",
  justifySelf: "center",
  alignSelf: "center",
  ["button"]: {
    backgroundColor: "red",
    color: "white",
  },
  ["button:disabled"]: {
    backgroundColor: "gray"
  }
})

const List = styled.div<{ highlight?: boolean }>(({ highlight }) => ({
  fontWeight: 700,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "300px",
  height: "700px",
  position: "relative",
  border: highlight ? "2px solid blue" : "1px solid gray",
}))

const StyledItem = styled.div({
  width: "100%", height: "50px", backgroundColor: "coral"
})

export default App
