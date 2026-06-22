import { Effect } from 'effect';

// export class PokemonCollectionTag extends Context.Tag('PokemonCollection')<
// 	PokemonCollectionTag,
// 	EffectArray.NonEmptyArray<string>
// >() {
// 	static readonly Live = Layer.succeed(this, [
// 		'pikachu',
// 		'bulsasaur',
// 		'charmander',
// 	]);
// }
export class PokemonCollectionTag extends Effect.Service<PokemonCollectionTag>()(
	'PokemonCollection',
	{
		succeed: ['pikachu', 'bulsasaur', 'charmander'],
	},
) {}
