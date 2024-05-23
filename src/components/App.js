// import DateCounter from "./DateCounter";

// WE CAN CREATE A FAKE SERVER BU USING AN NPM PACKAGE JSON-SERVER


import Header from "./Header";
import Error from "./Error";
import Loader from "./Loader";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../context/QuizContext";



function App() {
	// used a useReducer hook to create a state to store all the questions that we fetch from our fake API
	const {status} = useQuiz();
	return (
		<div className='app'>
			{/* <DateCounter /> */}
			<Header />

			<Main>
				{status === "loading" && <Loader />}

				{status === "error" && <Error />}

				{status === "ready" && (
					<StartScreen />
				)}

				{status === "active" && (
					<>
						<Progress />

						<Question />

						<Footer>
							<Timer />

							<NextButton />
						</Footer>
					</>
				)}

				{status === "finished" && (
					<FinishScreen />
				)}
			</Main>
		</div>
	);
}

export default App;
