import models
from database import engine

def create_db():
    print("Starting database creation...")
    try:
        # This is the magic line that creates the todos.db file
        models.Base.metadata.create_all(bind=engine)
        print("✅ SUCCESS: 'todos.db' has been created in your backend folder!")
    except Exception as e:
        print(f"❌ ERROR: Could not create database. Reason: {e}")

if __name__ == "__main__":
    create_db()