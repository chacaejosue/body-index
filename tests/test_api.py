"""Pruebas unitarias y de integración para la API REST de FastAPI."""

from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["version"] == "2.0.0"


def test_endpoint_imc():
    payload = {
        "peso_kg": 74.0,
        "estatura_m": 1.76,
        "sexo": "masculino",
        "cintura_cm": 82.0,
    }
    response = client.post("/api/v1/imc", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["imc_estandar"] == 23.89
    assert data["clasificacion_oms"] == "Peso normal (Saludable)"
    assert data["rfm_grasa_estimada"] is not None


def test_endpoint_tmb():
    payload = {
        "peso_kg": 74.0,
        "estatura_m": 1.76,
        "edad": 26,
        "sexo": "masculino",
        "porcentaje_grasa": 15.0,
        "metodo_preferido": "auto",
    }
    response = client.post("/api/v1/tmb", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["tmb_kcal"] > 1000
    assert data["metodo_utilizado"] == "katch_mc_ardle"


def test_endpoint_get():
    payload = {
        "tmb_kcal": 1715.0,
        "peso_kg": 74.0,
        "nivel_actividad": "moderado",
        "objetivo": "deficit_moderado",
    }
    response = client.post("/api/v1/get", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["get_mantenimiento_kcal"] == 2658.25
    assert data["calorias_objetivo_kcal"] < 2658.25
    assert "macronutrientes" in data


def test_endpoint_analisis_completo():
    payload = {
        "edad": 26,
        "peso_kg": 74.0,
        "estatura_m": 1.76,
        "sexo": "masculino",
        "nivel_actividad": "moderado",
        "objetivo": "mantenimiento",
        "cintura_cm": 82.0,
        "porcentaje_grasa": 16.0,
    }
    response = client.post("/api/v1/analisis-completo", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["imc"]["imc_estandar"] == 23.89
    assert data["tmb"]["tmb_kcal"] > 0
    assert data["get"]["calorias_objetivo_kcal"] > 0
