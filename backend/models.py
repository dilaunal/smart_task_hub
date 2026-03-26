from sqlalchemy import Column, Integer, String, Boolean
from database import Base  # ✅ Başına nokta eklendi

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    completed = Column(Boolean, default=False)
    # 🚨 Priority sütunu tamamen kaldırıldı, eski sade yapıya dönüldü.