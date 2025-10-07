import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function ArticlePage() {
	const { pageid } = useParams<{ pageid: string }>();
	const navigate = useNavigate();
	const [currentArticle, setCurrentArticle] = useState<{
		title: string;
		content: string;
		pageid: number;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (pageid) {
			fetchArticle(parseInt(pageid));
		}
	}, [pageid]);

	const fetchArticle = async (id: number) => {
		setError('');
		setIsLoading(true);

		try {
			const url = `https://en.wikipedia.org/w/api.php?format=json&action=parse&pageid=${id}&prop=text&formatversion=2&origin=*`;

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
				setCurrentArticle({ title: data.parse.title, content, pageid: id });
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

			<>
				<div className="flex gap-2 mb-4">
					<Button onClick={() => navigate('/')}>Back to Search</Button>
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
						<h2 className="text-2xl font-bold mb-4">{currentArticle.title}</h2>
						<div
							className="prose dark:prose-invert max-w-none"
							dangerouslySetInnerHTML={{ __html: currentArticle.content }}
						/>
					</div>
				)}
				{isLoading && <p>Loading article...</p>}
				{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
			</>

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

export default ArticlePage;
