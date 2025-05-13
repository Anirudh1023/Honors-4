

---

````markdown
# 🧠 Universal FastAPI Backend for ML Inference

A **plug-and-play backend template** using FastAPI that supports **multi-modal model inference** — with standardized input/output handling for seamless frontend integration.

Built to work effortlessly with any ML model (e.g., summarization, text-to-speech, transcription), the only thing you need to change is the **core model logic**, while the rest of the backend remains constant.

---

## 🚀 Features

- ✅ Accepts multiple input types (text, audio)
- ✅ Supports output as text (JSON) or audio (MPEG stream)
- ✅ Minimal changes required for switching tasks
- ✅ Fully compatible with a React + TypeScript frontend
- ✅ Easily extensible and production-ready

---

## 📦 Installation

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
npm run dev
````

---

## 🏁 Running the Server

```bash
uvicorn main:app --reload
```

Server runs locally on:
📍 `http://127.0.0.1:8000`

---

## 🧰 API Endpoint

### `POST /infer`

Send a multipart `FormData` request with:

| Field         | Type     | Required | Description                   |
| ------------- | -------- | -------- | ----------------------------- |
| `input_name`  | `string` | optional | One or more text input fields |
| `file_name`   | `file`   | optional | One or more audio file inputs |
| `output_type` | `string` | yes      | Either `"text"` or `"audio"`  |

---

## 🔄 Standard Template (Do Not Modify)

In `main.py`, the structure is fixed:

```python
@app.post("/infer")
async def infer(request: Request, output_type: str = Form(...)):
    form = await request.form()

    input_data = {}
    audio_inputs = {}

    for key, value in form.multi_items():
        if key == "output_type":
            continue
        if isinstance(value, UploadFile):
            audio_inputs[key] = value
        else:
            input_data[key] = value

    # <<< CUSTOM LOGIC SECTION >>>
```

---

## ✨ Examples

### 📝 Summarization

```python
from transformers import pipeline
summarizer = pipeline("summarization")
summary = summarizer(input_data["text"], max_length=60)[0]["summary_text"]
return JSONResponse(content={"text": summary})
```

---

### 🔊 Text to Speech (TTS)

```python
from gtts import gTTS
tts = gTTS(" ".join(input_data.values()))
audio_fp = io.BytesIO()
tts.write_to_fp(audio_fp)
audio_fp.seek(0)
return StreamingResponse(audio_fp, media_type="audio/mpeg")
```

---

### 🎤 Whisper Transcription

```python
import whisper
model = whisper.load_model("base")
file = next(iter(audio_inputs.values()))
with open("temp.wav", "wb") as f:
    f.write(await file.read())
result = model.transcribe("temp.wav")
return JSONResponse(content={"text": result["text"]})
```

---

## 🌐 Frontend Integration

Use this backend with your React/TypeScript frontend that sends a `FormData` request like:

```ts
formData.append("text_input", "Hello World!");
formData.append("output_type", "audio");
```

> ⚠️ Backend must be CORS-enabled when deployed for production use. If not local

---

## 📁 Example Folder Structure

```
project/
│
├── main.py                  # FastAPI backend
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

---

## 📌 Future Improvements

* Token-based authentication
* S3 integration for output storage
* Dockerize and deploy on Fly.io or Render
* Real-time model inference stats/logs

---

## 👨‍💻 Author

Built by [Anirudh @ IIIT Hyderabad](anirudh.bocha@students,iiit.ac.in)

---

## 📝 License

MIT License. Use freely and modify as needed.

---
