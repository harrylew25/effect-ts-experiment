import { Effect } from 'effect';
import { PokeApiServiceTag } from './PokeApi';

const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApiServiceTag;
	return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(
	Effect.provideService(PokeApiServiceTag, PokeApiServiceTag.Live),
);

const main = runnable.pipe(
	Effect.catchTags({
		FetchError: () => Effect.succeed('Fetch error'),
		JsonError: () => Effect.succeed('JSON error'),
		ParseError: () => Effect.succeed('Parse error'),
	}),
);

Effect.runPromise(main).then(console.log);
