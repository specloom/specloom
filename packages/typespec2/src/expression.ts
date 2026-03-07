export type ExpressionLiteral = string | number | boolean | null;

export type ExpressionAst =
  | { type: "literal"; value: ExpressionLiteral }
  | { type: "identifier"; path: string }
  | {
      type: "comparison";
      operator: "==" | "!=" | ">" | ">=" | "<" | "<=";
      left: ExpressionAst;
      right: ExpressionAst;
    }
  | {
      type: "logical";
      operator: "&&" | "||";
      left: ExpressionAst;
      right: ExpressionAst;
    }
  | { type: "unary"; operator: "!"; operand: ExpressionAst };

type TokenType =
  | "LPAREN"
  | "RPAREN"
  | "AND"
  | "OR"
  | "NOT"
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "IDENT"
  | "STRING"
  | "NUMBER"
  | "TRUE"
  | "FALSE"
  | "NULL"
  | "EOF";

interface Token {
  type: TokenType;
  value?: string;
}

export class ExpressionSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpressionSyntaxError";
  }
}

export function parseExpression(source: string): ExpressionAst {
  return new ExpressionParser(source).parse();
}

class ExpressionParser {
  private readonly tokens: Token[];
  private pos = 0;

  constructor(source: string) {
    this.tokens = tokenize(source);
  }

  parse(): ExpressionAst {
    const expression = this.parseOr();
    this.consume("EOF");
    return expression;
  }

  private parseOr(): ExpressionAst {
    let expression = this.parseAnd();
    while (this.peek().type === "OR") {
      this.consume("OR");
      expression = {
        type: "logical",
        operator: "||",
        left: expression,
        right: this.parseAnd(),
      };
    }
    return expression;
  }

  private parseAnd(): ExpressionAst {
    let expression = this.parseUnary();
    while (this.peek().type === "AND") {
      this.consume("AND");
      expression = {
        type: "logical",
        operator: "&&",
        left: expression,
        right: this.parseUnary(),
      };
    }
    return expression;
  }

  private parseUnary(): ExpressionAst {
    if (this.peek().type === "NOT") {
      this.consume("NOT");
      return {
        type: "unary",
        operator: "!",
        operand: this.parseUnary(),
      };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ExpressionAst {
    const token = this.peek();

    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const expression = this.parseOr();
      this.consume("RPAREN");
      return expression;
    }

    if (
      token.type === "STRING" ||
      token.type === "NUMBER" ||
      token.type === "TRUE" ||
      token.type === "FALSE" ||
      token.type === "NULL"
    ) {
      return this.parseLiteral();
    }

    if (token.type === "IDENT") {
      const left = this.parseIdentifier();
      const next = this.peek();
      if (
        next.type === "EQ" ||
        next.type === "NEQ" ||
        next.type === "GT" ||
        next.type === "GTE" ||
        next.type === "LT" ||
        next.type === "LTE"
      ) {
        this.pos += 1;
        return {
          type: "comparison",
          operator: toOperator(next.type),
          left,
          right: this.parsePrimary(),
        };
      }
      return left;
    }

    throw new ExpressionSyntaxError("Unexpected token");
  }

  private parseIdentifier(): ExpressionAst {
    return {
      type: "identifier",
      path: this.consume("IDENT").value ?? "",
    };
  }

  private parseLiteral(): ExpressionAst {
    const token = this.peek();
    switch (token.type) {
      case "STRING":
        return { type: "literal", value: this.consume("STRING").value ?? "" };
      case "NUMBER":
        return {
          type: "literal",
          value: Number(this.consume("NUMBER").value ?? "0"),
        };
      case "TRUE":
        this.consume("TRUE");
        return { type: "literal", value: true };
      case "FALSE":
        this.consume("FALSE");
        return { type: "literal", value: false };
      case "NULL":
        this.consume("NULL");
        return { type: "literal", value: null };
      default:
        throw new ExpressionSyntaxError("Expected literal");
    }
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? { type: "EOF" };
  }

  private consume(type: TokenType): Token {
    const token = this.tokens[this.pos];
    if (!token || token.type !== type) {
      throw new ExpressionSyntaxError(`Expected token '${type}'`);
    }
    this.pos += 1;
    return token;
  }
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (source.startsWith("&&", index)) {
      tokens.push({ type: "AND" });
      index += 2;
      continue;
    }
    if (source.startsWith("||", index)) {
      tokens.push({ type: "OR" });
      index += 2;
      continue;
    }
    if (source.startsWith("==", index)) {
      tokens.push({ type: "EQ" });
      index += 2;
      continue;
    }
    if (source.startsWith("!=", index)) {
      tokens.push({ type: "NEQ" });
      index += 2;
      continue;
    }
    if (source.startsWith(">=", index)) {
      tokens.push({ type: "GTE" });
      index += 2;
      continue;
    }
    if (source.startsWith("<=", index)) {
      tokens.push({ type: "LTE" });
      index += 2;
      continue;
    }
    if (char === "!") {
      tokens.push({ type: "NOT" });
      index += 1;
      continue;
    }
    if (char === ">") {
      tokens.push({ type: "GT" });
      index += 1;
      continue;
    }
    if (char === "<") {
      tokens.push({ type: "LT" });
      index += 1;
      continue;
    }
    if (char === "(") {
      tokens.push({ type: "LPAREN" });
      index += 1;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "RPAREN" });
      index += 1;
      continue;
    }
    if (char === "'") {
      const { value, nextIndex } = readSingleQuotedString(source, index);
      tokens.push({ type: "STRING", value });
      index = nextIndex;
      continue;
    }

    const numeric = source.slice(index).match(/^-?\d+(?:\.\d+)?/);
    if (numeric) {
      tokens.push({ type: "NUMBER", value: numeric[0] });
      index += numeric[0].length;
      continue;
    }

    const ident = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_.]*/);
    if (ident) {
      switch (ident[0]) {
        case "true":
          tokens.push({ type: "TRUE" });
          break;
        case "false":
          tokens.push({ type: "FALSE" });
          break;
        case "null":
          tokens.push({ type: "NULL" });
          break;
        default:
          tokens.push({ type: "IDENT", value: ident[0] });
      }
      index += ident[0].length;
      continue;
    }

    throw new ExpressionSyntaxError(`Unexpected token '${char}'`);
  }

  tokens.push({ type: "EOF" });
  return tokens;
}

function readSingleQuotedString(
  source: string,
  startIndex: number,
): { value: string; nextIndex: number } {
  let value = "";
  let index = startIndex + 1;

  while (index < source.length) {
    const char = source[index];

    if (char === "\\") {
      if (index + 1 >= source.length) {
        throw new ExpressionSyntaxError("Invalid escape sequence");
      }
      value += source[index + 1];
      index += 2;
      continue;
    }

    if (char === "'") {
      return { value, nextIndex: index + 1 };
    }

    value += char;
    index += 1;
  }

  throw new ExpressionSyntaxError("Unterminated string literal");
}

function toOperator(
  tokenType: "EQ" | "NEQ" | "GT" | "GTE" | "LT" | "LTE",
): "==" | "!=" | ">" | ">=" | "<" | "<=" {
  switch (tokenType) {
    case "EQ":
      return "==";
    case "NEQ":
      return "!=";
    case "GT":
      return ">";
    case "GTE":
      return ">=";
    case "LT":
      return "<";
    case "LTE":
      return "<=";
  }
}
