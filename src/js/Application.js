import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading= document.getElementsByClassName("progress")[0];


    const box = document.createElement("div");
    box.classList.add("box");
    // box.innerHTML = this._render({
    //   name: "Placeholder",
    //   terrain: "placeholder",
    //   population: 0,
    // });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }
  async _load(){
    this._startLoading();
    let responce = await Promise.all([
      fetch('https://swapi.boom.dev/api/planets').then((response) => response.json()),
      fetch('https://swapi.boom.dev/api/planets?page=2').then((response) => response.json()),
      fetch('https://swapi.boom.dev/api/planets?page=3').then((response) => response.json()),
      fetch('https://swapi.boom.dev/api/planets?page=4').then((response) => response.json()),
      fetch('https://swapi.boom.dev/api/planets?page=5').then((response) => response.json()),
      fetch('https://swapi.boom.dev/api/planets?page=6').then((response) => response.json())
    ]);
   
    this._stopLoading();
    return responce;
  }

async _create(){
  
  const planets = await this._load();
  const main = document.querySelector(".box");
  planets.forEach(planet => {
    planet.results.forEach(item =>{
      const name= item.name;
      const terrain= item.terrain;
      const population= item.population;
      main.insertAdjacentHTML("beforeend", this._render({name, terrain, population}));
    })
  });
  
}


_startLoading(){
  let loader = new Application();
  loader._loading.style.display="block";  
}

_stopLoading(){
  let loader = new Application();
  loader._loading.style.display="none";  
}

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}

let x = new Application();
x._create();