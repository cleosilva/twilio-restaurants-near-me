const axios = require("axios");

exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();

  if (!event.Latitude || !event.Longitude) {
    twiml.message(
      "Se você deseja encontrar algum restaurante, por favor envie a localização."
    );
    callback(null, twiml);
  } else {
    const location = {
      lat: event.Latitude,
      lon: event.Longitude,
    };

    const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat}%2C${location.lon}&radius=1500&type=restaurant&keyword=restaurant&key=${context.GOOGLE_MAPS_API_KEY}`;
    axios
      .get(URL, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        const restaurants = response.data.results;

        restaurants.forEach((restaurant) => {
          twiml.message(
            `${restaurant.name} - ${restaurant.vicinity} - Avaliação: ${restaurant.rating}`
          );
        });

        callback(null, twiml);
      });
  }
};
