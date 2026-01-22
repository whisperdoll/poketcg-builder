import type { ICard } from "@/resources/cards";

export interface StringToken {
  type: "stringLiteral";
  value: string;
}

export interface NumberToken {
  type: "numericLiteral";
  value: number;
}

export interface FunctionToken {
  type: "function";
  name: string;
  arg?: unknown;
}

export interface ExpressionToken {
  type: "expression";
  chain: Token[];
}

export interface OperatorToken {
  type: "operator";
  operator: "&" | "|";
}

export interface CompoundAssertionToken {
  type: "compoundAssertion";
  predicates?: AssertionToken[];
  assertion: AssertionToken;
}

export interface SelectorToken {
  type: "selector";
  subject: string | null;
  chain: string[];
}

export interface AssertionToken {
  type: "assertion";
  negated: boolean;
  selector: SelectorToken;
  matcher: Constituent;
}

export type Token =
  | SelectorToken
  | StringToken
  | NumberToken
  | FunctionToken
  | ExpressionToken
  | OperatorToken
  | CompoundAssertionToken
  | SelectorToken
  | AssertionToken;

export type Constituent =
  | ExpressionToken
  | CompoundAssertionToken
  | StringToken
  | NumberToken
  | FunctionToken
  | SelectorToken;

export type ParseErrorObject = {
  where: [number, number];
  message?: string;
};
export class ParseError {
  object: ParseErrorObject;

  constructor(object: ParseErrorObject) {
    this.object = object;
  }
}

export class Expression {
  originalExpression: string;
  testResult: RegExpExecArray | null = null;
  cursor: number = 0;
  error?: ParseError;
  level: number;
  cursorOffset: number;

  log(...messages: unknown[]) {
    let indent = "";
    for (let i = 0; i < this.level; i++) {
      indent += "  ";
    }
    console.log(indent, ...messages);
  }

  constructor(expression: string, level = 0, cursorOffset = 0) {
    this.originalExpression = expression.trim();
    this.level = level;
    this.cursorOffset = cursorOffset;
  }

  get expression() {
    return this.originalExpression.substr(this.cursor);
  }

  test(value: RegExp) {
    const passedString = value.toString();

    let newRegex = value;
    if (passedString[0] !== "^") {
      newRegex = new RegExp(
        `^${passedString.substr(1, passedString.length - 2)}`,
      );
    }

    return (this.testResult = newRegex.exec(this.expression));
  }

  optionallyConsume(value: RegExp) {
    this.test(value);
    if (!this.testResult) return this.testResult;
    this.cursor += this.testResult[0].length;
    return this.testResult[0];
  }

  consume(value: RegExp, errorMessage?: string) {
    this.test(value);
    if (!this.testResult) {
      throw new ParseError({
        where: [
          this.cursor + this.cursorOffset,
          this.cursor + this.cursorOffset,
        ],
        message: errorMessage,
      });
    }

    this.cursor += this.testResult[0].length;
    return this.testResult[0];
  }

  consumeLastTest() {
    if (!this.testResult) {
      throw new ParseError({
        where: [
          this.cursor + this.cursorOffset,
          this.cursor + this.cursorOffset,
        ],
        message: "consumeLastTest error",
      });
    }

    this.cursor += this.testResult[0].length;
    return this.testResult[0];
  }

  pop(n = 1) {
    if (this.cursor + n > this.originalExpression.length) {
      throw new ParseError({
        where: [
          this.cursor + this.cursorOffset,
          this.cursor + this.cursorOffset,
        ],
        message: "Expected more",
      });
    }
    const ret = this.originalExpression.substr(this.cursor, n);
    this.cursor += n;
    return ret;
  }

  peek(n = 1) {
    return this.originalExpression.substr(this.cursor, n);
  }

  isDone() {
    this.cursor >= this.originalExpression.length;
  }

  parse(): ExpressionToken {
    this.log("= starting parse expression");
    const chain: Token[] = [];
    while (true) {
      this.optionallyConsume(/\s+/);
      this.log(
        `starting parse constituent. cursor = ${
          this.cursor
        } (${this.expression.substr(0, 5)}...)`,
      );
      const constituent = this.consumeConstituent();
      this.log(
        `finished parse constituent. cursor = ${
          this.cursor
        }, constituent is ${JSON.stringify(constituent)}`,
      );
      chain.push(constituent);
      this.consume(/\s*/);
      if (!this.test(/[&|]/)) break;
      const operator = this.consumeLastTest() as "&" | "|";
      chain.push({ type: "operator", operator });
    }
    return { type: "expression", chain };
  }

  consumeParenthesizedExpression() {
    this.log("starting parse parenthesized expression");
    const startCursor = this.cursor;
    let b = 0;
    while (true) {
      const char = this.pop();
      if (char === "(") {
        b++;
      } else if (char === ")") {
        b--;
        if (b === 0) break;
      }
    }
    const expr = this.originalExpression.substr(
      startCursor + 1,
      this.cursor - startCursor - 2,
    );
    this.log(`[pe] gonna parse ${expr}`);
    const token = new Expression(expr, this.level + 1, this.cursor).parse();
    return token;
    // todo
  }

