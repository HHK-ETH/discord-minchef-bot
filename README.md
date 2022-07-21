# Minichef Bot

* Notify if a minichef sushi balance goes under 1000 SUSHI (Notify only one time until refill completed).
* /balance <chain-name | all> => return the sushi balance(s) on the corresponding minichef(s).
* /rewards <chain-name | all> => return the sushi rewards to be claimed on the corresponding minichef(s) (Result might be incorrects).
* /chains => return the chains available for the 2 aboves commands.

## Usage

* ```cp .env.example .env```
* Edit .env content
* ```yarn```
* ```yarn start``` => *Start the bot.*
* ```yarn build``` => *Build js files to /build.*
* ```yarn deploy-commands``` => *Deploy commands in scripts/deploy-commands.ts to the discord API.*