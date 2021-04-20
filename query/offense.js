//Import des paramètres de connexion
const configKnex = require('../knexfile')

require('knex')(configKnex.development);