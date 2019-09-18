'use strict';

const token = '469333c9-62fa-49e6-8520-8e7372e70fcc';
const btn = document.querySelector('.shuffle_button');
const select = document.querySelector('.select_cats');
const radioButtons = document.querySelector('.radio_buttons');
const defaultRadio = document.querySelector('.default_radio');
const firstImg = document.querySelector('.first-image');
const carousel = document.querySelector('.carousel');
const indicators = document.querySelector('.carousel-indicators');
const carouselInner = document.querySelector('.carousel-inner');
const prevArrow = document.querySelector('.carousel-control-prev');
const nextArrow = document.querySelector('.carousel-control-next');
const ENDPOINT = 'https://api.thecatapi.com/v1/images/search?format=json';
const ENDPOINT3 = 'https://api.thecatapi.com/v1/breeds';
const ENDPOINT4 = 'https://api.thecatapi.com/v1/categories';
const breeds = [];
const categories = [];

function getBreeds() {
    fetch( ENDPOINT3, {
        headers: {
          "x-api-key": token,
        }
    })
    .then(response => response.json())
    .then(data => {
        for(let item of data) {
            const info = {
                  name: item.name,
                  id: item.id
            };
            breeds.push(info);
        }
        createOptions(breeds);
    });
}

function getCategories() {
    fetch( ENDPOINT4, {
    headers: {
        "x-api-key": token,
    }
    })
    .then(response => response.json())
    .then(data => {
        for(let item of data) {
            const info = {
                    name: item.name,
                    id: item.id
            };
            categories.push(info);
        }
        createRadioButtons(categories);
    });
    
}

function getCats(endpoint) {
    fetch(endpoint, {
      headers: {
        "x-api-key": token,
      }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        createCarousel(data);
    });
}

function createOptions(array) {
    for(let item of array) {
        const option = document.createElement('option');
        option.classList.add('option');
        const breed = document.createTextNode(item.name);
        option.value= item.id;
        option.appendChild(breed);
        select.appendChild(option);
    }
}

function createRadioButtons(array) {
    defaultRadio.addEventListener('change', handleCheck);
    for(let item of array) {
        const label = document.createElement('label');
        label.classList.add('label');
        const labelText = document.createTextNode(item.name);
        const radio = document.createElement('input');
        radio.classList.add('radio');
        radio.type= 'radio';
        radio.value= item.id;
        radio.setAttribute('name', 'funnyStuff');
        radioButtons.appendChild(label);
        label.appendChild(radio);
        label.appendChild(labelText);
        radio.addEventListener('change', handleCheck);
    }
}

function createCarousel(array) {
    indicators.innerHTML = '';
    carouselInner.innerHTML ='';
   
    const indicatorItem = document.createElement('li');
    indicatorItem.setAttribute('data-target', '#carouselExampleIndicators');
    indicatorItem.setAttribute('data-slide-to', 0);
    indicatorItem.classList.add('active', 'hide', 'first-indicator');
    indicators.appendChild(indicatorItem);

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'active');
    carouselInner.appendChild(carouselItem);
    const image = document.createElement('img');
    image.classList.add('img_item');
    image.src = array[0].url;
    carouselItem.appendChild(image);

    prevArrow.classList.add('hide');
    nextArrow.classList.add('hide');

    if(array.length > 1) {
        const firstIndicator = document.querySelector('.first-indicator');
        firstIndicator.classList.remove('hide');
        for (let i = 1; i<array.length; i ++) {
            const indicatorItem = document.createElement('li');
            indicatorItem.setAttribute('data-target', '#carouselExampleIndicators');
            indicatorItem.setAttribute('data-slide-to', i);
            indicators.appendChild(indicatorItem);
            
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            carouselItem.style.backgroundImage = `url(${array[i].url})`;

            carouselInner.appendChild(carouselItem);
            const image = document.createElement('img');
            image.src = array[i].url;
            image.classList.add('img_item');
            carouselItem.appendChild(image);
        }
        prevArrow.classList.remove('hide');
        nextArrow.classList.remove('hide');
    }
    const allImg = document.querySelectorAll('.img_item');
    if(allImg.length>1) {
        for(let img of allImg) {
            img.setAttribute('alt', `${array[0].breeds[0].name} cat`);
        }
    }else {
        allImg[0].setAttribute('alt', 'ordinary cat');
    }
}

function handleSelect(event) {
    const target = event.currentTarget.value;
    select.value = target;
    const allRadioBtn = document.querySelectorAll('.radio');
    const ENDPOINT2 = `https://api.thecatapi.com/v1/images/search?breed_id=${select.value}&limit=100`;
    if(select.value === 'all') {
        getCats(ENDPOINT);
        for(let item of allRadioBtn) {
            item.disabled = false;
            item.parentElement.classList.remove('disabled');
        }
        btn.classList.remove('hide');
    }else {
        getCats(ENDPOINT2); 
        for(let item of allRadioBtn) {
            item.disabled = true;
            item.parentElement.classList.add('disabled');
            item.checked= false;
        }
        defaultRadio.checked = true;
        btn.classList.add('hide');
    }
}

function getMoreCats() {
    const ENDPOINT2 = `https://api.thecatapi.com/v1/images/search?breed_id=${select.value}`;
    const allRadioBtn = document.querySelectorAll('.radio');
    if(select.value !== 'all') {
        getCats(ENDPOINT2);
    }else if (!defaultRadio.checked) {
        for (let item of allRadioBtn) {
            if(item.checked) {
                const url = `&category_ids=${item.value}`;
            getCats(ENDPOINT+url);    
            }
        }
    }else {
        getCats(ENDPOINT);
    }
}

function handleCheck(event) {
    const target = event.currentTarget;
        if(target.checked && target.value !== 'all') {
            const url = `&category_ids=${target.value}`;
            getCats(ENDPOINT+url);    
        }else {
            getCats(ENDPOINT);
        }
}

function init() {
    //img.style.backgroundImage = 'url("./cat.gif")';
    getBreeds();
    getCats(ENDPOINT);
    getCategories();
}

init();
select.addEventListener('change', handleSelect);
btn.addEventListener('click', getMoreCats);
