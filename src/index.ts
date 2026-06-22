import { Effect, Layer } from 'effect';
import { PokeApiServiceTag } from './PokeApi';

// if development, use mock layer, otherwise use live layer

const MainLayer = Layer.mergeAll(PokeApiServiceTag.Mock);

const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApiServiceTag;
	return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(Effect.provide(MainLayer));

const main = runnable.pipe(
	Effect.catchTags({
		FetchError: () => Effect.succeed('Fetch error'),
		JsonError: () => Effect.succeed('JSON error'),
		ParseError: () => Effect.succeed('Parse error'),
	}),
);

Effect.runPromise(main).then(console.log);
