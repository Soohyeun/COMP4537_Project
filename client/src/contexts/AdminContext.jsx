import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AdminContext = createContext();
const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminProvider;