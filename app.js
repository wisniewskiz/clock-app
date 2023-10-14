// GET QUOTE
const quoteText = document.querySelector(".quote__body--text");
const quoteAuthor = document.querySelector(".quote__footer");

const loadQuote = async () => {
  const res = await fetch("https://api.quotable.io/random");
  const quote = await res.json();
  quoteText.innerText = quote.content;
  quoteAuthor.innerText = quote.author;
};

loadQuote();

// GET CITY 
const cityText = document.querySelector(".main__footer--city");
const loadCity = async () => {
  const getCoords = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const lat = getCoords.coords.latitude;
  const long = getCoords.coords.longitude;

  const res = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`
  );
  const data = await res.json();
  cityText.innerText = `${data.address.city}, ${data.address.country_code}`;

};

loadCity();

// GET TIME
const timeText = document.querySelector('.main__body--time');
const greetingText = document.querySelector('.main__heading--greeting');
const zoneAbrText = document.querySelector('.main__body--zone');
const timezoneText = document.getElementById('#timezone');
const dayYearText = document.getElementById('dayofyear');
const dayWeekText = document.getElementById('dayofweek');
const weekNumText = document.getElementById('weeknumber');
let isMorning;
const getTime = async () => {
    const date = new Date(Date());
    let hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours <= 12) {
        isMorning = true;
        greetingText.innerText = "good morning";
    } else {
        isMorning = false;
        greetingText.innerText = "good evening";
    };
    timeText.innerText = `${hours}:${minutes}`;

    let timeRegion = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timezoneText.innerText = timeRegion;
    const res = await fetch(`http://worldtimeapi.org/api/timezone/${timeRegion}`);
    const data = await res.json();
    zoneAbrText.innerText = data.abbreviation;
    dayYearText.innerText = data.day_of_year;
    dayWeekText.innerText = data.day_of_week;
    weekNumText.innerText = data.week_number;
};

getTime();