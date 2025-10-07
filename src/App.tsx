import {
	Routes,
	Route,
} from 'react-router-dom';
import SearchPage from './pages/search';
import ArticlePage from './pages/article';

function App() {
	return (
		<Routes>
			<Route path="/" element={<SearchPage />} />
			<Route path="/article/:pageid" element={<ArticlePage />} />
		</Routes>
	);
}

export default App;
