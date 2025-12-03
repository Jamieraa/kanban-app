set -e # Exit immediately if a command exits with a non-zero status.

echo "--- 1. Building React Frontend ---"
#go to the frontend directory, install dependencies, and build.
cd frontend
npm install
npm run build
cd .. #return to project root (src/)

echo "--- 2. Running Django Collectstatic with Explicit Pathing ---"
pip install -r requirements.txt
#set the PYTHONPATH to include the src directory and run collectstatic
PYTHONPATH=. python backend/manage.py collectstatic --noinput
echo "--- Build complete! Static files collected. ---"