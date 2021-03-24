import { Keypair } from './lib/kin-base/keypair'
import { Command, flags } from '@oclif/command'
import { gray, green } from 'kleur'

class KinAddress extends Command {
  static description = 'Generate a key pair for Kin'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    attempts: flags.integer({ char: 'a', description: 'Number of attempts', default: 1000000 }),
    continue: flags.boolean({ char: 'c', description: 'Continue searching after first match', default: false }),
  }

  static args = [{ name: 'terms' }]

  async run() {
    const { args, flags } = this.parse(KinAddress)

    if (!args.terms) {
      const keys = Keypair.randomKeys()
      this.log(`Secret    : ${keys.secret}`)
      this.log(`Public Key: ${keys.publicKey}`)
      return
    }

    const terms: string[] = args.terms.includes(',') ? args.terms.split(',') : [args.terms]
    const attempts: number = flags.attempts

    for (let attempt = 0; attempt < attempts; attempt++) {
      if (attempt % 1000 === 0) {
        this.log(gray(`Attempts ${attempt}/${attempts} for terms: ${terms.join(', ')}`))
      }
      const keys = Keypair.randomKeys()
      const publicKey = keys.publicKey.toLowerCase()
      for (const term of terms) {
        if (publicKey.startsWith(term.toLowerCase())) {
          this.log(`Found a match for ${green(term)} (attempt ${attempt})!`)
          this.log(`Secret    : ${keys.secret}`)
          this.log(`Public Key: ${green(keys.publicKey)}`)
          if (!flags.continue) {
            return true
          }
        }
      }
    }
  }
}

export = KinAddress
