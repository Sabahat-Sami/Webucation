import styled from "styled-components";
import { subjects } from './data'
import Document from "../components/Document";

const Container = styled.div`
    padding: 4em;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Docs = () => {
    return (
        <div className='h-screen'>
            <div className=''>
                <div className='text-center'>
                    <br/><br/><br/><br/><br/><br/>
                    <h2 className='text-5xl font-bold underline text-[#424B5A]'>
                        Courses
                    </h2>
                    <Container>
                        {subjects.map((item) => (
                            <div key={item.id}>
                                <a href="/notes"><h2 className='text-xl underline text-[#424B5A] hover:text-[#1250b8] hover:font-black'>{item.id}</h2></a>
                                <Document item={item} key={item.id} />
                            </div>
                                
                        ))}
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Docs;
