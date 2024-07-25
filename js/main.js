
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

var closeModal = document.getElementById("closeModal")
var openModal = document.getElementById("openModal")
var novoModal = document.getElementById("novoModal")
const maisDetalhes = document.getElementById("maisDetalhes")
const dialogModal = document.querySelector('dialog')
const contentModal = document.querySelector('.conteudoModal')
const contentFavoritos = document.getElementById('contentFavoritos')
const meusFavoritos = document.getElementById("meusFavoritos")

const maxRecords = 170;
const limit = 16;
let offset = 0;

//Função para tornar o Html dinâmico
 //Atribuindo uma função ao objeto pokeApi
 function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <button class="detailsBtn" data-pokemon="${pokemon.name}" id="openModal">Ver +</button>
                <img src="${pokemon.photo}" 
                    alt="${pokemon.name}">
                </div>
            </li> 
            
        
    `).join('')
        pokemonList.innerHTML += newHtml 
    })
}

loadPokemonItens(offset,limit)

//--- Ao clicar no botão 'load more' altera o offset e o limit para carregar mais pokemons
loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset - limit;
   if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

//variável para guardar os arrays de pokemóns que forem favoritados
let favoritarPokemons = [];

//Adicionando evento ouvidor para identificar os botões e fazer a requisição
pokemonList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('detailsBtn')) {
        const pokemonName = event.target.dataset.pokemon;
        const pokemonData = await fetchPokemonDetails(pokemonName);
        
        const peso = `${pokemonData.weight}`;
        const pesoConvertido =  peso / 10;
        const altura = `${pokemonData.height}`;
        const alturaConvertida =  altura * 10;
        const primeiroTipo =  pokemonData.types[0].type.name;
        const targetId = event.target.id;
        const abilities = `${pokemonData.abilities.name}`
        
        if(validationPokemon(pokemonName)){
            event.target.classList.add('favorited');        
        }
        
        const detailsHtml = `
        <button class="close" id="closeModal"><i class="close fa-solid fa-arrow-left" style="color: #ffffff;"></i></button>
        <button data-pokemon="${pokemonName}" "><i id="favoritarBtn-${pokemonName}" data-pokemon="${pokemonName}" class="favoritar fa-regular fa-heart" style="color: #ffffff;"></i></button>

        <p class="idPokemon">#${pokemonData.id}</p>
        <h2 class="titulo">${pokemonData.name}</h2>
        
        <div class="listaTypes">
        ${pokemonData.types.map((type) => `<li class="typeModal ${type.type.name}">${type.type.name}</li>`).join('')}
        
        </div>
        <div id="capa" class="${primeiroTipo}1">
        <img class="fotoCapa" src = ${pokemonData.sprites.other.home.front_default}>
        </div>
 `;     
 

        maisDetalhes.innerHTML = detailsHtml;

           //Ouvinte de eventos para clique no favoritos
           favoritarPokemons.forEach(pokemonName => {
            const button = document.getElementById(`favoritarBtn-${pokemonName}`);
            if (button) {
                button.classList.add('favorited');
            }
        });

        //Abrir modal para ver mais detalhes do Pokemón
        novoModal.showModal();
        
        //Função para adicionar classe dinâmica e altera a cor do elemento
        const tipoPokemon = `${primeiroTipo}1`
        novoModal.classList.add(tipoPokemon);
        
        const detailsHtml2 = ` <ul class="menu">
        <li><a href="#" class="sobreBtn">Sobre</a></li>
        <li><a href="#" class="habilidadesBtn">Estatísticas</a></li>
        <li><a href="#" class="evolucaoBtn">Evolução</a></li>
        </ul>
        <div id="sobreSection" class="secao">
        <p class="positionHeight"><span class="iconsModal"><img class="iconHeight" src="/images/altura.png" alt=""></span><strong>Altura:</strong> ${alturaConvertida} Cm</p>
        <p class="positionWeight"><span class="iconsModal"><i class="fa-solid fa-weight-hanging"></i></span><strong>Peso:</strong> ${pesoConvertido} Kg</p>
            <div class="abilities">
            <h3>Habilidades</h3>
            <p class="abilitisModal>${pokemonData.abilities.map((ability) => `<p id="">${ability.ability.name}`).join('')}</p>
            </div>
            </div>
            <div id="habilidadesSection" class="secao">
            ${pokemonData.stats.map((stat) => `
                <li class="statsModal">
                    <strong>${stat.stat.name}:</strong> ${stat.base_stat} 
                    <div class="xp-bar" id="xpBar-${stat.stat.name.replace(' ', '-')}-${pokemonData.id}">
                        <div class="xp-progress" id="xpProgress-${stat.stat.name.replace(' ', '-')}-${pokemonData.id}"></div>
                    </div>
                </li>`).join('')}
        </div>
        
        <div id="evolucaoSection" class="secao">
           <ul id="">
           </ul>
            </div>
        `;
        
        contentModal.innerHTML = detailsHtml2;
        
        //Função para mudar as seções e o conteúdo ao clicar no menu
        const sobreBtn = document.querySelector('.sobreBtn');
        const habilidadesBtn = document.querySelector('.habilidadesBtn');
        const evolucaoBtn = document.querySelector('.evolucaoBtn');
        const sobreSection = document.getElementById('sobreSection');
        const habilidadesSection = document.getElementById('habilidadesSection');
        const evolucaoSection = document.getElementById('evolucaoSection');
    
       
        habilidadesSection.classList.add('esconder');
        evolucaoSection.classList.add('esconder');

        sobreBtn.addEventListener('click', function() {
            event.preventDefault();
            mostrarSecao(sobreSection);
            esconderSecoes([habilidadesSection, evolucaoSection]);
        });
    
        habilidadesBtn.addEventListener('click', function() {
            event.preventDefault();
            mostrarSecao(habilidadesSection);
            esconderSecoes([sobreSection, evolucaoSection]);
        });
    
        evolucaoBtn.addEventListener('click', function() {
            event.preventDefault();
            mostrarSecao(evolucaoSection);
            esconderSecoes([sobreSection, habilidadesSection]);
        });
    //-------------------Acaba Aqui-----------------------
    pokemonData.stats.forEach(stat => {
        updateXpBar(stat.stat.name, stat.base_stat, pokemonData.id);
    });

    
    //Função para atualizar barra de experiência do Pokemon
    function updateXpBar(statName, statBase, pokemonId) {
        const xpProgress = document.getElementById(`xpProgress-${statName.replace(' ', '-')}-${pokemonId}`);
        const maxWidth = 100;
        const progressWidth = (statBase / maxWidth) * 100;
        xpProgress.style.width = `${progressWidth}%`;
        xpProgress.classList.add(tipoPokemon);
        xpProgress.style.transition
    }

    //função para mostrar e esconder seção, restante do código acima.
    function mostrarSecao(secao) {
    secao.classList.remove('esconder');
    }

    function esconderSecoes(secoes) {
    secoes.forEach(secao => {
      secao.classList.add('esconder');
        });
    }


//------------------------------------BLOCO DE FAVORITOS--------------------------------------------//

const favoritePokemonList = document.getElementById('favoritePokemonList');

    //Função para verificar se o Pokemón existe na lista de favoritos
    function validationPokemon(pokemonName) {
    return favoritarPokemons.includes(pokemonName);
        } 

    //Adicionando Pokemon a lista de favoritos
     function adicionarPokemonFavorito(pokemonName, button) {
    console.log('adicionando', pokemonName) 
    if (favoritarPokemons.includes(pokemonName)) {
        console.log(`${pokemonName} não está na lista de favoritos. Adicionando...`);
        const listItem = document.createElement("li");
        const pokemonImage = document.createElement('img');
        const buttonTrash = document.createElement('button');
        buttonTrash.setAttribute('id', `buttonTrash-${pokemonName}`);
        console.log(buttonTrash);
        buttonTrash.innerHTML = `<i class="removeTrash ${pokemonName} fa-regular fa-trash-can"></i>`;
        pokemonImage.src = `${pokemonData.sprites.other.home.front_default}`;
        pokemonImage.classList.add('pokemonImage');
        console.log('Elemento criado:', listItem);
        listItem.textContent = pokemonName;
        listItem.classList.add('favoritedList');
        listItem.classList.add(`${pokemonName}`);
        favoritePokemonList.appendChild(listItem);
        listItem.appendChild(pokemonImage);
        listItem.appendChild(buttonTrash);
        listItem.classList.add(`${primeiroTipo}`)

        document.querySelector(`.removeTrash.${pokemonName}`).addEventListener('click', ()=> {
           
            const index = favoritarPokemons.indexOf(pokemonName);
                
            if(listItem){
                favoritarPokemons.splice(index, 1);
                
                 handleClick(pokemonName);
                 console.log(`${pokemonName} removido`)
                 
            }   
            })
        
    } else  {
        console.log(`${pokemonName} já está na lista`)
    }
     }

    console.log(favoritePokemonList);

    

    function handleClick(pokemonName) {
    const listItems = document.querySelectorAll(`.favoritedList.${pokemonName}`);
    const buttonFavorited = document.querySelector('.favoritar');
        listItems.forEach(item => {
            if (item.textContent.trim() === `${pokemonName}`) {
                item.remove(`${pokemonName}`);
                const buttonFavorited = document.querySelector('.favoritar'); // Remove o item da lista
            // Aqui você pode continuar com o restante da lógica, se necessário
        }
    });
    
}


//Função para armazenar favoritos do localStorage

function saveFavoritesToLocalStorage() {
    localStorage.setItem('favoritePokemons', JSON.stringify(favoritarPokemons));
}
const savedFavorites = localStorage.getItem('favoritePokemons');
//Função para recuperar os favoritos do localStorage
function loadFavoritesFromLocalStorage() {
    
    return savedFavorites ? JSON.parse(savedFavorites) : [];
    
   
} 

window.addEventListener('load', ()=> {
    favoritarPokemons = loadFavoritesFromLocalStorage();
})

console.log(loadFavoritesFromLocalStorage());



//Função para adicionar ou remover um Pokemón da lista de favoritos e para trocar cor do botão se o pokemon for favoritado.
 
    function toggleFavorite(pokemonName, button) {
    const index = favoritarPokemons.indexOf(pokemonName);
    
    //se o pokemón não estiver na lista adicionar
        if (index === -1){
            favoritarPokemons.push(pokemonName);
            button.classList.add('favorited');
            adicionarPokemonFavorito(pokemonName);
            console.log(`${pokemonName} adicionado`)
            saveFavoritesToLocalStorage();
            
    } else {
        //se o pokemon estiver na lista removê-lo.
        favoritarPokemons.splice(index, 1);
        button.classList.remove('favorited');
        handleClick(pokemonName);
        saveFavoritesToLocalStorage();
        console.log(`${pokemonName} removido`)
    }
    saveFavoritesToLocalStorage();
 
 }


 //Função para trocar cor do botão se o pokemon for favoritado.

    document.querySelectorAll('.favoritar').forEach(button => {
        button.addEventListener('click', (event) =>{
           
            toggleFavorite(pokemonName, button);
            console.log('pokemonName:', pokemonName);
        });
       });
    



 

const favoritedBtn = document.getElementById(`favoritarBtn-${pokemonName}`);

    //Função para fechar o modal
    novoModal.addEventListener('click', (event) => {
        if (event.target.classList.contains('close')) {
            novoModal.close();
            novoModal.classList.remove(tipoPokemon);
            saveFavoritesToLocalStorage();
        }
    });
    

    }

});
//------------------------Acaba alterações aqui

//Consumir detalhes da Api via url buscando o nome do Pokemón
  async function fetchPokemonDetails(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do Pokémon.');
        }
        const pokemonData = await response.json();
        return pokemonData;
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        return null;
    }
}


function abrirFavoritos(){
    meusFavoritos.showModal();
  }
  
  function fecharFavoritos(){
    meusFavoritos.close();
  }
  
//Criando pesquisa de pokemóns
        const searchButton = document.getElementById('searchButton');
            searchButton.addEventListener('click', () => {
                const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obter o valor digitado pelo usuário e converter para minúsculas
        searchPokemonByName(searchInput); // Chamar a função de pesquisa com o nome digitado
    });

        function searchPokemonByName(name) {
             const pokemonItems = document.querySelectorAll('.pokemon');
             pokemonItems.forEach(pokemon => {
            const pokemonName = pokemon.querySelector('.name').textContent.toLowerCase(); // Obter o nome do Pokémon na lista e converter para minúsculas
                if (pokemonName.includes(name)) { // Verificar se o nome do Pokémon na lista inclui o nome pesquisado
                    pokemon.style.display = 'block'; // Exibir o Pokémon se corresponder
                    loadMoreButton.remove();
                 } else {
                    pokemon.style.display = 'none'; // Ocultar o Pokémon se não corresponder
        }
    });
}