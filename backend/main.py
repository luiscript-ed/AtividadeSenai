# gerenciamento de API, vou ver se fao só com request, pra rodar localmente numa porta

from fastapi import FastAPI, HTTPException, Request
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
            # Retorna a estrutura esperada pelo JS
            return {"usuario": usuarios[email]}
        else:
            # Corrigido: Retorna erro 401 (Não autorizado) em vez de 200
            raise HTTPException(status_code=401, detail="Usuário não encontrado ou senha incorreta")
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro: {str(e)}")

@app.post("/cadastro")
async def post_usuario(request: Request):
    try:
        data = await request.json()
        email = data.get("email")
        nome = data.get("nome")
        senha = data.get("senha")
        points = data.get("points", 0)

        if not email or not nome or not senha:
            raise HTTPException(status_code=400, detail="Preencha todos os campos")

        with open("backend/bancos/users.json", "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        if email in usuarios:
            raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado")

        usuarios[email] = {"nome": nome, "senha": senha, "points": points}

        with open("backend/bancos/users.json", "w", encoding="utf-8") as file:
            json.dump(usuarios, file, indent=4, ensure_ascii=False)

        return {"message": "Usuário criado com sucesso!"}
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro: {str(e)}")
    
@app.post("/comprar")
async def post_comprar(request: Request):
    try:
        data = await request.json()
        email = data.get("email")
        senha = data.get("senha")
        produto_name = data.get("produto_name")
        quantidade = int(data.get("quantidade", 0))

        with open("backend/bancos/users.json", "r", encoding="utf-8") as file:
            usuarios = json.load(file)

        if email in usuarios and usuarios[email]["senha"] == senha:
            
            caminho_produtos = "backend/bancos/produtos.json" 
            with open(caminho_produtos, "r", encoding="utf-8") as file:
                produtos = json.load(file)

            produto_index = next((x for x in range(len(produtos)) if produtos[x]["nome"] == produto_name), None)

            if produto_index is not None:
                produto = produtos[produto_index]
                if produto["estoque"] >= quantidade:
                    preco = produto["preco"]
                    total = preco * quantidade

                    if usuarios[email]["points"] >= total:
                        
                        usuarios[email]["points"] -= total
                        produtos[produto_index]["estoque"] -= quantidade 

                        with open("backend/bancos/users.json", "w", encoding="utf-8") as file:
                            json.dump(usuarios, file, indent=4)

                        with open(caminho_produtos, "w", encoding="utf-8") as file:
                            json.dump(produtos, file, indent=4, ensure_ascii=False)

                        return {"message": f"Compra realizada com sucesso! Total: {total:.2f}"}
                    else:
                        return {"message": "Pontos insuficientes"}
                else:
                    return {"message": "Estoque insuficiente"}
            else:
                return {"message": "Produto não encontrado"}
        else:
            return {"message": "Usuário não encontrado ou senha incorreta"}

    except Exception as e:
        return {"message": f"Ocorreu um erro: {str(e)}"}
