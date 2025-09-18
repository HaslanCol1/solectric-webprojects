from flask import Flask, request, jsonify, redirect, render_template
from Config.db import app

@app.route("/")


@app.route("/main")
def main():
    return render_template("main/index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')