# Hardhat Boilerplate
## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/crespoep/hardhat-react-starter-kit.git
cd hardhat-react-starter-kit
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

> Note: There's [an issue in `ganache-core`](https://github.com/trufflesuite/ganache-core/issues/650) that can make the `npm install` step fail. 
>
> If you see `npm ERR! code ENOLOCAL`, try running `npm ci` instead of `npm install`.

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://hardhat.org/tutorial).

- [Writing and compiling contracts](https://hardhat.org/tutorial/writing-and-compiling-contracts/)
- [Setting up the environment](https://hardhat.org/tutorial/setting-up-the-environment/)
- [Testing Contracts](https://hardhat.org/tutorial/testing-contracts/)
- [Setting up Metamask](https://hardhat.org/tutorial/hackathon-boilerplate-project.html#how-to-use-it)
- [Hardhat's full documentation](https://hardhat.org/getting-started/)

For a complete introduction to Hardhat, refer to [this guide](https://hardhat.org/getting-started/#overview).

## What’s Included?

Your environment will have everything you need to build a Dapp powered by Hardhat and React.

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/v5/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.
- [A sample frontend/Dapp](./frontend): A Dapp which uses [Create React App](https://github.com/facebook/create-react-app).

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.

## Feedback, help and news

We'd love to have your feedback on this tutorial. Feel free to reach us through
this repository or [our Discord server](https://invite.gg/HardhatSupport).

Also you can [follow us on Twitter](https://twitter.com/HardhatHQ).

**Happy _building_!**

/**
* Supported `sportId`
* --------------------
* NCAA Men's Football: 1
* NFL: 2
* MLB: 3
* NBA: 4
* NCAA Men's Basketball: 5
* NHL: 6
* WNBA: 8
* MLS: 10
* EPL: 11
* Ligue 1: 12
* Bundesliga: 13
* La Liga: 14
* Serie A: 15
* UEFA Champions League: 16
  */

/**
* Supported `market`
* --------------------
* create : Create Market
* resolve : Resolve Market
  */

/**
* Supported `statusIds`
* --------------------
* 1 : STATUS_CANCELED
* 2 : STATUS_DELAYED
* 3 : STATUS_END_OF_FIGHT
* 4 : STATUS_END_OF_ROUND
* 5 : STATUS_END_PERIOD
* 6 : STATUS_FIGHTERS_INTRODUCTION
* 7 : STATUS_FIGHTERS_WALKING
* 8 : STATUS_FINAL
* 9 : STATUS_FINAL_PEN
* 10 : STATUS_FIRST_HALF
* 11 : STATUS_FULL_TIME
* 12 : STATUS_HALFTIME
* 13 : STATUS_IN_PROGRESS
* 14 : STATUS_IN_PROGRESS_2
* 15 : STATUS_POSTPONED
* 16 : STATUS_PRE_FIGHT
* 17 : STATUS_RAIN_DELAY
* 18 : STATUS_SCHEDULED
* 19 : STATUS_SECOND_HALF
* 20 : STATUS_TBD
* 21 : STATUS_UNCONTESTED
* 22 : STATUS_ABANDONED
* 23 : STATUS_FORFEIT
  */
