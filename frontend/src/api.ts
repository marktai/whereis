type Answer = [number, number];
type Card = [string, string, string, string];

interface Board {
  id: number,
  clues: null|Array<string>,
  answer: [
    Answer,
    Answer,
    Answer,
    Answer,
  ],
  answer_cards: [
    Card,
    Card,
    Card,
    Card,
  ],
  suggested_num_cards: null|number,
  suggested_possible_cards: null|Array<Card>,
  created_time: string,
  last_updated_time: string,
}

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

  public static async getGame(id: number): Promise<Board> {
    return await get<Board>(`${this.host}/games/${id}`);
  }

  public static async submitClues(id: number, clues: Array<string>, suggestedNumCards: number): Promise<Board> {
    const body = {
      clues: clues,
      suggested_num_cards: suggestedNumCards,
    }

    return await patch<Board>(`${this.host}/games/${id}`, body);
  }

  public static async getGames(): Promise<Array<Board>> {
    return await get<Board[]>(`${this.host}/games`);
  }
}


interface HttpResponse<T> extends Response {
  parsedBody?: T;
}
