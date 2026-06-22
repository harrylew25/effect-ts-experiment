import { Effect, type ParseResult, Schema } from 'effect';
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

// 'make' implementation
// const make = Effect.gen(function* () {
// 	const pokemonCollection = yield* PokemonCollectionTag;
// 	const buildPokeApiUrl = yield* BuildPokeApiUrlTag;

// 	return {
// 		getPokemon: Effect.gen(function* () {
// 			const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

// 			const response = yield* Effect.tryPromise({
// 				try: () => fetch(requestUrl),
// 				catch: () => new FetchError(),
// 			});
// 			if (!response.ok) {
// 				return yield* new FetchError();
// 			}
// 			const json = yield* Effect.tryPromise({
// 				try: () => response.json(),
// 				catch: () => new JsonError(),
// 			});

// 			return yield* Schema.decodeUnknown(Pokemon)(json);
// 		}),
// 	};
// });

// context.tag class for the service definition
// export class PokeApiServiceTag extends Context.Tag('PokeApiService')<
// 	PokeApiServiceTag,
// 	Effect.Effect.Success<typeof make>
// >() {
// 	// live layer inside the service class as a static attribute
// 	static readonly Live = Layer.effect(this, make).pipe(
// 		Layer.provide(
// 			Layer.mergeAll(PokemonCollectionTag.Live, BuildPokeApiUrlTag.Live),
// 		),
// 	);

// 	static readonly Mock = Layer.succeed(
// 		this,
// 		PokeApiServiceTag.of({
// 			getPokemon: Effect.succeed({
// 				id: 1,
// 				height: 10,
// 				weight: 10,
// 				name: 'bulbasaur',
// 				order: 1,
// 			}),
// 		}),
// 	);
// }

export class PokeApiServiceTag extends Effect.Service<PokeApiServiceImpl>()(
	'PokeApiService',
	{
		effect: Effect.gen(function* () {
			const pokemonCollection = yield* PokemonCollectionTag;
			const buildPokeApiUrl = yield* BuildPokeApiUrlTag;

			return {
				getPokemon: Effect.gen(function* () {
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
		}),
		dependencies: [PokemonCollectionTag.Default, BuildPokeApiUrlTag.Default],
	},
) {}
