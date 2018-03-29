const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

// Cleanup build's artefact
fs.removeSync(buildPath);

// Load and compile the CampaignFactory.sol file
const campaignFactoryPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
// console.log(`[DEBUG] - campaignFactoryPath: \n`, campaignFactoryPath);

const campaignFactorySource = fs.readFileSync(campaignFactoryPath, 'utf8');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');
// console.log(`[DEBUG] - campaignFactorySource: \n`, campaignFactorySource);

const output = solc.compile({
  sources: {
    'Campaign.sol': campaignSource,
    'CampaignFactory.sol': campaignFactorySource
  }
}, 1).contracts;

// console.log(`[DEBUG] - output: \n`, output);

// Save the compile output as .JSON files in build sub directory.
fs.ensureDirSync(buildPath);

const outputKeys = Object.keys(output);

// console.log(`[DEBUG] - outputKeys: \n`, outputKeys);

for (const contract in output) {
  const colonIndex = contract.indexOf(':');
  const fileName = contract.substr(colonIndex+1, contract.length-colonIndex) + '.json';
  const filePath = path.resolve(buildPath, fileName);
  fs.outputJsonSync( filePath, output[contract]);
}