# Decoder

- string
- boolean
- number
- array
- null
- undefined
- record
- any
- unknown
- object
- union
- tuple
- intersection

- type
- partial

- branded?
- readonly?
- recursive?
- date?
- error reporters?
- rewrite all map / filter / find / reduce to loops for performance

Preferred error format?

```ts
type Error = {
    message: string;
    value: string;
    key?: string;
}

{
    key: Error[],
    key: Error[],
    key: Error[]
}

OR

Error[]
```
