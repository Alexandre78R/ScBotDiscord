//Import des param�tres de connexion
const configKnex = require('../knexfile')

require('knex')(configKnex.development);