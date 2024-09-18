import * as crypto from 'crypto';

export async function generateRSAKeyPair() {
	const key = await crypto.webcrypto.subtle.generateKey(
		{
			name: 'RSA-OAEP',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256',
		},
		true,
		['encrypt', 'decrypt'],
	);
	// Export the private key
	const publicKey = await crypto.subtle.exportKey('spki', key.publicKey);
	const publicKeyText = Buffer.from(publicKey).toString('base64');
	return {
		privateKey: key.privateKey,
		publicKey: publicKeyText,
	};
}

export async function encryptDataWithAES(plaintext: string) {
	const clientKey = crypto.getRandomValues(new Uint8Array(32));

	// Tạo IV (Initialization Vector)
	const iv = crypto.getRandomValues(new Uint8Array(16));

	// Tạo khóa từ clientKey
	const key = await crypto.subtle.importKey(
		'raw',
		clientKey,
		{ name: 'AES-CBC' },
		false,
		['encrypt'],
	);

	// Mã hóa dữ liệu
	const encryptedData = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv },
		key,
		new TextEncoder().encode(plaintext),
	);

	return {
		encryptedData: Buffer.from(encryptedData).toString('hex'),
		iv: Buffer.from(iv).toString('hex'),
		clientKey: Buffer.from(clientKey).toString('hex'),
	};
}

export async function decryptDataWithAES(
	encryptedData: string,
	iv: string,
	clientKey: string,
) {
	try {
		// Chuyển đổi dữ liệu từ hex sang ArrayBuffer
		const encryptedBuffer = new Uint8Array(Buffer.from(encryptedData, 'hex'))
			.buffer;
		const ivBuffer = new Uint8Array(Buffer.from(iv, 'hex'));
		const keyBuffer = new Uint8Array(Buffer.from(clientKey, 'hex'));

		// Tạo khóa từ clientKey
		const key = await crypto.subtle.importKey(
			'raw',
			keyBuffer,
			{ name: 'AES-CBC' },
			false,
			['decrypt'],
		);

		// Giải mã dữ liệu
		const decryptedData = await crypto.subtle.decrypt(
			{ name: 'AES-CBC', iv: ivBuffer },
			key,
			encryptedBuffer,
		);

		// Chuyển đổi kết quả giải mã thành chuỗi
		const decoder = new TextDecoder();
		return decoder.decode(decryptedData);
	} catch (error) {
		return error;
	}
}

export async function encryptDataWithRSA(
	plaintext: string,
	publicKeyText: string,
) {
	// Mã hóa dữ liệu

	const binaryDer = Uint8Array.from(atob(publicKeyText), (c) =>
		c.charCodeAt(0),
	).buffer;

	// Import khóa công khai
	const publicKey = await crypto.subtle.importKey(
		'spki',
		binaryDer,
		{
			name: 'RSA-OAEP',
			hash: 'SHA-256',
		},
		true,
		['encrypt'],
	);
	const encryptedData = await crypto.subtle.encrypt(
		{ name: 'RSA-OAEP' },
		publicKey,
		new TextEncoder().encode(plaintext),
	);

	return Buffer.from(encryptedData).toString('hex');
}

export async function decryptDataWithRSA(
	encryptedData: string,
	privateKey?: any,
) {
	// Giải mã dữ liệu
	const decryptedData = await crypto.subtle.decrypt(
		{ name: 'RSA-OAEP' },
		privateKey,
		new Uint8Array(Buffer.from(encryptedData, 'hex')),
	);

	// Chuyển đổi kết quả giải mã thành chuỗi
	const decoder = new TextDecoder();
	return decoder.decode(decryptedData);
}
