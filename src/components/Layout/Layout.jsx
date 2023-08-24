import './Layout.css'
import Sidebar from '../Sidebar/Sidebar'

const Layout = (props) => {
    const { children } = props
    return (
        <div className='layout'>
            <div className="layout-header">
                <div className="row">
                    <div className="col-2 ps-5 py-2">
                        <h4 className="m-0">Admin Page</h4>
                    </div>
                    <div className="col-10 horizon-line">
                    </div>
                </div>

            </div>
            <hr className="m-0" />
            <div className='layout-container'>
                <div className='row h-100'>
                    <div className="col-2 ps-5 py-2">
                        <Sidebar />
                    </div>
                    <div className="col-10 horizon-line content-container">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout