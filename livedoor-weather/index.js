const axios = require('axios');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const city = req.query.city;
    const callback =  req.query.callback;
    const full = !!req.query.full;

    if (!city || !callback) {
        context.res = {
            status: 400,
            body : "Please set 'city' and 'callback' parameters. Both must be required."
        }
        return;
    }

    try {
        var weatherUrl = `http://weather.livedoor.com/forecast/webservice/json/v1?city=${city}`;
        const response = await axios.get(weatherUrl);

        const result = full ? response.data : response.data.forecasts.map(f => {
            return {
                date: f.date,
                name: f.telop,
                minTemperature: f.temperature.min && f.temperature.min.celsius,
                maxTemperature: f.temperature.max && f.temperature.max.celsius
            };
        });

        context.res = {
            body : `${callback}(${JSON.stringify(result)})`
        };
    } catch (error) {
        console.log(error);

        context.res = {
            status: 500,
            body: error
        }
    }
};