import {Chain, Ex, Pure} from './step'

export interface Eff<S extends Ex, R, E, A> {}

export type Execution<S extends Ex, SS extends Ex> = S extends 'async' ? 'async' : SS extends 'async' ? 'async' : 'sync'

export type Sync<R, E, A>  = Eff<'sync', R, E, A>
export type Async<R, E, A> = Eff<'async', R, E, A>
export type Value<A>       = Eff<'sync', unknown, never, A>

export const of = <A>(a: A): Sync<unknown, never, A> => (new Pure(a) as any as Sync<unknown, never, A>)

export const chain = <SS extends Ex, RR, EE, A, B>(f: (a: A) => Eff<SS, RR, EE, B>) => <S extends Ex, R, E>(ra: Eff<S, R, E, A>): Eff<Execution<S, SS>, R & RR, E | EE, B> =>
  (new Chain(ra, f) as any as Eff<Execution<S, SS>, R & RR, E | EE, B>)









