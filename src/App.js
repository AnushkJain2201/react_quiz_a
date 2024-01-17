// import DateCounter from "./DateCounter";

// WE CAN CREATE A FAKE SERVER BU USING AN NPM PACKAGE JSON-SERVER
import Header from "./Header";
import Main from "./Main";

function App() {
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
