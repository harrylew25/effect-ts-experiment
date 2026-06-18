import { Config, Context, Effect, type ParseResult, Schema } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
import { FetchError, JsonError } from './error';
import { Pokemon } from './schemas';

// Define service interface
export interface PokeApiServiceImpl {
	readonly getPokemon: Effect.Effect<
		Pokemon,
		FetchError | JsonError | ParseResult.ParseError | ConfigError
	>;
}

export class PokeApiServiceTag extends Context.Tag('PokeApiService')<
	PokeApiServiceTag,
	PokeApiServiceImpl
>() {
	static readonly Live = PokeApiServiceTag.of({
		getPokemon: Effect.gen(function* () {
			const response = yield* Effect.tryPromise({
				try: () => fetch(`https://pokeapi.co/api/v2/pokemon/ditto`),
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
	});
}
