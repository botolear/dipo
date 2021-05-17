import { Context } from './context';
import { DipoEvent } from './event';
import { Handler, HandlerReturn } from './handler';

export class Dipo<E extends { [key: string]: Context }, D extends Context> {
    private handlers: Handler<D>[] = [];

    constructor(
        private events: {
            [P in keyof E]: DipoEvent<E[P], D>;
        },
    ) {}

    addEvent<T extends keyof E>(event: T, handler: DipoEvent<E[T], D>) {
        this.events[event] = handler;
    }

    middleware<T extends Context = Context>(
        handler: Handler<D>,
    ): Dipo<{ [P in keyof E]: T & E[P] }, D> {
        this.handlers.push(handler);
        return this as any as Dipo<{ [P in keyof E]: T & E[P] }, D>;
    }

    on<T extends keyof E>(event: T, handler: Handler<E[T]>): Dipo<E, D> {
        this.use(this.events[event](handler));
        return this;
    }

    use(handler: Handler<D>): Dipo<E, D> {
        this.handlers.push(handler);
        return this;
    }

    handle(context: D) {
        return this.next(context, 0);
    }

    private next(context: D, i: number): HandlerReturn {
        if (i >= this.handlers.length) {
            return;
        }
        return this.handlers[i](context, () =>
            this.next.call(this, context, i + 1),
        );
    }
}
