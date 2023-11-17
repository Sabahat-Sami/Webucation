from pydantic import BaseModel
from fastapi import UploadFile

class LoginInput(BaseModel):
    email: str 
    password: str 

class FriendInput(BaseModel):
    user_id: int
    friend_id: int

class CourseInput(BaseModel):
    user_id: int
    course_id: int

class DocumentInput(BaseModel):
    title: str
    author_id: int
    size: int
    content: UploadFile
    general_access: int

class DocumentPermittedUsersInput(BaseModel):
    document_id: int
    user_id: int

class DocumentCategoryInput(BaseModel):
    document_id: int
    name: str

class CourseInput(BaseModel):
    code: str
    title: str
    description: str

class CourseProfessorInput(BaseModel):
    course_id: int
    name: str

class CourseDocumentInput(BaseModel):
    course_id: int
    document_id: int