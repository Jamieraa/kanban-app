echo "--- 1. Building React Frontend ---"
#navigate to the frontend directory, install dependencies, and build.
cd frontend
npm install
npm run build
cd .. #return to project root (src/)

echo "--- 2. Activating Python Virtual Environment ---"
#explicitly activate the virtual environment to load the PYTHONPATH and all dependencies.
source .venv/bin/activate

echo "--- 3. Running Django Collectstatic ---"
#execute collectstatic from the project root using the activated environment's Python.
#the simple 'python' command now points to the correct interpreter.
python backend/manage.py collectstatic --noinput

echo "--- Build complete! Static files collected. ---"