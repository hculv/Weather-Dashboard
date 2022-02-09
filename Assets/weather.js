//Open Weather API Key
var apiKey = "e4c61a0f80124daed67ca37703daba93";

var cityFormEl = $('#city-form');
var cityListEl = $('#city-list');

var weekDay = moment().format("ddd MMM Do, YYYY");
$(".headline").append(weekDay);


// Adds City Searches 
var searchResults = function handleFormSubmit(event) {
  event.preventDefault();

  var citySearch = $('input[name="city-input"]').val();

  var cityListItemEl = $(
    '<li class="flex-row justify-space-between align-center p-2 bg-light text-dark">'
  );

  cityListItemEl.append(
    '<button class="btn" id="previousSearch">' + citySearch + '</button>'
  );

  cityListEl.append(cityListItemEl);

  $('input[name="city-input"]').val('');
            

      // Variable for current weather working 
      var urlToday = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&Appid=" + apiKey + "&units=imperial";
      // Variable for 5 day forecast working
      var urlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&Appid=" + apiKey + "&units=imperial";


      $.ajax ({               // Get weather for current day
        url: urlToday,
        method: "GET"
        }).then(function(response) {

            $("#cityName").text(response.name);
            $("#temp").text("Temperature: " + response.main.temp);
            $("#wind").text("Wind Speed: " + response.wind.speed);
            $("#humidity").text("Humidity: " + response.main.humidity + "%" );
            $("#weatherIcon").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            $.ajax({
              url: urlUV,
              method: "GET"
          }).then(function (response) {
    
              $("#uvIndex").text("UV Index: " + response.value);

              if (response.value > 7) {
                $("#uvIndex").addClass("hot");
              } 
              if (7 < response.value < 5 ) {
                $("#uvIndex").addClass("orange");
              }
              if (response.value < 5 ) {
                $("#uvIndex").addClass("green");
              }

              //colors
          });

      });

  
      
            // Get weather for forecast
      $.ajax({
            url: urlForecast,
            method: "GET"
        }).then(function (response) {
          var day = [0, 8, 16, 24, 32];

            day.forEach(function (i) {

              var futureTime = new Date(response.list[i].dt * 1000);
              futureTime = futureTime.toLocaleDateString("en-US");
                
              $("#futureWeather").append("<div class=forecastStyled>" + "<p>" + futureTime + "</p>" +
              `<img src= "https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + 
              "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + 
               "<p>" + "Wind Speed: " + response.list[i].wind.speed + "</p>" + 
               "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");



            });
          });
          
          $("#futureWeather").empty();

    


         

          
        }

   



cityFormEl.on('submit', searchResults);

localStorage.setItem("searchResults", JSON.stringify(searchResults));











