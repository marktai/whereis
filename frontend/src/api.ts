export type AnswerType = [number, number];
export type CardType = [string, string, string, string];

export type GameType = {
  id: number,
  clues: null|Array<string>,
  answer: [
    AnswerType,
    AnswerType,
    AnswerType,
    AnswerType,
  ],
  answer_cards: [
    CardType,
    CardType,
    CardType,
    CardType,
  ],
  suggested_num_cards: null|number,
  suggested_possible_cards: null|Array<CardType>,
  created_time: string,
  last_updated_time: string,
};

type GameListResponse = {
  results: Array<GameType>,
};

export async function http<T>(
  request: RequestInfo
): Promise<T> {
  const response: HttpResponse<T> = await fetch(
    request
  );
  return await response.json();
}

export async function get<T>(
  path: string,
  args: RequestInit = { method: "GET" }
): Promise<T> {
  return await http<T>(new Request(path, args));
};

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }
): Promise<T>  {
  return await http<T>(new Request(path, args));
};

export async function put<T>(
  path: string,
  body: any,
  args: RequestInit = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }
): Promise<T> {
  return await http<T>(new Request(path, args));
};

export async function patch<T>(
  path: string,
  body: any,
  args: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }
): Promise<T>  {
  return await http<T>(new Request(path, args));
};

export default class CloverService {
  public static host = 'http://localhost:7080/api';

  public static async getGame(id: number|string): Promise<GameType> {
    return await get<GameType>(`${this.host}/games/${id}`);
  }

  public static async submitClues(id: number|string, clues: Array<string>, suggestedNumCards: number): Promise<GameType> {
    const body = {
      clues: clues,
      suggested_num_cards: suggestedNumCards,
    }

    return await patch<GameType>(`${this.host}/games/${id}`, body);
  }

  public static async getGames(): Promise<Array<GameType>> {
    const gamesResponse = await get<GameListResponse>(`${this.host}/games`);
    var sortedGames = gamesResponse.results.slice();
    sortedGames.sort((a, b) => {
      if (a.last_updated_time === b.last_updated_time) {
        return 0;
      } else if (a.last_updated_time < b.last_updated_time) {
        return 1;
      } else {
        return -1;
      };
    });
    return sortedGames;
  }

  public static async newGame(): Promise<GameType> {
    return await post<GameType>(`${this.host}/games`, {});
  }
}


interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
