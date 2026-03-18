# weather-app

## Setup & Run (Windows)

### 1) Node server (weather API)

- Open a terminal (PowerShell or CMD).
- If using PowerShell and you get an error about running scripts being disabled, run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

- Start the server:

```powershell
cd server
npm install
npm run start
```

### 2) Python chat backend

- Create/activate the virtual environment (if not already):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

- Install dependencies:

```powershell
pip install -r chatbox-backend/requirements.txt
```

- Run the Flask app:

```powershell
python chatbox-backend/app.py
```

### Notes

- The Python chatbot fetches weather data from the Node API at `http://localhost:3000/api/weather`.
- Make sure the Node server is running before using the chat endpoint.
