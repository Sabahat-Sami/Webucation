INSERT INTO Profile (email, username, password, fname, lname, phone_number, about) 
VALUES 
    ('test@email.com', 'test@email.com', '$2b$12$3CT69gkSS5ZVLttf6PaUQull.mblz1hfQO8ReQPVGDjCZYY2.7PmS', 'Test', 'User', '1234567890', 'I am a test user'),
    ('cc6923@nyu.edu', 'cc6923@nyu.edu', '$2b$12$3CT69gkSS5ZVLttf6PaUQull.mblz1hfQO8ReQPVGDjCZYY2.7PmS', 'Calvin', 'Chu', '9876543210', 'CS @ NYU Tandon 2024'),
    ('tr2128@nyu.edu', 'tr2128@nyu.edu', '$2b$12$3CT69gkSS5ZVLttf6PaUQull.mblz1hfQO8ReQPVGDjCZYY2.7PmS', 'Tanvi', 'Rahman', '5555555555', 'CS @ NYU Tandon 2024'),
    ('il2149@nyu.edu', 'il2149@nyu.edu', '$2b$12$3CT69gkSS5ZVLttf6PaUQull.mblz1hfQO8ReQPVGDjCZYY2.7PmS', 'Ivan', 'Lin', '6666666666', 'CS @ NYU Tandon 2024'),
    ('ss14243@nyu.edu', 'ss14243@nyu.edu', '$2b$12$3CT69gkSS5ZVLttf6PaUQull.mblz1hfQO8ReQPVGDjCZYY2.7PmS', 'Sabahat', 'Sami', '7777777777', 'CS @ NYU Tandon 2024');

INSERT INTO ProfileFriends (user_id, friend_id) 
VALUES 
    (1, 2),
    (2, 1),
    (1, 3),
    (3, 1),
    (2, 4),
    (4, 2),
    (3, 5),
    (5, 3),
    (2, 3),
    (3, 2),
    (4, 5),
    (5, 4),
    (1, 4),
    (4, 1),
    (2, 5),
    (5, 2);

INSERT INTO Document (title, author_id, content, general_access) 
VALUES 
    ('Document 1', 1, E'Content for Document 1', 1),
    ('Document 2', 2, E'Content for Document 2', 0),
    ('Document 3', 3, E'Content for Document 3', 1),
    ('Document 4', 4, E'Content for Document 4', 0),
    ('Document 5', 5, E'Content for Document 5', 1),
    ('Document 6', 2, E'Content for Document 6', 1),
    ('Document 7', 3, E'Content for Document 7', 0),
    ('Document 8', 4, E'Content for Document 8', 1),
    ('Document 9', 5, E'Content for Document 9', 0),
    ('Document 10', 1, E'Content for Document 10', 1);

INSERT INTO PermittedUsers (document_id, user_id) 
VALUES 
    (1, 2),
    (2, 1),
    (2, 3),
    (3, 1),
    (4, 5),
    (5, 4),
    (6, 1),
    (6, 3),
    (7, 2),
    (8, 4),
    (9, 5),
    (10, 2);

INSERT INTO Course (code, title) 
VALUES 
    ('CM-UY 1013', 'GENERAL CHEMISTRY I'),
    ('CS-UY 4513', 'Software Engineering'),
    ('MEIS-UA 101', 'Elementary Arabic I'),
    ('CS-UY 4523', 'Design Project'),
    ('MA-UY 2114', 'Calculus III: Multi-Dimensional Calculus'),
    ('CS-UY 4613', 'Artificial Intelligence'),
    ('CS-UY 3923', 'COMPUTER SECURITY'),
    ('EXPOS-UA 1', 'Writing The Essay'),
    ('FIN-UY 2003', 'Economic Foundations of Finance'),
    ('CS-UY 3913', 'JAVA AND WEB DESIGN'),
    ('CS-UY 4553', 'Game Design'),
    ('PHYS-UA 101', 'General Physics I'),
    ('CS-UY 3224', 'Introduction to Operating Systems'),
    ('CHEM-UA 122', 'General Chemistry II'),
    ('CS-UY 4313', 'Computer Graphics'),
    ('MA-UY 2224', 'Linear Algebra'),
    ('CS-UY 4713', 'Data Mining'),
    ('CS-UY 3013', 'Database Systems'),
    ('ENGL-UA 2', 'Intro to Drama'),
    ('ECON-UA 1', 'Principles of Microeconomics'),
    ('CS-UY 3214', 'Computer Networks'),
    ('CS-UY 4883', 'Introduction to Cryptography');

INSERT INTO CourseDocument (course_id, document_id) 
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10);

INSERT INTO ProfileCourse (user_id, course_id) 
VALUES 
    (1, 1),
    (2, 2),
    (3, 1),
    (3, 3),
    (4, 4),
    (5, 5),
    (1, 7),
    (2, 8),
    (3, 9),
    (4, 10),
    (5, 6);
