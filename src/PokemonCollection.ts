import { Context, type Array as EffectArray, Layer } from 'effect';

export class PokemonCollectionTag extends Context.Tag('PokemonCollection')<
	PokemonCollectionTag,
	EffectArray.NonEmptyArray<string>
>() {
	static readonly Live = Layer.succeed(this, [
		'pikachu',
		'bulsasaur',
		'charmander',
	]);
}
