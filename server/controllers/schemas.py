from pydantic import BaseModel
from fastapi import UploadFile

class LoginInput(BaseModel):
    email: str 
    password: str 


class SignupInput(BaseModel):
    email: str
    password: str
    confirmPassword: str
    fname: str
    lname: str
    phone_num: str

class FriendInput(BaseModel):
    friend_id: int

class ProfileCourseInput(BaseModel):
    course_id: int

class DocumentInput(BaseModel):
    title: str
    author_id: int
    size: int
    content: str
    general_access: int
    course_id: int

class DocumentUpdateInput(BaseModel):
    content: str
    general_access: int
    title: str

class DocumentPermittedUsersInput(BaseModel):
    document_id: int
    user_id: int

class DocumentCategoryInput(BaseModel):
    document_id: int
    name: str

class CourseInput(BaseModel):
    code: str
    title: str

class CourseProfessorInput(BaseModel):
    course_id: int
    name: str

class CourseDocumentInput(BaseModel):
    course_id: int
    document_id: int