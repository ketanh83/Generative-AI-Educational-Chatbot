import json

import google.generativeai as genai
from flask import Flask, request, jsonify, render_template

API = //Put here your own personal API Key 
genai.configure(api_key=API)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
chat = model.start_chat(history=[])

app = Flask(__name__)

sampleJson = {
    "Correct" : "No",
    "evaluation": "The answer does not address the question.(Also specify correct answer here)",
    "Accuracy" : "0%"
}


@app.route("/question", methods=['GET'])
def generateQuestion():
    if request.method == 'GET':
        topic = request.args['topic']
        response = chat.send_message("Generate a question about " + topic + "Dont provide answer",
                                     generation_config={'response_mime_type': 'application/json'})
        question = json.loads(response.text)["question"]
        return jsonify(question)


@app.route("/answer", methods=['GET'])
def generateAnswer():
    if request.method == 'GET':
        answer = request.args['answer']
        question = request.args['question']
        response = chat.send_message(
            "Question : " + question + "\n Answer : " + answer + "\n Evaluate the answer with respect to given question.In response generate a JSON similar to : " + str(
                sampleJson),
            generation_config={'response_mime_type': 'application/json'})
        # res = json.loads(response.text)["evaluation"]
        return jsonify(response.text)


@app.route("/")
def hello():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
