// importamos Timeago y su metodo 'format'
const {format} = require('timeago.js');
// creamos objeto llamado helpers
const helpers = {};
//guarda la fecha de mysql y lo convierte en formato tipo 'publicado hace .. minutos' o 'hace.. dias'
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;