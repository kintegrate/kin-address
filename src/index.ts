import { Keypair } from './lib/kin-base/keypair'
import { Command, flags } from '@oclif/command'

class KinAddress extends Command {
  static description = 'Generate a key pair for Kin'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    attempts: flags.integer({ char: 'a', description: 'Number of attempts', default: 1000000 }),
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'terms' }]

  async run() {
    const { args, flags } = this.parse(KinAddress)

    if (args.terms) {
      const terms: string[] = args.terms.includes(',') ? args.terms.split(',') : [args.terms]
      const attempts: number = flags.attempts

      for (let attempt = 0; attempt < attempts; attempt++) {
        if (attempt % 1000 === 0) {
          this.log(`Attempts ${attempt} for terms: ${terms.join(', ')}`)
        }
        const keys = Keypair.randomKeys()
        const publicKey = keys.publicKey.toLowerCase()
        for (const term of terms) {
          if (publicKey.startsWith(term.toLowerCase())) {
            this.log(`Found a match for ${term} (attempt ${attempt})!`)
            this.log(`Secret    : ${keys.secret}`)
            this.log(`Public Key: ${keys.publicKey}`)
            return true
          }
        }
      }
    } else {
      const keys = Keypair.randomKeys()
      this.log(`Secret    : ${keys.secret}`)
      this.log(`Public Key: ${keys.publicKey}`)
    }
  }
}

export = KinAddress
