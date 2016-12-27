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

	it('should handle +/- 2^53 64 bit integer values', () =>  {
		const buffer = Buffer.alloc(16);
		const walker = new BufferWalker(buffer);

		walker.writeInt64BE(9007199254740992);
		walker.writeInt64LE(-9007199254740992);

		walker.goToStart();

		expect(walker.readInt64BE()).to.equal(9007199254740992);
		expect(walker.readInt64LE()).to.equal(-9007199254740992);
	});

	it('should accept only instances of Buffer class', () =>  {
		expect(() => {
			new BufferWalker();
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker(null);
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker({});
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker({ x: 1 });
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker([]);
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker([ 0x01, 0x02, 0x03, 0x04 ]);
		}).to.throw(TypeError);

		expect(() => {
			new BufferWalker(Buffer.alloc(4));
		}).not.to.throw(TypeError);
	});

	it('should read LE integers', () =>  {
		const walker = new BufferWalker(bufferLE);

		expect(walker.readInt32LE()).to.equal(1);
		expect(walker.readInt16LE()).to.equal(2);
		expect(walker.readInt16LE()).to.equal(3);
		expect(walker.readInt32LE()).to.equal(256);
		expect(walker.readInt32LE()).to.equal(65536);
		expect(walker.readInt32LE()).to.equal(16777216);
		expect(walker.readInt64LE()).to.equal(1);
	});

	it('should read BE integers', () =>  {
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

	it('should read LE floats', () =>  {
		const buffer = Buffer.from([
			0x8B, 0x94, 0x23, 0x44,
		]); // 654.321

		const walker = new BufferWalker(buffer);

		expect(walker.readFloatLE()).to.be.closeTo(654.321, 0.001);
	});

	it('should read BE floats', () =>  {
		const buffer = Buffer.from([
			0x44, 0x23, 0x94, 0x8B,
		]); // 654.321

		const walker = new BufferWalker(buffer);

		expect(walker.readFloatBE()).to.be.closeTo(654.321, 0.001);
	});

	it('should read LE floats', () =>  {
		const buffer = Buffer.alloc(4);
		const result = Buffer.from([ 0x8B, 0x94, 0x23, 0x44 ]); // 654.321

		const walker = new BufferWalker(buffer);
		walker.writeFloatLE(654.321);

		expect(buffer).to.deep.equal(result);
	});

	it('should read BE floats', () =>  {
		const buffer = Buffer.alloc(4);
		const result = Buffer.from([ 0x44, 0x23, 0x94, 0x8B ]); // 654.321

		const walker = new BufferWalker(buffer);
		walker.writeFloatBE(654.321);

		expect(buffer).to.deep.equal(result);
	});

	it('should read LE doubles',function(){
		const buffer = Buffer.from([
			0x77, 0xBE, 0x9F, 0x1A,
			0x2F, 0xDD, 0x5E, 0x40,
		]); // 123.456

		const walker = new BufferWalker(buffer);

		expect(walker.readDoubleLE()).to.be.closeTo(123.456, 0.001);
	});

	it('should read BE doubles', () =>  {
		const buffer = Buffer.from([
			0x40, 0x5E, 0xDD, 0x2F,
			0x1A, 0x9F, 0xBE, 0x77,
		]); // 123.456

		const walker = new BufferWalker(buffer);

		expect(walker.readDoubleBE()).to.be.closeTo(123.456, 0.001);
	});

	it('should write LE doubles', () =>  {
		const buffer = Buffer.alloc(8);
		const result = Buffer.from([
			0x77, 0xBE, 0x9F, 0x1A,
			0x2F, 0xDD, 0x5E, 0x40,
		]); // 123.456

		const walker = new BufferWalker(buffer);
		walker.writeDoubleLE(123.456);

		expect(buffer).to.deep.equal(result);
	});

	it('should write BE doubles', () =>  {
		const buffer = Buffer.alloc(8);
		const result = Buffer.from([
			0x40, 0x5E, 0xDD, 0x2F,
			0x1A, 0x9F, 0xBE, 0x77,
		]); // 123.456

		const walker = new BufferWalker(buffer);
		walker.writeDoubleBE(123.456);

		expect(buffer).to.deep.equal(result);
	});
});
