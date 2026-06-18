import { Context, Effect, Layer } from 'effect';
import { PokeApiUrlTag } from './PokeApiUrl';

export class BuildPokeApiUrlTag extends Context.Tag('BuildPokeApiUrl')<
	BuildPokeApiUrlTag,
	({ name }: { name: string }) => string
>() {
	static readonly Live = Layer.effect(
		this,
		Effect.gen(function* () {
			const pokeApiUrl = yield* PokeApiUrlTag;
			return BuildPokeApiUrlTag.of(({ name }) => `${pokeApiUrl}/${name}`);
		}),
	);
}