  consumeExpression() {
    const e = new Expression(
      this.originalExpression.substr(this.cursor),
      this.level + 1,
      this.cursor,
    );
    const parsed = e.parse();
    this.cursor += e.cursor;
    return parsed;
  }

  consumeSelector(): SelectorToken {
    const subject = this.optionallyConsume(/[*$?]/);
    const chain: string[] = [];
    while (true) {
      const dot = this.optionallyConsume(/\./);
      if (!dot) break;
      chain.push(this.consume(/\w+/));
    }
    return { type: "selector", chain, subject };
  }

  consumeConstituent(): Constituent {
    const startCursor = this.cursor;

    if (this.peek() === "(") {
      this.log("> par expression");
      return this.consumeParenthesizedExpression();
    } else if (this.peek() === '"') {
      this.log("> string");
      const string = this.consume(/"[^"]*"/);
      return { type: "stringLiteral", value: string };
    } else if (/[0-9]/.test(this.peek())) {
      this.log("> number");
      const num = this.consume(/[0-9]+/);
      return { type: "numericLiteral", value: parseInt(num) };
    } else if (/[a-z]/.test(this.peek())) {
      this.log("> function");
      const functionName = this.consume(/[a-zA-Z][a-zA-Z0-9]*/);
      let exprToken;
      if (this.peek() === "(") {
        exprToken = this.consumeParenthesizedExpression();
      }
      return { type: "function", name: functionName, arg: exprToken };
    } else if (this.test(/-?[*$?]?[.].+/)) {
      const assertions: AssertionToken[] = [];

      while (true) {
        const first = assertions.length === 0;
        const negated = !!this.optionallyConsume(/-/);
        const selector = this.consumeSelector();

        if (first) {
          if (!this.optionallyConsume(/:/)) {
            this.log("> selector");
            // then its just a selector
            if (negated) {
              throw new ParseError({
                where: [
                  startCursor + this.cursorOffset,
                  startCursor + this.cursorOffset + 1,
                ],
                message: "Unexpected negation",
              });
            }

            return selector;
          } else {
            this.log("> compoundAssertion");
          }
        } else {
          this.consume(/:/);
        }

        const matcher = this.consumeConstituent();
        assertions.push({ type: "assertion", negated, selector, matcher });
        if (!this.optionallyConsume(/::/)) break;
      }

      const predicates =
        assertions.length > 1
          ? assertions.slice(0, assertions.length - 1)
          : undefined;
      const assertion = assertions.at(-1)!;

      return { type: "compoundAssertion", predicates, assertion };
    }

    throw new ParseError({
      where: [startCursor + this.cursorOffset, this.cursor + this.cursorOffset],
      message: "Invalid expression",
    });
  }
}

type EvaluateErrorObject = { token?: Token; message?: string };
class EvaluateError {
  object: EvaluateErrorObject;

  constructor(object: EvaluateErrorObject) {
    this.object = object;
  }
}

interface EvaluateContext {
  testing: ICard;
  cards: ICard[];
}

function evaluateExpression(
  expression: ExpressionToken,
  context: EvaluateContext,
) {
  let cursor = 0;
  const fail = (message?: string, token?: Token) => {
    throw new EvaluateError({ token, message });
  };

  type TokenType = Token["type"];
  type TokenTypeMap = {
    [K in Token as K["type"]]: K;
  };

  function pop<T extends keyof TokenTypeMap>(...types: T[]): TokenTypeMap[T] {
    if (cursor >= expression.chain.length) fail("expected more");
    const node = expression.chain[cursor++];

    if (types.length > 0 && !(types as string[]).includes(node.type))
      fail(`expected to be one of ${types.join(", ")}`, node);

    return node as TokenTypeMap[T];
  }

  function evaluateAssertion(assertion: AssertionToken) {
    // first selector has to be subjectless
    /* types
      - string
      - number
      - list
      - assertion -> boolean
      - compoundAssertion -> boolean
      - selector -> string | number | list
      - some (wraps list)
      - all (wraps list)
      - none (wraps list)
    */
    /*
      <selector>:<string>
        selectorValue === string
      <selector>:<number>
        selectorValue === number
      <selector>:<function>
        function(selectorValue) === true
      <selector>:<function>(...)
        function(selectorValue, ...) === true
      <selector>:<expression> = <selector>:<c1 op1 c2 op2 c3 ...>
        <selector>:<c1> op1 <selector>:<c2> op2 <selector>:<c3>
    */
    /*
      =(selector, c)
      selector: string | number | list
      c: string | number | list | some<typeof selector> | all<typeof selector>

      >(selector, c)
      selector: number
      c: number | some<number> | all<number>
    */
  }

  const { chain } = expression;

  const first = pop("compoundAssertion", "expression");

  if (first.type === "compoundAssertion") {
    // meow
  }

  const operator = pop("operator");
  const next = pop("compoundAssertion", "expression");
}
