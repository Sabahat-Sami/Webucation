import { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import verifyToken from './TokenAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cookies, removeCookie] = useCookies(['jwt']);

    useEffect(() => {
        const token = cookies.jwt;
        var payload = null;

        const fetchData = async () => {
            try {
                payload = await verifyToken(token);
            } catch (error) {
                payload = null;
            } finally {
                setLoading(false);
            }
            if (payload == null) {
                setUser(null);
                removeCookie('jwt');
                //console.log("AuthContext: token removed");
            }
            else {
                //console.log(payload);
                setUser(payload['username'])
            }
        };

        if (token) {
            fetchData();
        }
        // eslint-disable-next-line
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        removeCookie('jwt');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};