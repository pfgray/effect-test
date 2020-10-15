import { exec, Pure } from "./step";
import { of, chain } from './eff'
import { pipe } from "fp-ts/lib/function";
import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

const wut = pipe(
  of(4),
  chain(n => pipe(of(n + 5), chain(n => of(n + 10)))),
  chain(n => of(n + 5))
)

const doN = (n: number) => {
  const inner = (acc: number, n: number) =>
    n == 0 ? of(acc) : pipe(inner(acc, n - 1), chain(r => r + n))
}

const result = exec(wut)

console.log('got: ', result)


