export interface WikipediaPage {
	pageid: number;
	title: string;
	extract: string;
	thumbnail?: {
		source: string;
	};
}