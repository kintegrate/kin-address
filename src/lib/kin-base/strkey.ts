// @ts-ignore
import * as base32 from 'base32.js'
// @ts-ignore
import * as crc from 'crc'

const versionBytes: any = {
  ed25519PublicKey: 6 << 3, // G
  ed25519SecretSeed: 18 << 3, // S
  preAuthTx: 19 << 3, // T
  sha256Hash: 23 << 3, // X
}

function calculateChecksum(payload: any) {
  // This code calculates CRC16-XModem checksum of payload
  // and returns it as Buffer in little-endian order.
  const checksum = Buffer.alloc(2)
  checksum.writeUInt16LE(crc.crc16xmodem(payload), 0)
  return checksum
}

export function encodeCheck(versionByteName: string, data: Uint8Array) {
  if (!data) {
    throw new Error('cannot encode null data')
  }

  const versionByte = versionBytes[versionByteName]

  if (typeof versionByte === 'undefined') {
    throw new Error(
      `${versionByteName} is not a valid version byte name.  expected one of "ed25519PublicKey", "ed25519SecretSeed", "preAuthTx", "sha256Hash"`,
    )
  }

  data = Buffer.from(data)
  const versionBuffer = Buffer.from([versionByte])
  const payload = Buffer.concat([versionBuffer, data])
  const checksum = calculateChecksum(payload)
  const unencoded = Buffer.concat([payload, checksum])

  return base32.encode(unencoded)
}

/**
 * Encodes data to strkey ed25519 public key.
 * @param {Buffer} data data to encode
 * @returns {string}
 */
export function encodeEd25519PublicKey(data: Uint8Array) {
  return encodeCheck('ed25519PublicKey', data)
}

/**
 * Encodes data to strkey ed25519 seed.
 * @param {Buffer} data data to encode
 * @returns {string}
 */
export function encodeEd25519SecretSeed(data: Uint8Array) {
  return encodeCheck('ed25519SecretSeed', data)
}
