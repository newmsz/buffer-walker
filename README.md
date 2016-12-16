# BufferWalker

Wrapper around Buffer object keeping track of current position during reading from or writing to it.

## Example
```js
const BufferWalker = require('buffer-walker');

const buffer = Buffer.alloc(8);
const walker = new BufferWalker(buffer);

walker.writeInt32BE(1);
walker.writeInt32BE(2);

console.log(buffer);

walker.goToStart();

console.log(walker.readInt32BE());
console.log(walker.readInt32BE());
```

# Tests
```sh
mocha
```
