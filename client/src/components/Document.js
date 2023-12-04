import {
    DeleteOutline,
    FolderOpenOutlined,
    Archive,
} from "@material-ui/icons";
import styled from "styled-components";
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 110px;
  position: relative;
  background-color: rgba(59, 130, 246, 0.5); 
  backdrop-filter: blur(10px); 
  border-radius: 1rem;
  padding-top: 20px;
  &:hover ${Info}{
    opacity: 1;
  }
`;


const Image = styled.img`
  height: 75%;
  z-index: 2;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px 10px 10px 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Document = ({ item, path }) => {
    const [cookies, removeCookie] = useCookies(['jwt']);

    const deleteCourse = async (id) => {
      try{
        axios.delete('http://localhost:8080/user/delete_profile_course', {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
            course_id: `${id}`,
          }
        }).then((res) => {
          if(res.status === 200){
            window.location.reload(false);
          }
        }).catch(err => console.log(err))
      }
      catch (e){
        console.log(e);
      }
    };

    return (
        <Container>
            <a className="relative z-10" href={"/notes/"+path+"/"+item.course_id}><h2 className='text-xl underline text-[#424B5A] hover:text-[#1250b8] hover:font-black'>{item.title}</h2></a>
            {/* <Image src={item.img} /> */}
            <Info>
                {/* <Icon>
                    <Archive />
                </Icon> */}
                {/* <Icon>
                    <FolderOpenOutlined />
                </Icon> */}
                <Icon>
                    <DeleteOutline onClick={() => deleteCourse(item.course_id)}/>
                </Icon>
            </Info>
        </Container>
    );
};

export default Document;
