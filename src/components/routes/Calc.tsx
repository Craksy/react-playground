import { Button, Drawer, HotkeyConfig, HotkeysTarget2, InputGroup, Intent} from '@blueprintjs/core'
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import './Calc.scss'


type BinaryOperator = (lhs: number, rhs: number) => number;
type ReducerAction = { type: string; payload?: any; };
type StackEntry = { value: number; operation: string; }
type CalculatorState = StackEntry[];

////////////////////////////////////////////////////////////
// Calculator component
////////////////////////////////////////////////////////////
const Calc = () => {
  let [input, _setInput] = useState("0");
  const setInput = (value: string) => {
   if(value === "") 
    _setInput("0")
   else if(input === "0") 
    _setInput(value.substring(1))
   else 
    _setInput(value)
  }

  let [showDrawer, setShowDrawer] = useState(false);

  // If you're not familiar with the concept, a "Reducer" is just a simple state machine:
  // Given the current state and an action, it returns the next state of the system.
  // Reducers have copy-on-write semantics, meaning that you never *actually* have any shared mutable state
  // which makes state transitioning more predictable, and makes it easier to avoid race conditions.
  const stackReducer = (state: CalculatorState, action: ReducerAction): CalculatorState => {

    const performOp = (operation: BinaryOperator, symbol:string): CalculatorState => {
      if(input !== "0"){
        let value = parseFloat(input);
        if(!isNaN(value)){
          setInput("");
          state = stackReducer(state, {type: "Push", payload: value}) as CalculatorState;
        }
      }
      if(state.length < 2) return state;
      const b = state[state.length-1].value;
      const a = state[state.length-2].value;
      const result = operation(a, b);
      return [...state.slice(0,-2), {value: result, operation: `(${a} ${symbol} ${b})`}];
    }
    switch (action.type) {
      case "Add": return  performOp((a: number,b: number) => a+b,'+');
      case "Sub": return  performOp((a: number,b: number) => a-b,'-');
      case "Mul": return  performOp((a: number,b: number) => a*b,'x');
      case "Div": return  performOp((a: number,b: number) => a/b,'/');
      case "Push": return [...state, {value: action.payload, operation: `${action.payload}`}];
      case "Clear": return []
      default: return state
    }
  };

  let [calcState, dispatch] = useReducer(stackReducer, []);

  useEffect(() => {
    const output = document.getElementById("output")!;
    output.scrollTo(0, output.scrollHeight);
  }, [calcState])


  ////////////////////////////////////////////////////////////////
  // Event handlers //////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  const handleInputChange = (e: ChangeEvent) => {
    let v = (e.target as HTMLInputElement).value
    if(v != null)
      setInput(v)
  }

  const backspace = () => setInput(input.substring(0, input.length-1));
  const clear = () => setInput("");
  const clearEverything = () => {
    setInput("");
    dispatch({type: "Clear"})
  }
  const enter = () => {
    let value = parseFloat(input);
    if(isNaN(value)){
      return;
    }
    dispatch({type: "Push", payload: value});
    setInput("");
  }

  const enterDigit = (e: KeyboardEvent) => {
    setInput(input.concat(e.key))
  }

  let hotkeys: HotkeyConfig[] = [
    {combo: "enter", label: "Submit", global: true, onKeyDown: enter},
    {combo: "backspace", label: "Delete", global: true, onKeyDown: backspace},
    {combo: ".", label: "Dot", global: true, onKeyDown: enterDigit },
    {combo: "plus", label: "Add Operator", global: true, onKeyDown: () =>dispatch({type: "Add"}) },
    {combo: "minus", label: "Subtract Operator", global: true, onKeyDown: () =>dispatch({type: "Sub"}) },
    {combo: "*", label: "Multiply Operator", global: true, onKeyDown: () =>dispatch({type: "Mul"}) },
    {combo: "/", label: "Division Operator", global: true, onKeyDown: () =>dispatch({type: "Div"}) },
    {combo: "escape", label: "Clear", global: true, onKeyDown: clear },
    {combo: "shift+escape", label: "Clear All", global: true, onKeyDown: clearEverything },
  ]
  for(var i = 0; i<10; i++){
    hotkeys.push({combo: `${i}`, label: `Digit ${i}`, global: true, onKeyDown: enterDigit })
  }

  ////////////////////////////////////////////////////////////////
  // Render //////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////

  // Couple of templates to reduce repetition
  const DigitButton = (props: {text:string, className?: string}) => (
    <div className={"calc button ".concat(props.className ?? "")}> 
      <Button fill onClick={() => setInput(input.concat(props.text))} text={props.text} />
    </div>)

  const OperationButton = (props: { text: string, onClick: () => void, className?: string, intent?: Intent }) => (
    <div className={"calc button button-operator ".concat(props.className ?? "")}>
      <Button fill intent={props.intent ?? Intent.NONE} onClick={props.onClick} text={props.text} />
    </div>)

  // Actual render
  return(
    <div style={{height: "100%"}}>
    <div className='help-panel bp4-dark'>
      <Button text="If you're wondering what's wrong with this thing, go here!" 
              style={{width: "200px"}} 
              intent="primary" 
              onClick={() => setShowDrawer(!showDrawer)} 
              rightIcon="help" 
              large outlined/>
      <Drawer className='bp4-dark' isOpen={showDrawer} 
              canEscapeKeyClose isCloseButtonShown canOutsideClickClose
              size={400}  title="Help" icon="info-sign" onClose={() => setShowDrawer(false)}> 
              <div className='drawer-content'>
                  <p>You may find this calculator a little strange. No, It's not broken, this is the intended behavior (at least I hope so).</p>
                  <p>This a stack based calculator. It reads input in <i>postfix notation</i>, also known as <a href="https://en.wikipedia.org/wiki/Reverse_Polish_notation">Reverse Polish Notation</a> </p>
                  <p>Rather than reading an expression like <code>2 + 4</code> (which is known as "infix notation" by the way), postfix notation has both operands before the operator. Like so: <code>2 4 +</code></p>
                  <br/>
                  <p>Every number entered will end up on the "stack" in the output area. Calculations are done by "popping" the two most recent values off the stack, performing the chosen operation, and then pushing the result back on to the stack.</p>
                  <p>It does feel a bit awkward at first, but it is actually surprisingly well suited for several common tasks.</p>
                  <br/>
                  <p>Play around with it a bit. You can press the <b>?</b> key to bring up a list of keybindings, although most of them are what you'd expect.</p>
                  <p>Enjoy</p>
              </div>
      </Drawer>
    </div>
    <HotkeysTarget2 hotkeys={hotkeys}>
    <div className="Calc">
      <div id="output">
        {/* ugly hack to end-justify rows and not cause the overflowing elemnts to extend past the top. */}
          <div className='stack-entry'><div className='stack-op'></div>&nbsp;<div className='stack-value'> </div></div>
          <div className='stack-entry'><div className='stack-op'></div>&nbsp; <div className='stack-value'> </div></div>
          <div className='stack-entry'><div className='stack-op'></div>&nbsp; <div className='stack-value'> </div></div>
          <div className='stack-entry'><div className='stack-op'></div>&nbsp; <div className='stack-value'> </div></div>
          <div className='stack-entry'><div className='stack-op'></div>&nbsp; <div className='stack-value'> </div></div>
          {calcState.map((entry, i) => (
          <div key={i} className='stack-entry'>
            <div className='stack-op'>{entry.operation}</div><div className='stack-value'>{entry.value}</div>
          </div>
          ))}
      </div>
      <InputGroup onChange={handleInputChange} id="input" value={input}/>
      <div className="calc button-row bp4-div">
        <div className="calc button button-special"><Button onClick={clearEverything} fill intent="danger" text="CE"/></div>
        <div className="calc button button-special"><Button onClick={clear} fill intent="warning" text="C"/></div>
        <div className="calc button button-special"><Button onClick={backspace} fill intent="none" text="Backspace"/></div>
      </div>
      <div className="calc button-row">
        <DigitButton text="1"/> <DigitButton text="2"/> <DigitButton text="3"/>
        <OperationButton text="/" onClick={() => dispatch({type: "Div"})} className="f2"/>
      </div>
      <div className="calc button-row">
        <DigitButton text="4"/> <DigitButton text="5"/> <DigitButton text="6"/>
        <OperationButton text="x" onClick={() => dispatch({type: "Mul"})} className="f2"/>
      </div>
      <div className="calc button-row">
        <DigitButton text="7"/> <DigitButton text="8"/> <DigitButton text="9"/>
        <OperationButton text="-" onClick={() => dispatch({type: "Sub"})} className="f2"/>
      </div>
      <div className="calc button-row">
        <OperationButton text="+" onClick={() => dispatch({type: "Add"})}/> <DigitButton text="0"/> <DigitButton text="."/>
        <OperationButton text="=" onClick={enter} className="f2" intent='success'/>
      </div>
    </div>
  </HotkeysTarget2>
</div>
  )
}

export default Calc
