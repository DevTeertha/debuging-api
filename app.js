const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBox = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const errorDisplay = document.getElementById('error-container');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20270153-d7aa3318c94ec8c3970d59de2&q';

// Loading Spinner
const toggleSpinner = (isTrue) =>{
  const spinner = document.getElementById('loading-spinner');

  if(isTrue){
    spinner.classList.remove('d-none');
  }
  else{
    spinner.classList.add('d-none');
  }
}

// show images 
const showImages = (images) => {
  if (images.total == 0) {
    sliderContainer.innerHTML = '';
    imagesArea.style.display = 'none';
    ErrorMessageDisplay();
  }
  else {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.hits.forEach(image => {
      console.log(image);
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = `
      <div class="img-container" onclick=selectItem(event,"${image.webformatURL}")>
        <img class="img-fluid img-thumbnail image" src="${image.webformatURL}" alt="${image.tags}">
          <div id="overlay" class="overlay UnSelected">
          </div>
      </div>
      `;
      gallery.appendChild(div);
    })
    toggleSpinner(false);
  }
}

const getImages = (query) => {
  toggleSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data))
    .catch(err => ErrorMessageDisplay())
}

const ErrorMessageDisplay = () => {
  errorDisplay.className = 'd-block';
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    // element.classList.add('added');
    element.classList.remove('UnSelected');
    element.classList.add('Selected');
    sliders.push(img);
  } else {
    // element.classList.remove('added');
    element.classList.remove('Selected');
    element.classList.add('UnSelected');
    sliders.splice(item, 1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  const duration = document.getElementById('duration').value || 1000;
  if (duration < 1000) {
    alert('Slider Duration Should Be 1000ms.(1000ms means 1 second)');
    return;
  }
  else {
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

    sliderContainer.appendChild(prevNext);
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';

    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//Search By Using Enter Button
searchBox.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});

searchBtn.addEventListener('click', function () {
  errorDisplay.className = 'd-none';
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
