# DIPO

## Simple Composite controller

## Example:
```typescript
class ContextTG extends Context {
    id: number = 0;
    text?: string;
    photo?: string;
}

type ContextText = MakeRequired<ContextTG, 'text'>;
type ContextPhoto = MakeRequired<ContextTG, 'text'>;
type ContextAll = MakeRequired<ContextTG, 'text' | 'photo'>;
let y: ContextText;

let DefaultEvents = {
    all: CreateEvent<ContextAll, ContextTG>((handler) => (ctx, next) => {
        if ('text' in ctx && 'photo' in ctx) {
            return handler(ctx as ContextAll, next);
        }
        return next();
    }),
    text: CreateEvent<ContextText, ContextTG>((handler) => (ctx, next) => {
        if ('text' in ctx) {
            return handler(ctx as ContextText, next);
        }
        return next();
    }),
    photo: CreateEvent<ContextPhoto, ContextTG>((handler) => (ctx, next) => {
        if ('photo' in ctx) {
            return handler(ctx as ContextPhoto, next);
        }
        return next();
    })
};

let dipo = new Dipo<ExtractContexts<typeof DefaultEvents>, ContextTG>(DefaultEvents);
dipo.on('all', (ctx, next) => {
    console.log(3, ctx);
    return next();
});
dipo.on('text', (ctx, next) => {
    console.log(1, ctx);
    return next();
});
dipo.on('photo', (ctx, next) => {
    console.log(2, ctx);
});
dipo.use((ctx) => {
    console.log(4, ctx);
})

let ctx = new ContextTG();
ctx.photo = '1';
ctx.text = '1';
dipo.handle(ctx)
```