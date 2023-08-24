import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import './User.css'
import Layout from '../../components/Layout/Layout'
import Axios from '../../api/Axios'
import CustomModal from '../../components/CustomModal/CustomModal'
import { toastNoti } from '../../utils/utils';

const User = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [userEdit, setUserEdit] = useState({})
    const [currentUserId, setcurrentUserId] = useState("")
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)

    const getData = async (page) => {
        try {
            const res = await Axios.get(`/user/all?page=${page}`)
            if (res.status === 200) {
                setData(res.data.results)
                setTotalPage(res.data.total_pages)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onHandlePage = (e) => {
        if (page === 0) return;
        let newPage
        if (e === 'next') {
            newPage = page + 1
            setPage(newPage)
        } else {
            newPage = page - 1
            setPage(newPage)
        }
        getData(newPage)
    }

    useEffect(() => {
        getData(page)
        // eslint-disable-next-line
    }, [])

    const deleteUser = (id) => {
        setShowModalDelete(true)
        setcurrentUserId(id)
    }

    const editUser = async (id) => {
        try {
            setShowModalEdit(true)
            const res = await Axios.get(`/user/detail/${id}`)
            if (res.status === 200) {
                setUserEdit(res.data)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onDeleteUser = async (id) => {
        try {
            const res = await Axios.delete(`/user/${id}`)
            if (res.status === 200) {
                getData(page)
                toastNoti(res.data.message, 'success')
                setShowModalDelete(false)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onEditUser = async () => {
        try {
            if (Object.values(userEdit).includes("")) {
                return toastNoti("All fields are required!", 'error')
            }
            const res = await Axios.put(`/user/update-user/${userEdit._id}`, userEdit)
            if (res.status === 200) {
                toastNoti(res.data.message, 'success')
                getData(page)
                setShowModalEdit(false)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onChangeEdit = (e) => {
        setUserEdit({ ...userEdit, [e.target.name]: e.target.value })
    }


    const UserComponent = (
        <div>
            <div className='user-page'>
                <div className="user-list p-3">
                    <div className="card p-3">
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h5 style={{ color: 'grey' }}>Users List</h5>
                        </div>
                        {showModalDelete &&
                            <CustomModal
                                show={showModalDelete}
                                title="Delete Hotel"
                                submitText="Delete"
                                onClose={() => setShowModalDelete(false)}
                                onSubmit={() => onDeleteUser(currentUserId)}
                            >
                                <p>Are you sure you want to delete user {currentUserId}</p>
                            </CustomModal>}

                        {showModalEdit &&
                            <CustomModal
                                show={showModalEdit}
                                title="Edit user"
                                submitText="Update"
                                onClose={() => setShowModalEdit(false)}
                                onSubmit={() => onEditUser()}
                            >
                                <div>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                                        <Form.Control
                                            placeholder="Email"
                                            name="email"
                                            aria-label="Email"
                                            aria-describedby="basic-addon1"
                                            value={userEdit.email || ""}
                                            disabled
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Full Name</InputGroup.Text>
                                        <Form.Control
                                            placeholder="FullName"
                                            aria-label="FullName"
                                            name="fullname"
                                            aria-describedby="basic-addon1"
                                            value={userEdit.fullname || ""}
                                            onChange={onChangeEdit}
                                        />
                                    </InputGroup>
                                </div>


                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
                                    <Form.Control
                                        placeholder="Phone"
                                        aria-label="Phone"
                                        name="phone"
                                        aria-describedby="basic-addon1"
                                        type="number"
                                        value={userEdit.phone || ""}
                                        onChange={onChangeEdit}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Role</InputGroup.Text>
                                    <select className='form-edit-role-select' name="role" value={userEdit.role || ""} onChange={onChangeEdit}>
                                        <option value="user">User</option>
                                        <option value="counselor">Counselor</option>
                                    </select>
                                </InputGroup>

                            </CustomModal>}

                        <table>
                            <thead>
                                <tr>
                                    <th><FontAwesomeIcon icon={faSquare} /></th>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    return (
                                        <tr key={index} className="user-items">
                                            <td><FontAwesomeIcon icon={faSquare} /></td>
                                            <td>{item._id}</td>
                                            <td>{item.email}</td>
                                            <td>{item.role}</td>
                                            <td>
                                                <div className='d-flex gap-2 border-0'>
                                                    <div className='edit-btn' hidden={item.role === 'admin'} onClick={() => editUser(item._id)}>
                                                        Edit
                                                    </div>
                                                    <div className='delete-btn' hidden={item.role === 'admin'} onClick={() => deleteUser(item._id)}>
                                                        Delete
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {page + "-" + totalPage + " of " + totalPage}
                                    </td>
                                    <td>
                                        <div className='d-flex justify-content-evenly action'>
                                            {page !== 1 && <FontAwesomeIcon className='icon' onClick={() => onHandlePage('back')} icon={faChevronLeft} />}
                                            {page !== totalPage && <FontAwesomeIcon className='icon' onClick={() => onHandlePage('next')} icon={faChevronRight} />}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
    return (
        <div>
            <Layout children={UserComponent} />
        </div>
    )
}

export default User