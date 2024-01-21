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
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
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
				answer: null,
			};

		case "finish":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore
						? state.points
						: state.highscore,
			};

		case "restart":
			return {
				...state,
				index: 0,
				status: "active",
				answer: null,
				points: 0
			}
		default:
			throw new Error("Action Unknown");
	}
};

function App() {
	// used a useReducer hook to create a state to store all the questions that we fetch from our fake API
	const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, curr) => prev + curr.points,
		0
	);

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
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPossiblePoints={maxPossiblePoints}
							answer={answer}
						/>

						<Question
							question={questions.at(index)}
							dispatch={dispatch}
							answer={answer}
						/>

						<NextButton
							dispatch={dispatch}
							answer={answer}
							numQuestions={numQuestions}
							index={index}
						/>
					</>
				)}

				{status === "finished" && (
					<FinishScreen
						points={points}
						maxPossiblePoints={maxPossiblePoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
