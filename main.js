
const apiKey = '258219781a2a401698f173258230102';


//Получаем элементы на странице
const header = document.querySelector('.header');
const form = document.querySelector('.form');
const inputCity = document.querySelector('.input');



//Слушаем Submit инпута
form.onsubmit = async function (e) {
  e.preventDefault() //отменяем отправку формы
  let city = inputCity.value.trim(); //берем значение из инпута и обрезаем пробелы

  //Делаем запрос на сервер

  async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  };
  const data = await getWeather(city);


  if (data.error) {
    removeCard();
    showError(data.error.message);
  } else {
    removeCard();

    //Запрос данных для выбора языка
    const response = await fetch('condition.json');
    const multiData = await response.json();
    console.log(multiData);

    const multiDataObj = multiData.find(function (obj) {
      if (obj.code === data.current.condition.code) {
        return true;
      }
    })
    console.log(multiDataObj);




    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? multiDataObj.languages[23]['day_text']
        : multiDataObj.languages[23]['night_text'],
      img: data.current.condition.icon

    }
    showCard(weatherData);
  }
}


//Показать новую карточку
function showCard({ name, country, temp, condition, img }) {
  const html = `<section class="card">
  <div class="card__town">${name}<span class="card__town-reduct">${country}</span></div>
  <div class="card__weather-info">
  <div class="card__value">${temp}<sup>°c</sup></div>
  <div class="card__country">
  <img src="${img}" alt="Icon">
  </div>
  </div>
  <div class="card-weather-status">${condition}</div>
  </section>`
  header.insertAdjacentHTML('afterend', html);
  inputCity.value = ""
};

//Удаление предыдущей карточки
function removeCard() {
  const prevCard = document.querySelector('.card');
  if (prevCard) prevCard.remove();
};

//Удаление предыдущей карточки
function showError(errorMessage) {
  const html = `<section class="card card__error">${errorMessage}</section>`;
  header.insertAdjacentHTML('afterend', html);
}; 
