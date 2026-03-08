import data from "./mock-data.json";

type Row = Record<string, unknown>;

export const mockData: Record<string, Row[]> = data as Record<string, Row[]>;
