'use strict';

module.exports = class BufferWalker {
	/**
	 * @param {Buffer} buffer - instance of Buffer object
	 */
	constructor (buffer) {
		if (buffer instanceof Buffer !== true)
			throw new TypeError('buffer must be an instance of Buffer class');

		this.buffer = buffer;
		this.currentPosition = 0;

		const self = this;

		this.__readInt8 = function () { return self.readInt8(); };
		this.__readUInt8 = function () { return self.readUInt8(); };

		this.__readInt16LE = function () { return self.readInt16LE(); };
		this.__readUInt16LE = function () { return self.readUInt16LE(); };
		this.__readInt32LE = function () { return self.readInt32LE(); };
		this.__readUInt32LE = function () { return self.readUInt32LE(); };
		this.__readInt64LE = function () { return self.readInt64LE(); };
		this.__readUInt64LE = function () { return self.readUInt64LE(); };
		this.__readFloatLE = function () { return self.readFloatLE(); };
		this.__readDoubleLE = function () { return self.readDoubleLE(); };

		this.__readInt16BE = function () { return self.readInt16BE(); };
		this.__readUInt16BE = function () { return self.readUInt16BE(); };
		this.__readInt32BE = function () { return self.readInt32BE(); };
		this.__readUInt32BE = function () { return self.readUInt32BE(); };
		this.__readInt64BE = function () { return self.readInt64BE(); };
		this.__readUInt64BE = function () { return self.readUInt64BE(); };
		this.__readFloatBE = function () { return self.readFloatBE(); };
		this.__readDoubleBE = function () { return self.readDoubleBE(); };
	}

	advance (byteCount) {
		this.setPosition(this.currentPosition + byteCount);
	}

	regress (byteCount) {
		this.setPosition(this.currentPosition - byteCount);
	}

	setPosition (position) {
		if (position < 0 || position > this.buffer.length)
			throw new ValueError('position out of bounds');

		this.currentPosition = position;
	}

	isAtEnd () {
		return this.currentPosition === this.buffer.length;
	}

	goToStart () {
		this.setPosition(0);
	}

	goToEnd () {
		this.setPosition(this.buffer.length);
	}

	ramainingBytes () {
		return this.buffer.length - this.currentPosition;
	}


	readInt8 () {
		const val = this.buffer.readInt8(this.currentPosition);
		this.advance(1);
		return val;
	}

	readUInt8 () {
		const val = this.buffer.readUInt8(this.currentPosition);
		this.advance(1);
		return val;
	}

	readInt16BE () {
		const val = this.buffer.readInt16BE(this.currentPosition);
		this.advance(2);
		return val;
	}

	readUInt16BE () {
		const val = this.buffer.readUInt16BE(this.currentPosition);
		this.advance(2);
		return val;
	}

	readInt16LE () {
		const val = this.buffer.readInt16LE(this.currentPosition);
		this.advance(2);
		return val;
	}

	readUInt16LE () {
		const val = this.buffer.readUInt16LE(this.currentPosition);
		this.advance(2);
		return val;
	}

	readInt32BE () {
		const val = this.buffer.readInt32BE(this.currentPosition);
		this.advance(4);
		return val;
	}

	readUInt32BE () {
		const val = this.buffer.readUInt32BE(this.currentPosition);
		this.advance(4);
		return val;
	}

	readInt32LE () {
		const val = this.buffer.readInt32LE(this.currentPosition);
		this.advance(4);
		return val;
	}

	readUInt32LE () {
		const val = this.buffer.readUInt32LE(this.currentPosition);
		this.advance(4);
		return val;
	}

	/**
	 * JS does not support 64 bit integers,
	 * only 6 (last) bytes are read,
	 * walker advances by 8.
	 */
	readInt64BE () {
		const val = this.buffer.readIntBE(this.currentPosition + 2, 6);
		this.advance(8);
		return val;
	}

	/**
	 * JS does not support 64 bit integers,
	 * only 6 (last) bytes are read,
	 * walker advances by 8.
	 */
	readUInt64BE () {
		const val = this.buffer.readUIntBE(this.currentPosition + 2, 6);
		this.advance(8);
		return val;
	}

	/**
	 * JS does not support 64 bit integers,
	 * only 6 (first) bytes are read,
	 * walker advances by 8.
	 */
	readInt64LE () {
		const val = this.buffer.readIntLE(this.currentPosition, 6);
		this.advance(8);
		return val;
	}

	/**
	 * JS does not support 64 bit integers,
	 * only 6 (first) bytes are read,
	 * walker advances by 8.
	 */
	readUInt64LE () {
		const val = this.buffer.readUIntLE(this.currentPosition, 6);
		this.advance(8);
		return val;
	}

	readFloatBE () {
		const val = this.buffer.readFloatBE(this.currentPosition);
		this.advance(4);
		return val;
	}

	readFloatLE () {
		const val = this.buffer.readFloatLE(this.currentPosition);
		this.advance(4);
		return val;
	}

	readDoubleBE () {
		const val = this.buffer.readDoubleBE(this.currentPosition);
		this.advance(8);
		return val;
	}

	readDoubleLE () {
		const val = this.buffer.readDoubleLE(this.currentPosition);
		this.advance(8);
		return val;
	}

	_readArray (count, method) {
		const result = [];

		for (let q = 0; q < count; ++q)
			result.push(method());

		return result;
	}

	readArrayInt8 (count) {
		return this._readArray(count, this.__readInt8);
	}

	readArrayUInt8 (count) {
		return this._readArray(count, this.__readUInt8);
	}

	readArrayInt16 (count) {
		return this._readArray(count, this.__readInt16);
	}

	readArrayUInt16 (count) {
		return this._readArray(count, this.__readUInt16);
	}

	readArrayInt32 (count) {
		return this._readArray(count, this.__readInt32);
	}

	readArrayUInt32 (count) {
		return this._readArray(count, this.__readUInt32);
	}

	readArrayInt64 (count) {
		return this._readArray(count, this.__readInt64);
	}

	readArrayUInt64 (count) {
		return this._readArray(count, this.__readUInt64);
	}

	readArrayFloat (count) {
		return this._readArray(count, this.__readFloat);
	}

	readArrayDouble (count) {
		return this._readArray(count, this.__readDouble);
	}




	writeInt8 (val) {
		this.buffer.writeInt8(val, this.currentPosition);
		this.advance(1);
	}

	writeUInt8 (val) {
		this.buffer.writeUInt8(val, this.currentPosition);
		this.advance(1);
	}

	writeInt16BE (val) {
		this.buffer.writeInt16BE(val, this.currentPosition);
		this.advance(2);
	}

	writeUInt16BE (val) {
		this.buffer.writeUInt16BE(val, this.currentPosition);
		this.advance(2);
	}

	writeInt32BE (val) {
		this.buffer.writeInt32BE(val, this.currentPosition);
		this.advance(4);
	}

	writeUInt32BE (val) {
		this.buffer.writeUInt32BE(val, this.currentPosition);
		this.advance(4);
	}

	writeInt64BE (val) {
		this.buffer.writeIntBE(val, this.currentPosition + 2, 6);
		this.advance(8);
	}

	writeUInt64BE (val) {
		this.buffer.writeUIntBE(val, this.currentPosition + 2, 6);
		this.advance(8);
	}

	writeFloatBE (val) {
		this.buffer.writeFloatBE(val, this.currentPosition);
		this.advance(4);
	}

	writeDoubleBE (val) {
		this.buffer.writeDoubleBE(val, this.currentPosition);
		this.advance(8);
	}


	writeInt16LE (val) {
		this.buffer.writeInt16LE(val, this.currentPosition);
		this.advance(2);
	}

	writeUInt16LE (val) {
		this.buffer.writeUInt16LE(val, this.currentPosition);
		this.advance(2);
	}

	writeInt32LE (val) {
		this.buffer.writeInt32LE(val, this.currentPosition);
		this.advance(4);
	}

	writeUInt32LE (val) {
		this.buffer.writeUInt32LE(val, this.currentPosition);
		this.advance(4);
	}

	writeInt64LE (val) {
		this.buffer.writeIntLE(val, this.currentPosition, 6);
		this.advance(8);
	}

	writeUInt64LE (val) {
		this.buffer.writeUIntLE(val, this.currentPosition, 6);
		this.advance(8);
	}

	writeFloatLE (val) {
		this.buffer.writeFloatLE(val, this.currentPosition);
		this.advance(4);
	}

	writeDoubleLE (val) {
		this.buffer.writeDoubleLE(val, this.currentPosition);
		this.advance(8);
	}

}
