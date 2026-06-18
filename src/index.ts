import { Effect } from 'effect';
import { PokeApiLive, PokeApiTag } from './PokeApi';

const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApiTag;
	return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(Effect.provideService(PokeApiTag, PokeApiLive));

const main = runnable.pipe(
	Effect.catchTags({
		FetchError: () => Effect.succeed('Fetch error'),
		JsonError: () => Effect.succeed('JSON error'),
		ParseError: () => Effect.succeed('Parse error'),
	}),
);

Effect.runPromise(main).then(console.log);
