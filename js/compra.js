buttonAba = document.getElementById("buttonAba");
buttonAba.addEventListener('click', function() {
    window.location = "https://luiscript-ed.github.io/AtividadeSenai/compra";
});

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;

  function showSlide(index) {
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });


    const video = slides[0].querySelector("video");

      if (currentIndex === 0) {
        video.play();
      } else {
        video.pause();
      }
    }

  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      showSlide(index);
    });
  });

  
async function pegarCategorias() {
  const url = 'http://localhost:8000/categorias';

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados;
    
  } catch (erro) {
    console.error('Deu red e caiu no catch:', erro);
    return [];
  }
}

async function pegarUltimasUnidades() {
  const url = 'http://localhost:8000/produtos';

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados;
    
  } catch (erro) {
    console.error('Deu red e caiu no catch:', erro);
    return [];
  }
}



// exibir as categorias
function exibirCategorias() {
  listaCategorias = document.getElementById("listaCategorias");
  dados = pegarCategorias();
  const htmlCategorias = dados.map(categoria => {

    return `
          <div class="categoria">
            <img src="imagens/${categoria}.png" alt="${categoria}" />
            <span> ${categoria} </span>
          </div>
    `;
  }).join('');

  listaCategorias.innerHTML = htmlCategorias;
  }

// exibir as ultimas unidades, QUEIMA DE ESTOQUEE
function exibirUltimasUnidades() {
  const listaProdutos = document.getElementById("lista-produtos");
  const dados = pegarUltimasUnidades(); 

  const htmlUltimasUnidades = dados
    .filter(produto => produto.estoque <= 20)
    .map(produto => {
      return `
        <div class="product">
          <img
            src="imagens/produtos/${produto.imagem}.png"
            alt="${produto.nome}"
          />

          <div class="product-info">
            <span>${produto.nome}</span>
            <h3>${produto.descricao}</h3>
            <strong>R$ ${produto.preco.toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>
      `;
    }).join('');
    

  listaProdutos.innerHTML = htmlUltimasUnidades;
}

