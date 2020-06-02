# Decoder

V1.0

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
- type
- intersection
- partial

- for ~union~, ~array~, ~intersection~, ~partial~, ~tuple~, ~record~ always return value that results from decoders, not just value passed by client (DONE)
- go over all testing (DONE)
  - extra test cases (general, not specific) (WIP)
- write comments for public APIs [DONE]
- write documentation [TODO]
- see if possible to hide `__TYPE__` (NOT POSSIBLE)
- performance testing (NOT PRIORITY)
  - rewrite all map / filter / find / reduce to loops for performance
  - remove spread operator and use concat
  - maybe look into memoization?

V1.1 (TBD)

- node support

V1.2 (TBD)

- better error messages for complex types (maybe generated names for unions / intersections?)
- common decoding rules / decoders
- branded?
- recursive?
- date?
- error reporters?
