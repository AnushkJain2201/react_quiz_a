import { useReducer } from "react";

const initialState = {count: 0, step: 1};


// The function of the reducer is that it takes the current state and the action and based on that return the next state
const reducer = (state, action) => {
	console.log(state, action);

    // // Here we have to decide the number of actions that we are going to perform to that state
    // if(action.type === 'inc') {
    //     return state + action.payload;
    // }

    // if(action.type === 'dec') {
    //     return state - action.payload;
    // }

    // if(action.type === 'setCount') {
    //     return action.payload;
    // }

	// Whatever we return here will become the new state
	// return state + action;


	// It is common to use switch statement in the reducer function
	switch(action.type) {
		case 'dec':
			return {...state, count: state.count - state.step};

		case 'inc':
			return {...state, count: state.count + state.step};

		case 'setCount':
			return {...state, count: action.payload};

		case 'setStep':
			return {...state, step: action.payload};
		
		case 'reset': 
			return initialState;
	
		default: 
			throw new Error("Unknown action");
	}
};

function DateCounter() {
	// const [count, setCount] = useState(0);
	// const [step, setStep] = useState(1);

	// This dispatch function can be used to update the state, but it works in a slightly different manner
	const [state, dispatch] = useReducer(reducer, initialState);
	
	const {count, step} = state;



	// This mutates the date object.
	const date = new Date("june 21 2027");
	date.setDate(date.getDate() + count);

	const dec = function () {
		// The action is an object which contains the type and the payload property
		dispatch({ type: "dec" });
		// setCount((count) => count - 1);
		// setCount((count) => count - step);
	};

	const inc = function () {
		// What we pass in the dispatch function become action in the reducer function
		dispatch({ type: "inc" });
		// setCount((count) => count + 1);
		// setCount((count) => count + step);
	};

	const defineCount = function (e) {
		// setCount(Number(e.target.value));
		dispatch({type: 'setCount', payload: Number(e.target.value)});
	};

	const defineStep = function (e) {
		// setStep(Number(e.target.value));
		dispatch({type: 'setStep', payload: Number(e.target.value)});
	};

	const reset = function () {
		// setCount(0);
		// setStep(1);
		dispatch({type: 'reset'})
	};

	return (
		<div className='counter'>
			<div>
				<input
					type='range'
					min='0'
					max='10'
					value={step}
					onChange={defineStep}
				/>
				<span>{step}</span>
			</div>

			<div>
				<button onClick={dec}>-</button>
				<input value={count} onChange={defineCount} />
				<button onClick={inc}>+</button>
			</div>

			<p>{date.toDateString()}</p>

			<div>
				<button onClick={reset}>Reset</button>
			</div>
		</div>
	);
}
export default DateCounter;
