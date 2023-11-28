import { React, useState, useEffect } from 'react'
import styled from "styled-components";
import { subjects } from './data'
import Document from "../components/Document";
import Loading from '../components/Loading.js'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import {AddCircleOutline} from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '65%'
  },
}));

const Container = styled.div`
    padding: 4em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
`;

const Icon = styled.div`
  opacity: 0.5;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  cursor: pointer;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Add = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 110px;
  position: relative;
  border-radius: 1rem;
  background-color: rgba(169, 169, 169, 0.3); /* Adjust the color and transparency as needed */
  backdrop-filter: blur(10px); /* Adjust the blur strength as needed */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover ${Icon}{
    opacity: 1;
  }
`;

const Docs = () => {
    const [cookies, removeCookie] = useCookies(['jwt']);
    const [userID, setUserID] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { courseType } = useParams();

    const classes = useStyles();
    const [openAdd, setOpenAdd] = useState(false);
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleOpen = () => {
      setOpenAdd(true);
    };
  
    const handleClose = () => {
      setOpenAdd(false);
    };

    const handleSubmit = async e => {
      e.preventDefault()

      const findCourse = async () => {
        try {
          const res = await axios.get('http://localhost:8080/course/find_course', {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
              code: `${code.trim()}`,
              title: `${title.trim()}`
            },
          });
    
          if (res.status === 200) {
              if (Object.entries(res.data).length !== 0) {
                addCourse(res.data[0].course_id);
              }
              else {
                createCourse();
              }
          }
        } catch (err) {
          //window.location.reload(false);
        }
      };

      const addCourse = async (id) => {
        axios
        .post('http://localhost:8080/user/create_profile_course', {
          user_id: `${userID}`,
          course_id: `${id}`
        },
        )
        .then(res => {
          console.log(res)
          if (res.status === 200){
            window.location.reload(false);
            setCode('');
            setTitle('');
            setDescription('');
          }
        })
        .catch(err => {
          console.log(err)
        })
      };

      const createCourse = async () => {
        axios
        .post('http://localhost:8080/course/create_course', {
          code: `${code}`,
          title: `${title}`,
          description: `${description}`
        },
        )
        .then(res => {
          console.log(res)
          if (res.status === 200){
            addCourse(res.data.course_id);
          }
        })
        .catch(err => {
          console.log(err)
        })
      };

      findCourse();
    };

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
              setUserID(res.data.user_id);
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
            let path = "";

            switch(courseType) {
              case "my-courses":
                path = 'http://localhost:8080/user/get_profile_course'
                break;
              default:
                navigate("/");
            }

            const res = await axios.get(path, {
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
                user_id: `${id}`,
              },
            });
      
            if (isMounted && res.status === 200) {
                setCourses([]);
                Object.values(res.data).forEach((value) => {
                    fetchCourseInfo(value.course_id);
                });
            }
          } catch (err) {
            if (isMounted) {
                setCourses((prev) => [...prev]);
                setLoading(false);
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
                setLoading(false);
            }
          } catch (err) {
            setCourses((prev) => [...prev]);
            setLoading(false);
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
        <>
        {
            (loading) ? (
                <Loading />
            ) : (
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
                                        <Document item={item[0]} path={"my-notes"}/>
                                    </div>        
                                ))}
                                {
                                  (courseType === "my-courses") ? (
                                    <Add>
                                      <Icon>
                                        <AddCircleOutline onClick={handleOpen}/>
                                      </Icon>
                                    </Add>
                                  ) : (<></>)
                                }
                                
                            </Container>
                        </div>
                    </div>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      className={classes.modal}
                      open={openAdd}
                      onClose={handleClose}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={openAdd}>
                        <div className={classes.paper}>
                        <h2 className="text-center text-2xl font-bold pb-8">Add a Course</h2>
                        <form className="flex flex-col justify-center items-center" onSubmit={e => handleSubmit(e)}>
                          <div className='flex block border border-grey-light bg-white w-2/3 p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                            <input
                              required
                              type='text'
                              className='w-full p-3 ml-3 rounded-3xl pl-5'
                              placeholder='Course Code (e.g. CS-UY 4523)'
                              id='code'
                              onChange={e => {setCode(e.target.value)}}
                            />
                          </div>

                          <div className='flex block border border-grey-light bg-white w-2/3 p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                            <input
                              required
                              type='text'
                              className='w-full p-3 ml-3 rounded-3xl pl-5'
                              placeholder='Course Title (e.g. Design Project)'
                              id='title'
                              onChange={e => {setTitle(e.target.value)}}
                            />
                          </div>

                          <div className='flex block border border-grey-light bg-white w-2/3 p-3 mb-4 rounded-3xl pl-5 shadow-xl'>
                            <input
                              type='text'
                              className='w-full p-3 ml-3 rounded-3xl pl-5'
                              placeholder='Course Description (optional)'
                              id='description'
                              onChange={e => {setDescription(e.target.value)}}
                            />
                          </div>
                          <button
                            type='submit'
                            className='text-white bg-[#707FDD] w-1/2 text-center py-3 rounded-2xl  my-1 shadow-xl'
                          >
                            Submit
                          </button>
                        </form>

                        </div>
                      </Fade>
                    </Modal>
                </div>
            )
        }
        </>
    );
};

export default Docs;
