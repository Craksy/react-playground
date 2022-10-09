import { Button, HotkeyConfig, HotkeysTarget2, InputGroup, Intent } from '@blueprintjs/core'
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './Calc.scss'

const Calc = () => {

  let [input, _setInput] = useState("0");
  let [outputRows, setOutputRows] = useState<string[]>();

  const setInput = (value: string) => {
   if(value == ""){
    _setInput("0")
   }else if(input == "0"){
    _setInput(value.substring(1))
   }else{
    _setInput(value)
   }
  }

  interface CalcButtonProps {
     text: string
     className?: string
     special?: boolean
     insert?: string
     intent?: Intent
  }

  const CalcDigit = (props: CalcButtonProps) => {
    return(
        <div className={"calc button ".concat(props.className ?? "")}>
          <Button fill
                intent={props.intent ?? Intent.NONE} 
                onClick={(_) => setInput(input.concat(props.insert??props.text))}
                text={props.text}/>
        </div>
    )
  }

  const handleInputChange = (e: ChangeEvent) => {
    let v = (e.target as HTMLInputElement).value
    if(v != null)
      setInput(v)
  }

  const backspace = () => setInput(input.substring(0, input.length-1));
  const clear = () => setInput("");
  const clearEverything = () => {
    setInput("");
    setOutputRows([])
  }

  return(
    <div className="Calc">
      <div id="output"><span>output</span></div>
      <InputGroup onChange={handleInputChange} id="input" value={input}/>
      <div className="calc button-row bp4-div">
        <div className="calc button button-special"><Button onClick={clearEverything} fill intent="danger" text="CE"/></div>
        <div className="calc button button-special"><Button onClick={clear} fill intent="warning" text="C"/></div>
        <div className="calc button button-special"><Button onClick={backspace} fill intent="none" text="Backspace"/></div>
      </div>
      <div className="calc button-row">
        <CalcDigit text="1"/>
        <CalcDigit text="2"/>
        <CalcDigit text="3"/>
        <CalcDigit text="/" className="button-operator f2"/>
      </div>
      <div className="calc button-row">
        <CalcDigit text="4"/>
        <CalcDigit text="5"/>
        <CalcDigit text="6"/>
        <CalcDigit text="x" className="button-operator f2"/>
      </div>
      <div className="calc button-row">
        <CalcDigit text="7"/>
        <CalcDigit text="8"/>
        <CalcDigit text="9"/>
        <CalcDigit text="-" className="button-operator f2"/>
      </div>
      <div className="calc button-row">
        <CalcDigit text="+" className="button-operator"/>
        <CalcDigit text="0"/>
        <CalcDigit text="."/>
        <CalcDigit text="=" className="button-operator f2 bp4-intent-danger"/>
      </div>
    </div>
  )
}

export default Calc
