// import DateCounter from "./DateCounter";

// WE CAN CREATE A FAKE SERVER BU USING AN NPM PACKAGE JSON-SERVER

import { useEffect, useReducer } from "react";
import Header from "./Header";
import Error from "./Error";
import Loader from "./Loader";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
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
			return {
				...state,
				status: "active",
			};

		case "dataFailed":
			return {
				...state,
				status: "error",
			};

		case "newAnswer":
			// Here, we are getting the current question
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,

				// Adding new points if the answer is correct with the correctOption of the current question
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};

		case "nextQuestion":
			return {
				...state,
				index: state.index + 1,
				answer: null
			};

		default:
			throw new Error("Action Unknown");
	}
};

function App() {
	// used a useReducer hook to create a state to store all the questions that we fetch from our fake API
	const [{ questions, status, index, answer }, dispatch] = useReducer(
		reducer,
		initialState
	);

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
					<StartScreen
						numQuestions={numQuestions}
						dispatch={dispatch}
					/>
				)}

				{status === "active" && (
					<>
						<Question
							question={questions.at(index)}
							dispatch={dispatch}
							answer={answer}
						/>

						<NextButton dispatch={dispatch} answer={answer} />
					</>
				)}
			</Main>
		</div>
	);
}

export default App;
