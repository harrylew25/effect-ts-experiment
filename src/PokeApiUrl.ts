import { Config, Context, Effect, Layer } from 'effect';

export class PokeApiUrlTag extends Context.Tag('PokeApiUrl')<
	PokeApiUrlTag,
	string
>() {
	static readonly Live = Layer.effect(
		this,
		Effect.gen(function* () {
			const baseUrl = yield* Config.string('BASE_URL');
			return PokeApiUrlTag.of(`${baseUrl}/api/v2/pokemon`);
		}),
	);
}
