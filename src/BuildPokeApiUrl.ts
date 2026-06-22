import { Effect } from 'effect';
import { PokeApiUrlTag } from './PokeApiUrl';

// export class BuildPokeApiUrlTag extends Context.Tag('BuildPokeApiUrl')<
// 	BuildPokeApiUrlTag,
// 	({ name }: { name: string }) => string
// >() {
// 	static readonly Live = Layer.effect(
// 		this,
// 		Effect.gen(function* () {
// 			const pokeApiUrl = yield* PokeApiUrlTag;
// 			// return BuildPokeApiUrlTag.of(({ name }) => `${pokeApiUrl}/${name}`);
// 			return ({ name }) => `${pokeApiUrl}/${name}`;
// 		}),
// 	).pipe(
// 		// 'provide' dependency layers directly inside 'live'
// 		Layer.provide(PokeApiUrlTag.Live),
// 	);
// }

export class BuildPokeApiUrlTag extends Effect.Service<BuildPokeApiUrlTag>()(
	'BuildPokeApiUrl',
	{
		effect: Effect.gen(function* () {
			const pokeApiUrl = yield* PokeApiUrlTag;
			return ({ name }: { name: string }) => `${pokeApiUrl}/${name}`;
		}),
		dependencies: [PokeApiUrlTag.Live],
	},
) {}
