CREATE TABLE Profile (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    about TEXT
);

CREATE TABLE ProfileFriends (
    user_id INT,
    friend_id INT,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES Profile(user_id),
    FOREIGN KEY (friend_id) REFERENCES Profile(user_id)
);

CREATE TABLE Document (
    document_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author_id INT NOT NULL,
    content BYTEA,
    general_access INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES Profile(user_id)
);

CREATE TABLE PermittedUsers (
    document_id INT,
    user_id INT,
    PRIMARY KEY (document_id, user_id),
    FOREIGN KEY (document_id) REFERENCES Document(document_id),
    FOREIGN KEY (user_id) REFERENCES Profile(user_id)
);

CREATE TABLE Course (
    course_id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL
);

CREATE TABLE CourseDocument (
    course_id INT,
    document_id INT,
    PRIMARY KEY (course_id, document_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (document_id) REFERENCES Document(document_id)
);

CREATE TABLE ProfileCourse (
    user_id SERIAL,
    course_id SERIAL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES Profile(user_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);