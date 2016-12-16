const expect = require('chai').expect;
const BufferWalker = require('../index.js');

describe('BufferWalker', function(){
	const bufferLE = Buffer.from([
		1, 0, 0, 0, // i32
		2, 0,       // i16
		3, 0,       // i16
		0, 1, 0, 0, // i32
		0, 0, 1, 0, // i32
		0, 0, 0, 1, // i32
		1, 0, 0, 0, 0, 0, 0, 0, // i64
	]);

	const bufferBE = Buffer.from([
		0, 0, 0, 1, // i32
		0, 2,       // i16
		0, 3,       // i16
		0, 0, 1, 0, // i32
		0, 1, 0, 0, // i32
		1, 0, 0, 0, // i32
		0, 0, 0, 0, 0, 0, 0, 1, // i64
	]);

	it('should read LE integers',function(){
		const walker = new BufferWalker(bufferLE);

		expect(walker.readInt32LE()).to.equal(1);
		expect(walker.readInt16LE()).to.equal(2);
		expect(walker.readInt16LE()).to.equal(3);
		expect(walker.readInt32LE()).to.equal(256);
		expect(walker.readInt32LE()).to.equal(65536);
		expect(walker.readInt32LE()).to.equal(16777216);
		expect(walker.readInt64LE()).to.equal(1);
	});

	it('should read BE integers',function(){
		const walker = new BufferWalker(bufferBE);

		expect(walker.readInt32BE()).to.equal(1);
		expect(walker.readInt16BE()).to.equal(2);
		expect(walker.readInt16BE()).to.equal(3);
		expect(walker.readInt32BE()).to.equal(256);
		expect(walker.readInt32BE()).to.equal(65536);
		expect(walker.readInt32BE()).to.equal(16777216);
		expect(walker.readInt64BE()).to.equal(1);
	});

	it('should write LE integers', () =>  {
		const buffer = Buffer.alloc(bufferLE.length);

		const walker = new BufferWalker(buffer);

		walker.writeInt32LE(1);
		walker.writeInt16LE(2);
		walker.writeInt16LE(3);
		walker.writeInt32LE(256);
		walker.writeInt32LE(65536);
		walker.writeInt32LE(16777216);
		walker.writeInt64LE(1);

		expect(bufferLE).to.deep.equal(buffer);
	});

	it('should write BE integers', () =>  {
		const buffer = Buffer.alloc(bufferBE.length);

		const walker = new BufferWalker(buffer);

		walker.writeInt32BE(1);
		walker.writeInt16BE(2);
		walker.writeInt16BE(3);
		walker.writeInt32BE(256);
		walker.writeInt32BE(65536);
		walker.writeInt32BE(16777216);
		walker.writeInt64BE(1);

		expect(bufferBE).to.deep.equal(buffer);
	});
});
