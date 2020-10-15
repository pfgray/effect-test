

// type Step = Pure<any> | Chain<any, any, any, any, any, any, any, any>

import { Eff } from "./eff";

export type Ex = 'sync' | 'async'
export type Exit<E, A> = {type: 'error', value: E} | {type: 'success', value: A}

export type Step<S extends Ex, SS extends Ex, R, RR, E, EE, A, B> =
  | Pure<A>
  | Chain<S, SS, R, RR, E, EE, A, B>;

export class Pure<A> {
  readonly type: 'Pure' = 'Pure';
  constructor(public value: A) {}
}

export class Chain<S extends Ex, SS extends Ex, R, RR, E, EE, A, B> {
  readonly type: 'Chain' = 'Chain';
  constructor(public eff: Eff<S, R, E, A>, public f: (a: A) => Eff<SS, RR, EE, B>) {}
}

class Stack {
  frames: any[]
  constructor() {
    this.frames = []
  }
  eval(a: any) {
    const frame = this.frames.shift()
    return frame(a)
  }
  pushFrame(frame: any) {
    this.frames.unshift(frame)
  }
  isEmpty() {
    return this.frames.length === 0;
  }
}

export function exec<R, E, A>(eff: Eff<'sync', R, E, A>): A {
  return execImpl(eff as any) as any
}

function execImpl<S extends Ex, SS extends Ex, R, RR, E, EE, A, B>(eff: Step<S, SS, R, RR, E, EE, A, B>) {
  const stack = new Stack()
  let current: Step<S, SS, R, RR, E, EE, A, B> = eff
  let ret: any
  while (true) {
    switch (current.type) {
      case 'Pure': {
        if(stack.isEmpty()){
          ret = current.value
        } else {
          current = stack.eval(current.value)
        }
        break;
      }
      case 'Chain': {
        stack.pushFrame(current.f)
        current = current.eff as any
        break;
      }
    }
    if(ret) {
      break;
    }
  }

  return ret

}