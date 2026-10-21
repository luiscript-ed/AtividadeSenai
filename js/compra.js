const produtoImagem = document.getElementById("produtoImagem");
const produtoNome = document.getElementById("produtoNome");
const produtoCategoria = document.getElementById("produtoCategoria");
const produtoDescricao = document.getElementById("produtoDescricao");
const produtoEstoque = document.getElementById("produtoEstoque");
const produtoPreco = document.getElementById("produtoPreco");
const categoriaDetalhe = document.getElementById("categoriaDetalhe");
const resumoNome = document.getElementById("resumoNome");
const quantidadeInput = document.getElementById("quantidade");
const subtotal = document.getElementById("subtotal");
const comprarBtn = document.getElementById("comprarBtn");
const mensagem = document.getElementById("mensagem");
const paginaCheckout = "checkout.html";

async function pegarProdutos() {
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

let produtos = [];
let produto = null;
let produtoIndex = 0;

async function iniciarCompra() {
    const dados = await pegarProdutos();

    produtos = dados.produtos || [];

    const parametros = new URLSearchParams(window.location.search);
    produtoIndex = Number(parametros.get("id") || 0);

    if (
        !Number.isInteger(produtoIndex) ||
        produtoIndex < 0 ||
        produtoIndex >= produtos.length
    ) {
        produto = null;
    } else {
        produto = produtos[produtoIndex];
    }

    console.log("Produtos carregados:", produtos);
    console.log("Produto selecionado:", produto);

    mostrarProduto();
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarSubtotal() {
    const quantidade = Number(quantidadeInput.value);
    const quantidadeValida = Number.isInteger(quantidade) && quantidade >= 1;

    if (!produto || !quantidadeValida) {
        subtotal.innerText = formatarPreco(0);
        return;
    }

    subtotal.innerText = formatarPreco(produto.preco * quantidade);
}

function mostrarProduto() {
    if (!produto) {
        produtoNome.innerText = "Produto não encontrado";
        mensagem.innerText = "Verifique o endereço ou volte ao catálogo.";
        comprarBtn.disabled = true;
        quantidadeInput.disabled = true;
        document.getElementById("diminuirQuantidade").disabled = true;
        document.getElementById("aumentarQuantidade").disabled = true;
        return;
    }

    document.title = "PEAK POINT | " + produto.nome;
    produtoImagem.src = "imagens/produtos/" + produto.imagem;
    produtoImagem.alt = produto.nome;
    produtoNome.innerText = produto.nome;
    resumoNome.innerText = produto.nome;
    produtoCategoria.innerText = produto.categoria;
    categoriaDetalhe.innerText = produto.categoria;
    produtoDescricao.innerText = produto.descricao;
    produtoPreco.innerText = formatarPreco(produto.preco);

    if (produto.estoque > 0) {
        produtoEstoque.innerText = produto.estoque + (produto.estoque === 1 ? " unidade disponível" : " unidades disponíveis");
        quantidadeInput.max = produto.estoque;
    } else {
        produtoEstoque.innerText = "Indisponível";
        mensagem.innerText = "Este produto está sem estoque.";
        comprarBtn.disabled = true;
        quantidadeInput.disabled = true;
        document.getElementById("diminuirQuantidade").disabled = true;
        document.getElementById("aumentarQuantidade").disabled = true;
    }

    atualizarSubtotal();
}

async function pegarCredenciais() {
    email = localStorage.getItem("email") || "false";
    senha = localStorage.getItem("senha") || "false";

    if (email === "false" || senha === "false") {
        mensagem.innerText = "Você precisa estar logado para realizar a compra.";
        return;
    }
    
    dados = {
        email: email,
        senha: senha,
        produto_id: produto.nome,
        quantidade: quantidade
    }
    try {
        const resposta = await fetch("http://127.0.0.1:8000/comprar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro ao realizar o cadastro:", resultado.detail || resultado.mensagem || "Não foi possível realizar o cadastro.");
            return;
        }

        mensagem.innerText = resultado.mensagem || "Compra realizada com sucesso!";
    } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
    }
}

document.getElementById("diminuirQuantidade").addEventListener("click", function () {
    const quantidadeAtual = Number(quantidadeInput.value) || 1;

    if (quantidadeAtual > 1) {
        quantidadeInput.value = quantidadeAtual - 1;
        mensagem.innerText = "";
        atualizarSubtotal();
    }
});

document.getElementById("aumentarQuantidade").addEventListener("click", function () {
    if (!produto) {
        return;
    }

    const quantidadeAtual = Number(quantidadeInput.value) || 1;

    if (quantidadeAtual < produto.estoque) {
        quantidadeInput.value = quantidadeAtual + 1;
        mensagem.innerText = "";
        atualizarSubtotal();
    } else {
        mensagem.innerText = "Você atingiu o limite disponível em estoque.";
    }
});

quantidadeInput.addEventListener("change", function () {
    if (!produto) {
        return;
    }

    let quantidade = Number(quantidadeInput.value);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        quantidade = 1;
    }

    if (quantidade > produto.estoque) {
        quantidade = produto.estoque;
        mensagem.innerText = "A quantidade foi ajustada ao estoque disponível.";
    } else {
        mensagem.innerText = "";
    }

    quantidadeInput.value = quantidade;
    atualizarSubtotal();
});

comprarBtn.addEventListener("click", function () {
    if (!produto) {
        mensagem.innerText = "Não foi possível encontrar este produto.";
        return;
    }

    const quantidade = Number(quantidadeInput.value);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        mensagem.innerText = "Selecione uma quantidade válida.";
        return;
    }

    if (quantidade > produto.estoque) {
        mensagem.innerText = "A quantidade escolhida é maior que o estoque disponível.";
        return;
    }

    pegarCredenciais(produto.nome, quantidade);

});

iniciarCompra();
