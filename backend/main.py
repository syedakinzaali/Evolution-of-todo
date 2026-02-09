from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Field, SQLModel, create_engine, Session, select

# Database Configuration
DATABASE_URL = "postgresql://neondb_owner:npg_nBmSDPHE3bs6@ep-orange-dust-aix6kvx2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
engine = create_engine(DATABASE_URL, echo=True)

# Todo Models
class TodoBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: int

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database session dependency
def get_session():
    with Session(engine) as session:
        yield session

# Use lifespan or startup to create tables
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# CRUD Endpoints
@app.post("/todos/", response_model=TodoRead)
def create_todo(*, session: Session = Depends(get_session), todo: TodoCreate):
    # Fixed: .from_orm() is deprecated, use model_validate() or dict unpacking
    db_todo = Todo.model_validate(todo) 
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@app.get("/todos/", response_model=list[Todo])
def read_todos(search: str = None, session: Session = Depends(get_session)):
    statement = select(Todo)
    if search:
        statement = statement.where(Todo.title.contains(search))
    return session.exec(statement).all()

@app.patch("/todos/{todo_id}", response_model=TodoRead)
def update_todo(*, session: Session = Depends(get_session), todo_id: int, todo: TodoUpdate):
    db_todo = session.get(Todo, todo_id)
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    # Fixed: .dict() is changed to .model_dump() in newer Pydantic versions
    todo_data = todo.model_dump(exclude_unset=True)
    for key, value in todo_data.items():
        setattr(db_todo, key, value)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(*, session: Session = Depends(get_session), todo_id: int):
    todo = session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()
    return {"ok": True}