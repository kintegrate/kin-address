import * as bs58 from 'bs58'
import * as nacl from 'tweetnacl'
import { encodeEd25519PublicKey, encodeEd25519SecretSeed } from './strkey'

export class SimpleKeypair {
  secret!: string
  publicKey!: string
}

/**
 * `Keypair` represents public (and secret) keys of the account.
 *
 * Currently `Keypair` only supports ed25519 but in a future this class can be abstraction layer for other
 * public-key signature systems.
 *
 * Use more convenient methods to create `Keypair` object:
 * * `{@link Keypair.fromPublicKey}`
 * * `{@link Keypair.fromSecret}`
 * * `{@link Keypair.random}`
 *
 * @constructor
 * @param {object} keys At least one of keys must be provided.
 * @param {string} keys.type Public-key signature system name. (currently only `ed25519` keys are supported)
 * @param {Buffer} [keys.publicKey] Raw public key
 * @param {Buffer} [keys.secretKey] Raw secret key (32-byte secret seed in ed25519`)
 */
export class Keypair {
  private readonly type: any
  private readonly _secretSeed!: any
  private readonly _secretKey!: Buffer
  private readonly _publicKey!: Buffer

  constructor(keys: any) {
    if (keys.type !== 'ed25519') {
      throw new Error('Invalid keys type')
    }

    this.type = keys.type

    if (keys.secretKey) {
      keys.secretKey = Buffer.from(keys.secretKey)

      if (keys.secretKey.length !== 32) {
        throw new Error('secretKey length is invalid')
      }

      const secretKeyUint8 = new Uint8Array(keys.secretKey)
      const naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8)

      this._secretSeed = keys.secretKey
      this._secretKey = Buffer.from(naclKeys.secretKey)
      this._publicKey = Buffer.from(naclKeys.publicKey)

      if (keys.publicKey && !this._publicKey.equals(Buffer.from(keys.publicKey))) {
        throw new Error('secretKey does not match publicKey')
      }
    } else {
      this._publicKey = Buffer.from(keys.publicKey)

      if (this._publicKey.length !== 32) {
        throw new Error('publicKey length is invalid')
      }
    }
  }

  /**
   * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
   *
   * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
   * @returns {Keypair}
   */
  static fromRawEd25519Seed(rawSeed: Uint8Array) {
    return new this({ type: 'ed25519', secretKey: rawSeed })
  }

  /**
   * Create a random `Keypair` object.
   * @returns {Keypair}
   */
  static random() {
    const secret = nacl.randomBytes(32)

    return this.fromRawEd25519Seed(secret)
  }

  /**
   * Create a random `SimpleKeypair` object.
   * @returns {SimpleKeypair}
   */
  static randomKeys(): SimpleKeypair {
    const keypair = this.random()
    return {
      secret: keypair.secret(),
      publicKey: bs58.encode(keypair._publicKey),
    }
  }

  /**
   * Returns public key associated with this `Keypair` object.
   * @returns {string}
   */
  publicKey(): string {
    return encodeEd25519PublicKey(this._publicKey)
  }

  /**
   * Returns secret key associated with this `Keypair` object
   * @returns {string}
   */
  secret(): string {
    if (!this._secretSeed) {
      throw new Error('no secret key available')
    }

    if (this.type === 'ed25519') {
      return encodeEd25519SecretSeed(this._secretSeed)
    }

    throw new Error('Invalid Keypair type')
  }
}
