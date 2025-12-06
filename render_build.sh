set -e # Exit immediately if a command exits with a non-zero status.


#go to the frontend directory, install dependencies, and build.
cd frontend
npm install
npm run build
cd .. #return to project root (src/)

#install python dependencies
pip install -r requirements.txt

#set the PYTHONPATH to include the src directory and run collectstatic
PYTHONPATH=. python backend/manage.py collectstatic --noinput

# --- TEMPORARY MIGRATION STEP ---
echo "--- 4. Running Database Migrations (One-Time Setup) ---"
# This command creates the tables in your Supabase PostgreSQL database.
# It uses PYTHONPATH=. to ensure Django modules are found.
PYTHONPATH=. python backend/manage.py migrate --noinput
echo "--- Migrations complete. ---"
# ---------------------------------