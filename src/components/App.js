// import DateCounter from "./DateCounter";

// WE CAN CREATE A FAKE SERVER BU USING AN NPM PACKAGE JSON-SERVER

import { useEffect, useReducer } from "react";
import Header from "./Header";
import Error from "./Error";
import Loader from "./Loader";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
	index: 0
};

const reducer = (state, action) => {
	switch (action.type) {
		case "dataReceived":
			return {
				...state,
				questions: action.payload,
				status: "ready",
			};

		case "start":
			return { ...state, status: "active" };

		case "dataFailed":
			return {
				...state,
				status: "error",
			};

		default:
			throw new Error("Action Unknown");
	}
};

function App() {
	// used a useReducer hook to create a state to store all the questions that we fetch from our fake API
	const [{ questions, status, index }, dispatch] = useReducer(reducer, initialState);

	const numQuestions = questions.length;

	useEffect(() => {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataReceived", payload: data }))
			.catch((err) => dispatch({ type: "dataFailed" }));
	}, []);

	return (
		<div className='app'>
			{/* <DateCounter /> */}
			<Header />

			<Main>
				{status === "loading" && <Loader />}

				{status === "error" && <Error />}

				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}

				{status === "active" && <Question question={questions.at(index)} />}
			</Main>
		</div>
	);
}

export default App;
