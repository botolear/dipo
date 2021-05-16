import { Context } from './context';
import { Handler } from './handler';

export type DipoEvent<T extends Context, C extends Context = Context> = (
    handler: Handler<T>,
) => Handler<C>;

export function CreateEvent<T extends Context, C extends Context = Context>(
    event: DipoEvent<T, C>,
): DipoEvent<T, C> {
    return event;
}

export function CreateEvents<
    C extends Context,
    T extends { [key: string]: DipoEvent<Context, C> },
>(
    events: {
        [key in keyof T]: DipoEvent<T[key], C>;
    },
): { [key in keyof T]: DipoEvent<T[key], C> } {
    return events;
}

export type ExtractContext<E> = E extends DipoEvent<infer T, any> ? T : never;
export type ExtractContexts<T> = { [P in keyof T]: ExtractContext<T[P]> };
