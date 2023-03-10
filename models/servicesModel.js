const fs = require('fs').promises;
const path = require('path');
const servicesPath = path.join(__dirname, '../public', 'sponsors.json');

const listServices = async () => {
  const data = await fs.readFile(servicesPath);
  return JSON.parse(data);
};

module.exports = listServices;
