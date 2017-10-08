export class TvItem = {
	id: number,
	title: string,
	poster: string,
	first_air_date: string,
	number_of_seasons: number,
	number_of_episodes: number,
	overview: string,
	status: string,
	seasons:Array<any>,
	creators:Array<any>,
}