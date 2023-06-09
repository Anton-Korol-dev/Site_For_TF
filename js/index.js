const gallery = document.querySelector('.gallery');

// Робота Жмуденка Євгенія
function createCard(year, name, photoLink) {

  const card = document.createElement('div');
  card.classList.add('card');

  const cardImg = document.createElement('div');
  cardImg.classList.add('card-img');

  const filmImg = document.createElement('img');
  filmImg.classList.add('film-img');
  filmImg.src = photoLink;

  cardImg.append(filmImg);
  card.append(cardImg);

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title');
  cardTitle.append(name);
  card.append(cardTitle);

  const cardYear = document.createElement('span');
  cardYear.classList.add('card-year');
  cardYear.append(`year ${year}`);
  card.append(cardYear);

  const cartIcon = document.createElement('ion-icon');
  cartIcon.classList.add('add-cart');
  cartIcon.name = 'heart';
  cartIcon.addEventListener('click',addCart);
  card.append(cartIcon);

  return card;
}

// Робота Короля Антона
function createSection() {
  const section = document.createElement('section');
  section.classList.add('gallery-section');

  const searchBlock = document.createElement('div');
  searchBlock.classList.add('gallery__search-block')
  const sectionTitle = document.createElement('h2');
  sectionTitle.classList.add('gallery-section__title');
  sectionTitle.append("Поиск фильмов");
  searchBlock.append(sectionTitle);

  const input = document.createElement('input');
  input.type = 'search';
  input.classList.add('search');
  input.placeholder = "впишите название";

  input.addEventListener("input", event => {
    const value = event.target.value.toLowerCase();

    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }

    fetch(`http://www.omdbapi.com/?apikey=d8196a7&s=${value}`).then(res => res.json())
    .then(data => Object.entries(data).forEach(entry => {
      const [key, value] = entry;
      if(key === 'Search') {
        value.forEach(
          film => {
            wrapper.append(createCard(film.Year, film.Title, film.Poster));
          }
        )
      }
    }
    ));
  });

  searchBlock.append(input);
  section.append(searchBlock);

  const wrapper = document.createElement('div');
  wrapper.classList.add('gallery-section__wrapper');
  section.append(wrapper);

  gallery.append(section);
  return wrapper;
}


//Отримання данних з API
(function getData() {
  fetch('http://www.omdbapi.com/?apikey=d8196a7&s=fast').then(res => res.json())
    .then(data => Object.entries(data).forEach(entry => {
      const [key, value] = entry;
      if(key === 'Search') {
        const section = createSection();
        value.forEach(
          film => {
            section.append(createCard(film.Year, film.Title, film.Poster));
          }
        )
      }
    }
    ));
})();


const btnCart=document.querySelector('#cart-icon');
const cart=document.querySelector('.cart');
const btnClose=document.querySelector('#cart-close');

btnCart.addEventListener('click',()=>{
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click',()=>{
  cart.classList.remove('cart-active');
});

document.addEventListener('DOMContentLoaded',loadContent);

function loadContent(){
  //Видалення фільму з кошика
  let btnRemove=document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn)=>{
    btn.addEventListener('click',removeItem);
  });

  updateTotal();
}

//Видалення об'єкту
function removeItem(){
  if(confirm('Are Your Sure to Remove')){
    let title=this.parentElement.querySelector('.cart-film-title').innerHTML;
    itemList=itemList.filter(el=>el.title!=title);
    this.parentElement.remove();
    loadContent();
  }
}

let itemList=[];

//Додавання до кошика
function addCart(){
 let film=this.parentElement;
 let title=film.querySelector('.card-title').innerHTML;
 let imgSrc=film.querySelector('.film-img').src;
 
 let newProduct={title,imgSrc}

 //Перевірка на присутність фільму в кошику
 if(itemList.find((el)=>el.title==newProduct.title)){
  alert("Фильм уже в списке");
  return;
 }else{
  itemList.push(newProduct);
 }


let newProductElement= createCartProduct(title,imgSrc);
let element=document.createElement('div');
element.innerHTML=newProductElement;
let cartBasket=document.querySelector('.cart-content');
cartBasket.append(element);
loadContent();
}


function createCartProduct(title,imgSrc){

  return `
  <div class="cart-box">
  <img src="${imgSrc}" class="cart-img">
  <div class="detail-box">
    <div class="cart-film-title">${title}</div>
    </div>
  </div>
  <ion-icon name="trash" class="cart-remove"></ion-icon>
  </div>
  `;
}

function updateTotal()
{
  //Кількість елементів в кошику

  const cartCount=document.querySelector('.cart-count');
  let count=itemList.length;
  cartCount.innerHTML=count;

  if(count<0){
    cartCount.style.display='none';
  }else{
    cartCount.style.display='block';
  }

}
