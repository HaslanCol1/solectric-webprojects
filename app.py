from flask import Flask, request, jsonify, redirect, render_template
from Config.db import app

@app.route("/")
@app.route("/main")
def main():
    return render_template("index.html")

@app.route("/auth")
def auth():
    return render_template("main/auth.html")

@app.route("/reporte")
def reporte():
    return render_template("main/reporte.html", step=1)

@app.route("/reporte/paso1")
def reporte_paso1():
    return render_template("main/reporte.html", step=1)

@app.route("/reporte/paso2")
def reporte_paso2():
    return render_template("main/reporte.html", step=2)

@app.route("/reporte/paso3")
def reporte_paso3():
    return render_template("main/reporte.html", step=3)

@app.route("/ciudadano")
def ciudadano():
    return render_template("main/ciudadano.html")

@app.route("/funcionario")
def funcionario():
    return render_template("main/funcionario.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')