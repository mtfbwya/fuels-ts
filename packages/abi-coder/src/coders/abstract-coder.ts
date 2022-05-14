import type { BytesLike } from '@ethersproject/bytes';
import { Logger } from '@ethersproject/logger';

const logger = new Logger(process.env.BUILD_VERSION || '~');

type Primitive = string | number | boolean | bigint;

export type Values =
  | Primitive
  | BytesLike
  | Values[]
  | { [key: string]: Values }
  | Record<string, Primitive | BytesLike>;

export type DecodedValue =
  | Primitive
  | DecodedValue[]
  | { [key: string]: DecodedValue }
  | Record<string, Primitive>;

export default abstract class Coder {
  // The coder name:
  //   - address, uint256, tuple, array, etc.
  readonly name: string;

  // The fully expanded type, including composite types:
  //   - address, u16, tuple(address,bytes)
  readonly type: string;

  // The localName bound in the signature, in this example it is "baz":
  //   - tuple(address foo, uint bar) baz
  readonly localName: string;

  constructor(name: string, type: string, localName: string) {
    // @TODO: defineReadOnly these
    this.name = name;
    this.type = type;
    this.localName = localName;
  }

  throwError(message: string, value: unknown): void {
    logger.throwArgumentError(message, this.name, value);
  }

  abstract encode(value: Values, length?: number): Uint8Array;

  abstract decode(data: Uint8Array, offset: number, length?: number): [DecodedValue, number];
}
