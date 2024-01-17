// import DateCounter from "./DateCounter";

// WE CAN CREATE A FAKE SERVER BU USING AN NPM PACKAGE JSON-SERVER

import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "dataReceived": return {
            ...state,
            questions: action.payload,
            status: 'ready'
        }

        case "dataFailed": return{
            ...state,
            status: 'error',
        }


        default: 
            throw new Error("Action Unknown");
	}
};

function App() {
	// used a useReducer hook to create a state to store all the questions that we fetch from our fake API
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataReceived", payload: data }))
			.catch((err) => dispatch({ type: "dataFailed"}));
	}, []);

	return (
		<div className='app'>
			{/* <DateCounter /> */}
			<Header />

			<Main>
				<p>1/15</p>
				<p>Question?</p>
			</Main>
		</div>
	);
}

export default App;
