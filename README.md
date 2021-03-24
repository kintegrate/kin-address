# kin-address

Generate a Kin Address with option to search a 'vanity address'.

You can generate a new address by running `npx kin-address`. `npx` will install and run the package for you.

If you don't want to wait for `npx` each time you run this command, you can install it globally: `npm -g kin-address`.

## Generate a new address

```shell
$ npx kin-address
Secret    : SBK7...QBR
Public Key: 7PZV...rvo
```

## Search for a comma-separated string as start of the public key

```shell
$ kin-address bee,b33,b3e,be3
Attempts 0/1000000 for terms: bee, b33, b3e, be3
Found a match for b3e (attempt 772)!
Secret    : SA7...SCW
Public Key: B3e...eUR
```

## Continue search after first match

```shell
$ kin-address bee,b33,b3e,be3 -c
Attempts 0/1000000 for terms: bee, b33, b3e, be3
Found a match for b3e (attempt 772)!
Secret    : SA7...SCW
Public Key: B3e...eUR
Attempts 1000/1000000 for terms: bee, b33, b3e, be3
```

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kin-address.svg)](https://npmjs.org/package/kin-address)
[![Downloads/week](https://img.shields.io/npm/dw/kin-address.svg)](https://npmjs.org/package/kin-address)
[![License](https://img.shields.io/npm/l/kin-address.svg)](https://github.com/kintegrate/kin-address/blob/master/package.json)

<!-- toc -->

- [kin-address](#kin-address)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g kin-address
$ kin-address COMMAND
running command...
$ kin-address (-v|--version|version)
kin-address/1.0.1 darwin-x64 node-v14.15.4
$ kin-address --help [COMMAND]
USAGE
  $ kin-address COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

<!-- commandsstop -->
