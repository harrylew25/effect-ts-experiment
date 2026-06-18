import { Context, Effect, type ParseResult, Schema } from 'effect';
import type { ConfigError } from 'effect/ConfigError';
import { FetchError, JsonError } from './error';
import { Pokemon } from './schemas';

// Define service interface
export interface PokeApiService {
	readonly getPokemon: Effect.Effect<
		Pokemon,
		FetchError | JsonError | ParseResult.ParseError | ConfigError
	>;
}

// Define context for service
export const PokeApiTag = Context.GenericTag<PokeApiService>('PokeApi');

// Define implementation
export const PokeApiLive = PokeApiTag.of({
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
