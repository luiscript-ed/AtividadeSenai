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
  const url = 'http://127.0.0.1:8000/categorias';

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
  const url = 'http://127.0.0.1:8000/produtos';

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

async function exibirCategorias() {

  const listaCategorias = document.getElementById("lista-categorias");
  const respostaDaApi = await pegarCategorias();
  
  const dados = respostaDaApi.categorias || []; 

  const htmlCategorias = dados.map(categoria => {
    return `
          <div class="categoria">
            <img src="imagens/categorias/${categoria}.png" alt="${categoria}" />
            <span> ${categoria} </span>
          </div>
    `;
  }).join('');

  listaCategorias.innerHTML = htmlCategorias;
}

async function exibirUltimasUnidades() {

  const listaProdutos = document.getElementById("lista-produtos");
  const respostaApi = await pegarUltimasUnidades(); 

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.estoque <= 13)
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += Math.floor(Math.random() * (200 - 50 + 1)) + 50
      return `
        <div class="product">
          <img
            src="imagens/produtos/${produto.imagem}"
            alt="${produto.nome}"
          />
          <div class="product-info">
            <span>${produto.nome}</span>
            <h3>${produto.descricao}</h3>
            <strong> <strong class="bad-price"> R$ ${preco.toFixed(2).replace('.', ',')} </strong> <strong class="good-price"> R$ ${produto.preco.toFixed(2).replace('.', ',')} </strong> </strong>
          </div>
        </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}


exibirCategorias();
exibirUltimasUnidades();