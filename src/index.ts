import { Effect, Layer, ManagedRuntime } from 'effect';
import { PokeApiServiceTag } from './PokeApi';

// if development, use mock layer, otherwise use live layer

const MainLayer = Layer.mergeAll(PokeApiServiceTag.Default);

const PokemonRuntime = ManagedRuntime.make(MainLayer);

export const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApiServiceTag;
	return yield* pokeApi.getPokemon;
});

// const runnable = program.pipe(Effect.provide(MainLayer));

const main = program.pipe(
	Effect.catchTags({
		FetchError: () => Effect.succeed('Fetch error'),
		JsonError: () => Effect.succeed('JSON error'),
		ParseError: () => Effect.succeed('Parse error'),
	}),
);

// Effect.runPromise(main).then(console.log);
PokemonRuntime.runPromise(main).then(console.log);
