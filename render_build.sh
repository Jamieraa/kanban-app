set -e # Exit immediately if a command exits with a non-zero status.

echo "--- 1. Building React Frontend ---"
#go to the frontend directory, install dependencies, and build.
cd frontend
npm install
npm run build
cd .. #return to project root (src/)

echo "--- 2. Running Django Collectstatic with Explicit Pathing ---"
#set the PYTHONPATH to include the src directory and run collectstatic
.venv/bin/python backend/manage.py collectstatic --noinput
echo "--- Build complete! Static files collected. ---"