import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

interface WikipediaPage {
	pageid: number;
	title: string;
	extract: string;
	thumbnail?: {
		source: string;
	};
}

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState<WikipediaPage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [currentView, setCurrentView] = useState<'search' | 'article'>(
		'search'
	);
	const [currentArticle, setCurrentArticle] = useState<{
		title: string;
		content: string;
		pageid: number;
	} | null>(null);

	const searchWikipedia = async () => {
		if (!searchTerm.trim()) {
			setError('Enter something to search for');
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${encodeURIComponent(
				searchTerm
			)}&origin=*`;

			const response = await fetch(url);
			const data = await response.json();

			if (data.query && data.query.pages) {
				setResults(Object.values(data.query.pages));
			} else {
				setResults([]);
			}
		} catch (err) {
			setError('Failed to fetch results');
			console.error('Search error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			searchWikipedia();
		}
	};

	const fetchArticle = async (pageid: number, title: string) => {
		setError('');
		setIsLoading(true);

		try {
			const url = `https://en.wikipedia.org/w/api.php?format=json&action=parse&pageid=${pageid}&prop=text&formatversion=2&origin=*`;

			const response = await fetch(url);
			const data = await response.json();

			if (data.parse && data.parse.text) {
				let content = data.parse.text;
				content = content.replace(
					/href="\/wiki\//g,
					'href="https://en.wikipedia.org/wiki/'
				);
				content = content.replace(
					/<a /g,
					'<a target="_blank" rel="noopener noreferrer" '
				);
				setCurrentArticle({ title, content, pageid });
				setCurrentView('article');
			} else {
				setError('Failed to load article');
			}
		} catch (err) {
			setError('Failed to fetch article');
			console.error('Fetch article error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<header className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-4">
					<small className="text-lg">Q</small>Wikipedia{' '}
					<a
						href="http://en.wikipedia.org/wiki/Special:Random"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block"
					>
						<Badge variant="secondary" className="ml-2">
							Random Page
						</Badge>
					</a>
				</h1>
			</header>

			{currentView === 'search' ? (
				<>
					<Card className="mb-6">
						<CardContent className="p-6">
							<div className="flex gap-2">
								<Input
									type="text"
									placeholder="Search Wikipedia"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									onKeyPress={handleKeyPress}
									className={error ? 'border-red-500' : ''}
								/>
								<Button onClick={searchWikipedia} disabled={isLoading}>
									{isLoading ? 'Searching...' : 'Search'}
								</Button>
							</div>
							{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
						</CardContent>
					</Card>

					<div className="space-y-4">
						{results.map((page) => (
							<Card key={page.pageid} className="py-0">
								<CardContent className="p-4">
									<div className="flex gap-4">
										{page.thumbnail && (
											<div className="flex-shrink-0">
												<img
													src={page.thumbnail.source.replace(/\d+px/, '150px')}
													alt={page.title}
													className="w-20 h-20 object-cover rounded"
												/>
											</div>
										)}
										<div className="flex-1">
											<h4 className="font-semibold text-lg mb-2">
												{page.title}
											</h4>
											<p className="text-gray-600 text-sm mb-2">
												{page.extract}
											</p>
											<Button
												onClick={() => fetchArticle(page.pageid, page.title)}
												disabled={isLoading}
											>
												View Article
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</>
			) : (
				<>
					<div className="flex gap-2 mb-4">
						<Button
							onClick={() => {
								setCurrentView('search');
								setCurrentArticle(null);
							}}
						>
							Back to Search
						</Button>
						{currentArticle && (
							<Button
								variant="outline"
								onClick={() =>
									window.open(
										`https://en.wikipedia.org/?curid=${currentArticle.pageid}`,
										'_blank'
									)
								}
							>
								View on Wikipedia
							</Button>
						)}
					</div>
					{currentArticle && (
						<div className="mt-4">
							<h2 className="text-2xl font-bold mb-4">
								{currentArticle.title}
							</h2>
							<div
								className="prose dark:prose-invert max-w-none"
								dangerouslySetInnerHTML={{ __html: currentArticle.content }}
							/>
						</div>
					)}
					{isLoading && <p>Loading article...</p>}
				</>
			)}

			<footer className="text-center mt-12 pt-8 border-t">
				<a
					href="https://github.com/parsehex/wikipedia-viewer"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
				>
					<img src="res/github.svg" alt="GitHub" className="w-6 h-6" />
					Source code on GitHub
				</a>
			</footer>
		</div>
	);
}

export default App;
