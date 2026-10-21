# gerenciamento de API, vou ver se fao só com request, pra rodar localmente numa porta

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import json

app = FastAPI(
    title="PEAK POINT",
    description="API do sistema de vendas PP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

#Funcoes auxiliares

def pegarCategorias():
    with open("backend/bancos/produtos.json", "r", encoding="utf-8") as file:
        categorias = json.load(file)

    categolias = []
    for i in range(len(categorias)):
        categoria = categorias[i]["categoria"]
        if categoria not in categolias:
            categolias.append(categoria)

    return categolias

def verificar_produto(produto_name, quantidade):
    with open("backend/bancos/produtos.json", "r", encoding="utf-8") as file:
        produtos = json.load(file)

    for produto in range(len(produtos)):
        if produtos[produto]["nome"] == produto_name:
            if produtos[produto]["estoque"] >= quantidade:
                return produtos[produto]["preco"]
            
    return None

#Funcoes GET da API

@app.get("/")
def mensagemBoasVindas():
    return {"message": "Bem-vindo à API do PEAK POINT!"}

@app.get("/categorias")
def get_categorias():
    try:
        categorias = pegarCategorias()
        return {"categorias": categorias}
    except Exception as e:
        return {"message": f"Ocorreu um erro: {str(e)}"}

@app.get("/produtos")
def get_produtos():
    try:
        with open("backend/bancos/produtos.json", "r", encoding="utf-8") as file:
            produtos = json.load(file)

        return {"produtos": produtos}
    except Exception as e:
        return {"message": f"Ocorreu um erro: {str(e)}"}


#Funcoes POST da API

@app.post("/login")
async def post_login(request: Request):
    try:
        data = await request.json()
        email = data.get("email")
        senha = data.get("senha")

        with open("backend/bancos/users.json", "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        if email in usuarios and usuarios[email]["senha"] == senha:
            return {"usuario": usuarios[email]}
        else:
            return {"message": "Usuário não encontrado ou senha incorreta"}
    
    except Exception as e:
        return {"message": f"Ocorreu um erro: {str(e)}"}



@app.post("/cadastro")
async def post_usuario(request: Request):
    try:
        data = await request.json()
        email = data.get("email")
        nome = data.get("nome")
        senha = data.get("senha")

        if not email or not nome or not senha:
            return {"message": "Preencha todos os campos"}

        with open("backend/bancos/users.json", "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        if email in usuarios:
            return {"message": "Este e-mail já está cadastrado"}

        usuarios[email] = {
            "nome": nome,
            "senha": senha,
            "points": 0
        }

        with open("backend/bancos/users.json", "w", encoding="utf-8") as file:
            json.dump(usuarios, file, indent=4, ensure_ascii=False)

        return {"message": "Usuário criado com sucesso!"}

    except Exception as e:
        print("Erro no cadastro:", e)
        return {"message": f"Ocorreu um erro: {str(e)}"}

@app.post("/comprar")
async def post_comprar(request: Request):
    try:
        data = await request.json()
        email = data.get("email")
        senha = data.get("senha")
        produto_id = data.get("produto_id")
        quantidade = data.get("quantidade")
    
        with open("backend/bancos/users.json", "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        if email in usuarios and usuarios[email]["senha"] == senha:
            preco = verificar_produto(produto_id, quantidade)
            
            if preco is not None:
                total = preco * quantidade
                if total < usuarios[email]["points"]:
                    usuarios[email]["points"] -= total

                with open("backend/bancos/users.json", "w", encoding="utf-8") as file:
                    json.dump(usuarios, file, indent=4)

                return {"message": f"Compra realizada com sucesso! Total: {total}"}
            else:
                return {"message": "Produto não encontrado, estoque insuficiente ou pontos insuficientes"}

        else:
            return {"message": "Usuário não encontrado ou senha incorreta"}
    except Exception as e:
        return {"message": f"Ocorreu um erro: {str(e)}"}
