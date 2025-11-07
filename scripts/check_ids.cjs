const fs = require('fs');
const path = require('path');
const medicinesPath = path.join(__dirname, '..', 'src', 'data', 'medicines.ts');
const detailsPath = path.join(__dirname, '..', 'src', 'data', 'medicineDetails.ts');
const medSrc = fs.readFileSync(medicinesPath, 'utf8');
const detSrc = fs.readFileSync(detailsPath, 'utf8');

function extractIdsFromMedicines(src) {
  const idRegex = /id: ['\"]([^'\"]+)['\"]/g;
  const ids = [];
  let m;
  while ((m = idRegex.exec(src)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function extractKeysFromDetails(src) {
  const keyRegex = /'[^']+'(?=:\s*\{)/g;
  const keys = [];
  let m;
  while ((m = keyRegex.exec(src)) !== null) {
    // strip quotes
    keys.push(m[0].slice(1, -1));
  }
  return keys;
}

const ids = extractIdsFromMedicines(medSrc);
const keys = extractKeysFromDetails(detSrc);

console.log('Medicines IDs:', ids);
console.log('Detail keys:', keys);

const missingDetails = ids.filter(id => !keys.includes(id));
const extraDetails = keys.filter(k => !ids.includes(k));

console.log('Missing details for IDs:', missingDetails);
console.log('Detail keys without medicine:', extraDetails);

if (missingDetails.length===0 && extraDetails.length===0) {
  console.log('All good: every medicine has details and vice versa.');
} else {
  process.exit(1);
}
