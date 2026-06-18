import { Context, Effect, Layer, type ParseResult, Schema } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
import { BuildPokeApiUrlTag } from './BuildPokeApiUrl';
import { FetchError, JsonError } from './error';
import { PokemonCollectionTag } from './PokemonCollection';
import { Pokemon } from './schemas';

// Define service interface
export interface PokeApiServiceImpl {
	readonly getPokemon: Effect.Effect<
		Pokemon,
		FetchError | JsonError | ParseResult.ParseError | ConfigError
	>;
}

const make = {
	getPokemon: Effect.gen(function* () {
		const pokemonCollection = yield* PokemonCollectionTag;
		const buildPokeApiUrl = yield* BuildPokeApiUrlTag;

		const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

		const response = yield* Effect.tryPromise({
			try: () => fetch(requestUrl),
			catch: () => new FetchError(),
		});
		if (!response.ok) {
			return yield* new FetchError();
		}
		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: () => new JsonError(),
		});

		return yield* Schema.decodeUnknown(Pokemon)(json);
	}),
};

export class PokeApiServiceTag extends Context.Tag('PokeApiService')<
	PokeApiServiceTag,
	typeof make
>() {
	static readonly Live = Layer.succeed(this, make);
}
