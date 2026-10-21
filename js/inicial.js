async function pegarProdutos() {
  const url = 'http://127.0.0.1:8000/produtos';

  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    const dados = await resposta.json();
    exibirUltimasUnidades(dados);
    exibirCalcadosVestuarios(dados);
    exibirAcampamentoTransporte(dados);
    exibirSegurancaOrientacao(dados);
    exibirEscaladaTecnica(dados);
    
  } catch (erro) {
    console.error('Deu red e caiu no catch:', erro);
    return [];
  }
}

async function exibirUltimasUnidades(respostaApi) {

  const listaProdutos = document.getElementById("lista-ultimas");

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.estoque <= 13)
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += Math.floor(Math.random() * (200 - 50 + 1)) + 50
      return `
          <div class="product">
              <a href="compra.html?id=${dados.indexOf(produto)}">
                  <img
                      src="imagens/produtos/${produto.imagem}"
                      alt="${produto.nome}"
                  />
              </a>
              <div class="product-info">
                  <a href="compra.html?id=${dados.indexOf(produto)}">
                      <span>${produto.nome}</span>
                  </a>
                  <h3>${produto.descricao}</h3>
              </div>
          </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}

async function exibirCalcadosVestuarios(respostaApi) {

  const listaProdutos = document.getElementById("lista-calcados-vestuarios");

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.categoria === "calcados_vestuario")
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += 50.0
      return `
          <div class="product">
              <a href="compra.html?id=${dados.indexOf(produto)}">
                  <img
                      src="imagens/produtos/${produto.imagem}"
                      alt="${produto.nome}"
                  />
              </a>
              <div class="product-info">
                  <a href="compra.html?id=${dados.indexOf(produto)}">
                      <span>${produto.nome}</span>
                  </a>
                  <h3>${produto.descricao}</h3>
              </div>
          </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}

async function exibirAcampamentoTransporte(respostaApi) {

  const listaProdutos = document.getElementById("lista-acampamento-transporte");

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.categoria === "acampamento_transporte")
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += 50.0
      return `
          <div class="product">
              <a href="compra.html?id=${dados.indexOf(produto)}">
                  <img
                      src="imagens/produtos/${produto.imagem}"
                      alt="${produto.nome}"
                  />
              </a>
              <div class="product-info">
                  <a href="compra.html?id=${dados.indexOf(produto)}">
                      <span>${produto.nome}</span>
                  </a>
                  <h3>${produto.descricao}</h3>
              </div>
          </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}

async function exibirSegurancaOrientacao(respostaApi) {

  const listaProdutos = document.getElementById("lista-seguranca-orientacao");

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.categoria === "seguranca_orientacao")
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += 50.0
      return `
          <div class="product">
              <a href="compra.html?id=${dados.indexOf(produto)}">
                  <img
                      src="imagens/produtos/${produto.imagem}"
                      alt="${produto.nome}"
                  />
              </a>
              <div class="product-info">
                  <a href="compra.html?id=${dados.indexOf(produto)}">
                      <span>${produto.nome}</span>
                  </a>
                  <h3>${produto.descricao}</h3>
              </div>
          </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}

async function exibirEscaladaTecnica(respostaApi) {

  const listaProdutos = document.getElementById("lista-escalada-tecnica");

  const dados = respostaApi.produtos || respostaApi;

  const htmlUltimasUnidades = dados
    .filter(produto => produto.categoria === "escalada_tecnica")
    .map(produto => {
      preco = parseFloat(produto.preco);
      preco += 50.0
      return `
          <div class="product">
              <a href="compra.html?id=${dados.indexOf(produto)}">
                  <img
                      src="imagens/produtos/${produto.imagem}"
                      alt="${produto.nome}"
                  />
              </a>
              <div class="product-info">
                  <a href="compra.html?id=${dados.indexOf(produto)}">
                      <span>${produto.nome}</span>
                  </a>
                  <h3>${produto.descricao}</h3>
              </div>
          </div>
      `;
    }).join('');
    
  listaProdutos.innerHTML = htmlUltimasUnidades;
}

pegarProdutos();