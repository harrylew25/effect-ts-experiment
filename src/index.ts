import { Data, Effect, Schema } from 'effect';

class FetchError extends Data.TaggedError('FetchError')<{}> {}
class JsonError extends Data.TaggedError('JsonError')<{}> {}
class Pokemon extends Schema.Class<Pokemon>('Pokemon')({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

const decodePokemon = Schema.decode(Pokemon);

const fetchRequest = (pokemon: string) =>
  Effect.tryPromise({
    try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
    catch: () => new FetchError(),
  });

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const program = (pokemonName: string) =>
  Effect.gen(function* () {
    const response = yield* fetchRequest(pokemonName);

    if (!response.ok) {
      return yield* new FetchError();
    }

    const json = yield* jsonResponse(response);
    return yield* decodePokemon(json);
  });

const main = program('ditto').pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed('Fetch error'),
    JsonError: () => Effect.succeed('JSON error'),
    ParseError: () => Effect.succeed('Parse error'),
  }),
);

Effect.runPromise(main).then(console.log);
