import { ConfigProvider, Effect, Layer, ManagedRuntime } from 'effect';
import { expect, it } from 'vitest';
import { PokeApiServiceTag } from '../src/PokeApi';

const TestConfigProvider = ConfigProvider.fromMap(
	new Map([['BASE_URL', 'http://localhost:3000']]),
);

const ConfigProviderLayer = Layer.setConfigProvider(TestConfigProvider);
const MainLayer = PokeApiServiceTag.Default.pipe(
	// Provide the Config Provider layer to PokeApiServiceTag.Live
	Layer.provide(ConfigProviderLayer),
);

const TestingRuntime = ManagedRuntime.make(MainLayer);

const program = Effect.gen(function* () {
	const pokeApi = yield* PokeApiServiceTag;
	return yield* pokeApi.getPokemon;
});

const main = program.pipe(Effect.provide(MainLayer));

it('returns a valid pokemon', async () => {
	const response = await TestingRuntime.runPromise(program);
	expect(response).toEqual({
		id: 1,
		height: 10,
		weight: 10,
		order: 1,
		name: 'bulbasaur',
	});
});
