import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="container-fluid">
            <div className="row">

                {/* Sidebar */}
                <div className="col-md-2 col-12 p-0">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="col-md-10 col-12 p-4">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Layout;
