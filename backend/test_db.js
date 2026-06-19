const { sequelize } = require('./src/models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Success');
  } catch (err) {
    console.error('Failure:', err);
  }
}
test();
