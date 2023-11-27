import {
    DeleteOutline,
    FolderOpenOutlined,
    Archive,
} from "@material-ui/icons";
import styled from "styled-components";

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
  background-color: red;
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

const Document = ({ item }) => {
    return (
        <Container>
            <a className="relative z-10" href="/notes"><h2 className='text-xl underline text-[#424B5A] hover:text-[#1250b8] hover:font-black'>{item.title}</h2></a>
            {/* <Image src={item.img} /> */}
            <Info>
                <Icon>
                    <Archive />
                </Icon>
                <Icon>
                    <FolderOpenOutlined />
                </Icon>
                <Icon>
                    <DeleteOutline />
                </Icon>
            </Info>
        </Container>
    );
};

export default Document;
