import { Effect, Data } from 'effect';

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

const main = (pokemonName: string) =>
  fetchRequest(pokemonName).pipe(
    Effect.filterOrFail(
      (response) => response.ok,
      () => new FetchError(),
    ),
    Effect.flatMap(jsonResponse),
    Effect.catchTags({
      FetchError: () => Effect.succeed('Failed to fetch the data.'),
      JsonError: () => Effect.succeed('Failed to parse the JSON.'),
    }),
  );

Effect.runPromise(main('ditto')).then(console.log);
