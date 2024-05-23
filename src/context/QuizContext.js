import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUE = 30;

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: 10,
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
				secondsRemaining: state.questions.length * SECS_PER_QUE,
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
				status: "ready",
				answer: null,
				points: 0,
				secondsRemaining: null,
			};

		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status:
					state.secondsRemaining === 0 ? "finished" : state.status,
			};

		default:
			throw new Error("Action Unknown");
	}
};

const QuizProvider = ({ children }) => {
	const [
		{
			questions,
			status,
			index,
			answer,
			points,
			highscore,
			secondsRemaining,
		},
		dispatch,
	] = useReducer(reducer, initialState);

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
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highscore,
				secondsRemaining,
				numQuestions,
				maxPossiblePoints,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};

const useQuiz = () => {
	const context = useContext(QuizContext);
	if (context === undefined) {
		throw new Error("useQuiz must be used within a QuizProvider");
	}
	return context;
};

export { QuizProvider, useQuiz };
