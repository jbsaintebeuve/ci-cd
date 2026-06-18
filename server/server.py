import mysql.connector
import mysql.connector.pooling
import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        _pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=5,
            pool_reset_session=True,
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            host=os.getenv("MYSQL_HOST"),
        )
    return _pool


def get_db():
    return _get_pool().get_connection()


@app.get("/users")
def get_users():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nom, prenom, email, date_naissance, ville, code_postal FROM utilisateur")
        records = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        users = []
        for row in records:
            users.append(dict(zip(columns, row)))
    return {'utilisateurs': users}


class CreateUserPayload(BaseModel):
    nom: str
    prenom: str
    email: str
    date_naissance: str
    ville: str
    code_postal: str


def parse_date_to_sql(raw: str) -> str:
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        return dt.date().isoformat()
    except Exception:
        return raw


@app.post("/users")
def create_user(user: CreateUserPayload):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO utilisateur (nom, prenom, email, date_naissance, ville, code_postal) VALUES (%s, %s, %s, %s, %s, %s)",
            (user.nom, user.prenom, user.email, parse_date_to_sql(user.date_naissance), user.ville, user.code_postal),
        )
        conn.commit()
        return {"id": cursor.lastrowid}


@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM utilisateur WHERE id = %s", (user_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return {"success": False, "message": "Utilisateur non trouvé"}
        return {"success": True}


class UpdateUserPayload(BaseModel):
    nom: str
    prenom: str
    email: str
    date_naissance: str
    ville: str
    code_postal: str


@app.put("/users/{user_id}")
def update_user(user_id: int, user: UpdateUserPayload):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE utilisateur SET nom=%s, prenom=%s, email=%s, date_naissance=%s, ville=%s, code_postal=%s WHERE id=%s",
            (user.nom, user.prenom, user.email, parse_date_to_sql(user.date_naissance), user.ville, user.code_postal, user_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            return {"success": False, "message": "Utilisateur non trouvé"}
        return {"success": True}


class LoginPayload(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(credentials: LoginPayload):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id FROM admin WHERE email = %s AND password = %s",
            (credentials.email, credentials.password),
        )
        admin = cursor.fetchone()
        if admin:
            return {"success": True}
        return {"success": False}
