cd /smart-contracts

rm -rf node_modules
npm install
npx hardhat clean
npx hardhat compile

npx hardhat node
