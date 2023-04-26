
const request = require('request');
 


const callExternalApiUsingRequest = (usr_input,callback) => {
    _EXTERNAL_URL = `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?search_term=${usr_input}`;
    request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
    if (err) { 
        return callback(err);
     }
    return callback(body);
    });
}

module.exports.callApi = callExternalApiUsingRequest;
