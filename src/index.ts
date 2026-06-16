import { Data, Effect } from 'effect';

class FetchError extends Data.TaggedError('FetchError')<{}> {}

class JsonError extends Data.TaggedError('JsonError')<{}> {}

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

    return yield* jsonResponse(response);
  });

const main = program('ditt').pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed('Fetch error'),
    JsonError: () => Effect.succeed('JSON error'),
  }),
);

Effect.runPromise(main).then(console.log);
