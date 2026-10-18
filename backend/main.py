# gerenciamento de API, vou ver se fao só com request, pra rodar localmente numa porta

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

import json

app = FastAPI(
    title="PEAK POINT",
    description="API do sistema de vendas PP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://luiscript-ed.github.io"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

#Funcoes auxiliares

def pegarCategorias():
    with open("bancos/produtos.json", "r") as file:
        categorias = json.load(file)

    categolias = []
    for i in range(len(categorias)):
        categoria = categorias[i]["categoria"]
        categolias.append(categoria)

    return categolias

def verificar_produto(produto_name, quantidade):
    with open("bancos/produtos.json", "r") as file:
        produtos = json.load(file)

    for produto in range(len(produtos)):
        if produtos[produto]["nome"] == produto_name:
            if produtos[produto]["estoque"] >= quantidade:
                return produtos[produto]["preco"]
            
    return None

#Funcoes GET da API

@app.get("/")
def get_root():
    return {"message": "Bem-vindo à API do PEAK POINT!"}

@app.get("/categorias")
def get_categorias():
    categorias = pegarCategorias()
    return {"categorias": categorias}

@app.get("/produtos")
def get_produtos():
    with open("bancos/produtos.json", "r") as file:
        produtos = json.load(file)

    return {"produtos": produtos}


#Funcoes POST da API

@app.post("/login")
def post_login(request: Request):
    data = request.json()
    email = data.get("email")
    senha = data.get("senha")

    with open("bancos/users.json", "r") as file:
        usuarios = json.load(file)

    if email in usuarios and usuarios[email]["senha"] == senha:
        return {"usuario": usuarios[email]}
    else:
        return {"message": "Usuário não encontrado ou senha incorreta"}


@app.post("/cadastro")
def post_usuario(request: Request):
    data = request.json()
    email = data.get("email")
    nome = data.get("nome")
    senha = data.get("senha")

    with open("bancos/users.json", "r") as file:
        usuarios = json.load(file)

    usuarios[email] = {
        "nome": nome,
        "senha": senha,
        "points": 0
    }

    with open("bancos/users.json", "w") as file:
        json.dump(usuarios, file, indent=4)

    return {"message": "Usuário criado com sucesso!"}

@app.post("/comprar")
def post_comprar(request: Request):
    data = request.json()
    email = data.get("email")
    senha = data.get("senha")
    produto_id = data.get("produto_id")
    quantidade = data.get("quantidade")

    with open("bancos/users.json", "r") as file:
        usuarios = json.load(file)

    if email in usuarios and usuarios[email]["senha"] == senha:
       preco = verificar_produto(produto_id, quantidade)

       if preco is not None and preco < usuarios[email]["points"]:
            total = preco * quantidade
            usuarios[email]["points"] -= total

            with open("bancos/users.json", "w") as file:
                json.dump(usuarios, file, indent=4)

            return {"message": f"Compra realizada com sucesso! Total: {total}"}
       else:
            return {"message": "Produto não encontrado, estoque insuficiente ou pontos insuficientes"}

    else:
        return {"message": "Usuário não encontrado ou senha incorreta"}
