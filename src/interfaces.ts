import { QueryResult } from "pg";
import { string } from "pg-format";

export interface IMoviesRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface IMoviesResponse extends IMoviesRequest {
  id: string;
}

export type TQueryGetMoviesResult = QueryResult<IMoviesResponse>;
