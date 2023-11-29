import axios from 'axios';

const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        //console.log(token)
        if (!token) {
        resolve(null);
        return;
        }

        axios
        .get('http://localhost:8080/user/verify_token', {
            params: {
            token: token
            },
        })
        .then(res => {
            //console.log(res);
            if (res.status === 200) {
            resolve(res.data.payload);
            } else {
            reject(new Error(`Token verification failed with status ${res.status}`));
            }
        })
        .catch(err => {
            //console.error(err);
            reject(new Error('Token verification failed'));
        });
    });
};

export default verifyToken;