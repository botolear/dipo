export type HandlerReturn = void | Promise<void>;

export type Handler<T = any, R = HandlerReturn> = (
    ctx: T,
    next: () => HandlerReturn,
) => R;
