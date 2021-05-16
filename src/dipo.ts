import { Context } from './context';
import { DipoEvent } from './event';
import { Handler, HandlerReturn } from './handler';

export class Dipo<E extends { [key: string]: Context }, D extends Context> {
    private handlers: Handler[] = [];

    constructor(
        private events: {
            [P in keyof E]: DipoEvent<E[P], D>;
        },
    ) {}

    addEvent<T extends keyof E>(event: T, handler: DipoEvent<E[T], D>) {
        this.events[event] = handler;
    }

    on<T extends keyof E>(event: T, handler: Handler<E[T]>) {
        this.use(this.events[event](handler));
    }

    use(handler: Handler) {
        this.handlers.push(handler);
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
