import { Effect, Layer } from 'effect';
import { BuildPokeApiUrlTag } from './BuildPokeApiUrl';
import { PokeApiServiceTag } from './PokeApi';
import { PokeApiUrlTag } from './PokeApiUrl';
import { PokemonCollectionTag } from './PokemonCollection';

const MainLayer = Layer.mergeAll(
	PokeApiServiceTag.Live,
	PokemonCollectionTag.Live,
	BuildPokeApiUrlTag.Live.pipe(Layer.provide(PokeApiUrlTag.Live)),
	PokeApiUrlTag.Live,
);

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
