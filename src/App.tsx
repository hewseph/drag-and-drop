import './App.css'
import { StyledItem, TransferList } from './TransferList'

export const Item = ({ text, draggable, handleClick, clicked }: any) => {
  const handleCheckClick = (e: any) => {
    handleClick && handleClick()
  }

  return (
    <StyledItem>
      {text}
      <div>
        <button
          style={{
            zIndex: 10, backgroundColor: clicked ? "skyblue" : "yellow",
            opacity: draggable ? 0 : 1 // this makes the button invisible on the dragable copy
          }}
          onClick={handleCheckClick}>Checkbox</button>
      </div>
    </StyledItem >
  )
}

function App() {

  const handleChange = (
    list1,
    list2,
  ) => {
    console.log({
      list1, list2
    })
  }

  return <TransferList
    onChange={handleChange}
    list1={[ // unassigned facilities
      "ABC",
      "XYZ",
      "Drag this!"
    ]}
    list2={[ // assigned facilities
      "123",
      "Numbers!!",
    ]}
  />
}

export default App
