import React, { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

const Timer = () => {
	const {dispatch, secondsRemaining} = useQuiz();

    const mins = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

	useEffect(() => {
		const id = setInterval(() => {
			// console.log("tick");
            dispatch({type: "tick"});
		}, 1000);

        return () => clearInterval(id);
	}, [dispatch]);

	return <div className='timer'> {mins < 10 && "0"}{mins}:{seconds < 10 && "0"}{seconds}</div>;
};

export default Timer;
