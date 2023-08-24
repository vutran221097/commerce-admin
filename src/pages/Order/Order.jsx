import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import InputGroup from 'react-bootstrap/InputGroup';

import "./Order.css"
import Layout from '../../components/Layout/Layout'
import Axios from '../../api/Axios'
import CustomModal from '../../components/CustomModal/CustomModal'
import { toastNoti, formatPrice } from '../../utils/utils'
import { DELIVERY_STATUS, PAYMENT_STATUS } from '../../constants/orderStatus';

const Order = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [orderEdit, setOrderEdit] = useState({})
    const [showModalEdit, setShowModalEdit] = useState(false)

    const getData = async (page) => {
        try {
            const res = await Axios.get(`/order/all?page=${page}`)
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


    const editOrder = async (id) => {
        try {
            setShowModalEdit(true)
            const res = await Axios.get(`/order/detail/${id}`)
            if (res.status === 200) {
                setOrderEdit(res.data)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onEditOrder = async () => {
        try {
            if (Object.values(orderEdit).includes("")) {
                return toastNoti("All fields are required!", 'error')
            }
            if (orderEdit.category === 'default') {
                return toastNoti("You must select type for order!", 'error')
            }
            const formatData = { ...orderEdit }
            delete formatData['createdAt']
            delete formatData['updatedAt']
            delete formatData['_id']
            delete formatData['__v']
            const res = await Axios.put(`/order/status/${orderEdit._id}`, formatData)
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
        setOrderEdit({ ...orderEdit, [e.target.name]: e.target.value })
    }

    const formatStatus = (status, type) => {
        if (type === 'payment') {
            switch (status) {
                case 'pending':
                    return PAYMENT_STATUS.PENDING
                case 'done':
                    return PAYMENT_STATUS.DONE

                case 'failed':
                    return PAYMENT_STATUS.FAILED
                default:
                    return PAYMENT_STATUS.PENDING
            }
        } else {
            switch (status) {
                case 'pending':
                    return DELIVERY_STATUS.PENDING
                case 'done':
                    return DELIVERY_STATUS.DONE

                case 'failed':
                    return DELIVERY_STATUS.FAILED
                default:
                    return DELIVERY_STATUS.PENDING
            }
        }
    }


    const OrderComponent = (
        <div>
            <div className='order-page'>
                <div className="order-list p-3">
                    <div className="card p-3">
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h5 style={{ color: 'grey' }}>Orders List</h5>
                        </div>

                        {showModalEdit &&
                            <CustomModal
                                show={showModalEdit}
                                title={`Edit order ${orderEdit._id}`}
                                submitText="Update"
                                onClose={() => setShowModalEdit(false)}
                                onSubmit={() => onEditOrder()}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Delivery Status</InputGroup.Text>
                                    <select className='form-edit-status-select' name="deliveryStatus" value={orderEdit.deliveryStatus || ""} onChange={onChangeEdit}>
                                        <option value="pending">{DELIVERY_STATUS.PENDING}</option>
                                        <option value="done">{DELIVERY_STATUS.DONE}</option>
                                        <option value="failed">{DELIVERY_STATUS.FAILED}</option>
                                    </select>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Payment Status</InputGroup.Text>
                                    <select className='form-edit-status-select' name="paymentStatus" value={orderEdit.paymentStatus || ""} onChange={onChangeEdit}>
                                        <option value="pending">{PAYMENT_STATUS.PENDING}</option>
                                        <option value="done">{PAYMENT_STATUS.DONE}</option>
                                        <option value="failed">{PAYMENT_STATUS.FAILED}</option>
                                    </select>
                                </InputGroup>
                            </CustomModal>

                        }
                        <table>
                            <thead>
                                <tr>
                                    <th><FontAwesomeIcon icon={faSquare} /></th>
                                    <th>Order ID</th>
                                    <th>Customer Name</th>
                                    <th>Payment Type</th>
                                    <th>Total</th>
                                    <th>Delivery Status</th>
                                    <th>Payment Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    return (
                                        <tr key={index} className="order-items">
                                            <td><FontAwesomeIcon icon={faSquare} /></td>
                                            <td>{item._id}</td>
                                            <td>{item.formData.fullname}</td>
                                            <td>{item.payment}</td>
                                            <td>{formatPrice(item.totalPrice)}</td>
                                            <td>{formatStatus(item.deliveryStatus)}</td>
                                            <td>{formatStatus(item.paymentStatus)}</td>
                                            <th className='d-flex gap-2 border-0'>
                                                <div className='edit-btn' onClick={() => editOrder(item._id)}>
                                                    Edit
                                                </div>
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
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
            <Layout children={OrderComponent} />
        </div>
    )
}

export default Order