import { React, useState, useEffect } from 'react'
import styled from "styled-components";
import { subjects } from './data'
import Document from "../components/Document";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Container = styled.div`
    padding: 4em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;

const Docs = () => {
    const [cookies, removeCookie] = useCookies(['jwt']);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        let isMounted = true;
      
        const fetchProfile = async () => {
          try {
            const res = await axios.get('http://localhost:8080/user/get_profile', {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
              },
            });
      
            if (isMounted && res.status === 200) {
              fetchCourses(res.data.user_id);
            }
          } catch (err) {
            console.log(err);
            removeCookie('jwt');
            navigate('/login');
          }
        };
      
        const fetchCourses = async (id) => {
          try {
            const res = await axios.get('http://localhost:8080/user/get_profile_course', {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
                user_id: `${id}`,
              },
            });
      
            if (isMounted && res.status === 200) {
                Object.values(res.data).forEach((value) => {
                    fetchCourseInfo(value.course_id);
                });
            }
          } catch (err) {
            if (isMounted) {
                setCourses((prev) => [...prev]);
            }
          }
        };
      
        const fetchCourseInfo = async (id) => {
          try {
            const res = await axios.get('http://localhost:8080/course/get_course', {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
                course_id: `${id}`,
              },
            });
      
            if (isMounted && res.status === 200) {
                setCourses((prev) => [...prev, res.data]);
            }
          } catch (err) {
            setCourses((prev) => [...prev]);
          }
        };
      
        if (cookies.jwt && cookies.jwt !== 'undefined') {
          fetchProfile();
        } else {
          navigate('/login');
        }
      
        return () => {
          isMounted = false;
        };
      }, []);

    return (
        <div className='h-screen'>
            <div className=''>
                <div className='text-center'>
                    <br/><br/><br/><br/><br/><br/>
                    <h2 className='text-5xl font-bold underline text-[#424B5A]'>
                        Courses
                    </h2>
                    <Container>
                        {courses.map((item) => (
                            <div key={item[0].course_id}>
                                <Document item={item[0]}  />
                            </div>
                                
                        ))}
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Docs;
