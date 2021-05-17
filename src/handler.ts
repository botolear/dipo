import { Context } from './context';

export type HandlerReturn = void | Promise<void>;

export type Handler<T extends Context = Context, R = HandlerReturn> = (
    ctx: T,
    next: () => HandlerReturn,
) => R;
