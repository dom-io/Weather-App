export function initialPageLoadHome() {
  //   use variables to manipulate DOM and push correct data
  // function to keep track of date (maybe time too?)

  const skyCdtn = document.querySelector('.sky-condition');
  const cityName = document.querySelector('.city-name');
  const todaysTemp = document.querySelector('.todays-temp');
  const switchDisplay = document.querySelector('.switch-display');
  const todaysIcon = document.querySelector('.today-icon');
  const input = document.querySelector('.input');
  const btn = document.querySelector('.btn');

  const feelsTemp = document.querySelector('.feels-like-temp');
  const humidPerc = document.querySelector('.humidity-percent');
  const rainPerc = document.querySelector('.rain-percent');
  const windSpd = document.querySelector('.wind-mph');

  const days = document.querySelector('.days');
  const tempHigh = document.querySelector('.temps-high');
  const tempLow = document.querySelector('.temps-low');
  const daysIcon = document.querySelector('.days-icon');

  const weekArr = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const iconArr = [
    {
      id: 'Clear',
      icon: '☀',
    },
    {
      id: 'Clouds',
      icon: '☁',
    },
    {
      id: 'Thunderstorm',
      icon: '⛈',
    },
    {
      id: 'Drizzle' || 'Rain',
      icon: '🌧',
    },
    {
      id: 'Snow',
      icon: '🌨',
    },
  ];

  let units = 'imperial';
  let unitsSymbol = ' °F';

  getLatLon((input.value = 'Los Angeles'));
  input.value = '';

  switchDisplay.addEventListener('click', () => {
    changeSystem();
  });

  btn.addEventListener('click', () => {
    let upperCity = input.value;
    upperCity = upperCity
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    getLatLon();
    cityName.textContent = upperCity;
    input.value = '';
    tempHigh.innerHTML = '';
    tempLow.innerHTML = '';
  });

  //  function that assists the fetched API in metric if clicked, defualt is set to imperial
  function changeSystem() {
    if (switchDisplay.textContent === 'Display °C') {
      switchDisplay.textContent = 'Display °F';
      units = 'metric';
      unitsSymbol = ' °C';
    } else if (switchDisplay.textContent === 'Display °F') {
      switchDisplay.textContent = 'Display °C';
      units = 'imperial';
      unitsSymbol = ' °F';
    }
  }

  // fuction to use Geocoding API to turn city name into lat & lon, also fetches the temperature data for a city
  async function getLatLon() {
    try {
      let apiGeocode = input.value;
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${apiGeocode}&limit=1&appid=a076bbd3431e60199dc9307dc6564bb1`
      );
      const data = await response.json();

      const lat = data[0].lat;
      const lon = data[0].lon;

      const response2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a076bbd3431e60199dc9307dc6564bb1&units=${units}`,
        {
          mode: 'cors',
        }
      );
      const data2 = await response2.json();

      // left side of page
      skyCdtn.textContent = data2.list[0].weather[0].main;
      todaysTemp.textContent =
        Math.trunc(data2.list[0].main.temp) + `${unitsSymbol}`;

      // right side of page
      feelsTemp.textContent =
        Math.trunc(data2.list[0].main.feels_like) + `${unitsSymbol}`;
      humidPerc.textContent = data2.list[0].main.humidity + ' %';
      windSpd.textContent = data2.list[0].wind.speed + ' mph';

      // bottom of page
      for (let i = 0; i < 40; i += 8) {
        // const dayDiv = document.createElement('div');
        // dayDiv.textContent =
        const highDiv = document.createElement('div');
        highDiv.textContent =
          Math.trunc(data2.list[i].main.temp_max) + ` ${unitsSymbol}`;
        tempHigh.appendChild(highDiv);

        const lowDiv = document.createElement('div');
        lowDiv.textContent =
          Math.trunc(data2.list[i].main.temp_min) + ` ${unitsSymbol}`;
        tempLow.appendChild(lowDiv);

        // const iconDiv = document.createElement('div');
        // // days.appendChild(dayDiv);
        // tempLow.appendChild(lowDiv);
        // daysIcon.appendChild(iconDiv);
      }
    } catch (error) {
      cityName.textContent = 'Los Angeles';
      alert('Please enter in the correct name of a city.');
    }
  }
}
