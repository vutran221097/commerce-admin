import { useEffect, useState } from 'react'
import { faUser, faCartShopping, faSackDollar, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

import './DashBoard.css'
import Layout from '../../components/Layout/Layout'
import Axios from '../../api/Axios'
import { formatPrice } from '../../utils/utils'
import { DELIVERY_STATUS, PAYMENT_STATUS } from '../../constants/orderStatus';


const DashBoard = () => {
    const [data, setData] = useState([])
    const [orderHistory, setOrderHistory] = useState([])
    const navigate = useNavigate()

    const getData = async () => {
        try {
            const res = await Axios.get('/dashboard')
            if (res.status === 200) {
                setData(res.data)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const getOrderHistory = async () => {
        try {
            const res = await Axios.get(`/order/all?page=${1}`)
            if (res.status === 200) {
                setOrderHistory(res.data.results)
            }
        } catch (e) {
            console.error(e);
        }
    }


    useEffect(() => {
        getData()
        getOrderHistory()
        // eslint-disable-next-line
    }, [])

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

    const DashboardComponent = (
        <div>
            <div className='dashboard-header d-flex justify-content-between gap-2'>
                <div className='card'>
                    <div className="card-body">
                        <h6 className="card-title">USERS</h6>
                        <p>{data.totalUsers}</p>
                        <div className='d-flex justify-content-end'>
                            <FontAwesomeIcon icon={faUser} style={{ color: '#E95972', backgroundColor: "#FFCCCC", borderRadius: "5px", padding: '6px' }} />
                        </div>
                    </div>
                </div>

                <div className='card'>
                    <div className="card-body">
                        <h6 className="card-title">EARNING</h6>
                        <p>$ {data.totalEarning}</p>
                        <div className='d-flex justify-content-end'>
                            <FontAwesomeIcon icon={faSackDollar} style={{ color: '#1A8D1A', backgroundColor: "#CCE6CC", borderRadius: "5px", padding: '6px' }} />
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className="card-body">
                        <h6 className="card-title">NEW ORDERS</h6>
                        <p>{data.totalOrder}</p>
                        <div className='d-flex justify-content-end'>
                            <FontAwesomeIcon icon={faCartShopping} style={{ color: '#E3BA56', backgroundColor: "#F8EDD2", borderRadius: "5px", padding: '6px' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='dashboard-body'>
                <div className="order-list p-3">
                    <div className="card p-3">
                        <h5 className='mb-4' style={{ color: 'grey' }}>History</h5>
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
                                {orderHistory.map((item, index) => {
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
                                                <Button variant="primary" onClick={() => navigate('/list/orders')}>View</Button>
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
    return (
        <div>
            <Layout children={DashboardComponent} />
        </div>
    )
}

export default DashBoard