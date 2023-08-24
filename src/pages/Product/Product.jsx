import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import './Product.css'
import Layout from '../../components/Layout/Layout'
import Axios from '../../api/Axios'
import CustomModal from '../../components/CustomModal/CustomModal'
import { formatPrice, toastNoti } from '../../utils/utils'
import NewProductForm from '../NewProduct/components/NewProductForm'
import { baseImgUrl } from '../../constants/baseImgUrl'

const Product = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [productEdit, setProductEdit] = useState({})
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [deleteProductId, setDeleteProductId] = useState("")
    const [searchText, setSearchText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const timeoutSearchId = useRef();
    const navigate = useNavigate()

    const getData = async (page) => {
        try {
            const res = await Axios.get(`/product/all?page=${page}`)
            if (res.status === 200) {
                setData(res.data.results)
                setTotalPage(res.data.total_pages)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const getSearchData = async (page) => {
        try {
            const res = await Axios.get(`/product/search?search=${searchText}&page=${page}`)
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
        if (!searchText && !isLoading) {
            getData(page)
            return;
        };
        if (!isLoading) {
            getSearchData(page)
        }
        // eslint-disable-next-line
    }, [searchText, isLoading]);

    const deleteProduct = (id) => {
        setShowModalDelete(true)
        setDeleteProductId(id)
    }

    const editProduct = async (id) => {
        try {
            setShowModalEdit(true)
            const res = await Axios.get(`/product/detail/${id}`)
            if (res.status === 200) {
                setProductEdit(res.data)
            }
        } catch (e) {
            console.error(e);
        }
    }


    const onDeleteProduct = async (id) => {
        try {
            const res = await Axios.delete(`/product/${id}`)
            if (res.status === 200) {
                getData(page)
                toastNoti(res.data.message, 'success')
                setShowModalDelete(false)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onEditProduct = async () => {
        try {
            if (Object.values(productEdit).includes("")) {
                return toastNoti("All fields are required!", 'error')
            }
            if (productEdit.category === 'default') {
                return toastNoti("You must select type for product!", 'error')
            }
            const formatData = { ...productEdit }
            delete formatData['createdAt']
            delete formatData['updatedAt']
            delete formatData['_id']
            delete formatData['__v']
            const res = await Axios.put(`/product/update-product/${productEdit._id}`, formatData)
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
        setProductEdit({ ...productEdit, [e.target.name]: e.target.value })
    }

    const onChangeSearchText = (e) => {
        setIsLoading(true)
        setSearchText('');

        if (timeoutSearchId.current) {
            clearTimeout(timeoutSearchId.current);
        }

        timeoutSearchId.current = setTimeout(() => {
            setIsLoading(false)
        }, 300);

        setSearchText(e.target.value);
    }


    const ProductComponent = (
        <div>
            <div className='product-page'>
                <div className="product-list p-3">
                    <div className="card p-3">
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h5 style={{ color: 'grey' }}>Products List</h5>
                            <div className='add-btn' onClick={() => navigate('/create/product')}>
                                Add new
                            </div>
                        </div>

                        <Form.Group className="mb-3" >
                            <Form.Control type="text" placeholder="Search By Product Name" name='searchText' value={searchText} onChange={onChangeSearchText} />
                        </Form.Group>

                        {showModalDelete &&
                            <CustomModal
                                show={showModalDelete}
                                title="Delete Product"
                                submitText="Delete"
                                onClose={() => setShowModalDelete(false)}
                                onSubmit={() => onDeleteProduct(deleteProductId)}
                            >
                                <p>Are you sure you want to delete product {deleteProductId}</p>
                            </CustomModal>}

                        {showModalEdit &&
                            <CustomModal
                                show={showModalEdit}
                                title={`Edit product ${productEdit._id}`}
                                submitText="Update"
                                onClose={() => setShowModalEdit(false)}
                                onSubmit={() => onEditProduct()}
                            >
                                <NewProductForm data={productEdit} onChange={onChangeEdit} isEdit={true} />
                            </CustomModal>

                        }
                        {!isLoading ? (<table>
                            <thead>
                                <tr>
                                    <th><FontAwesomeIcon icon={faSquare} /></th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    return (
                                        <tr key={index} className="product-items">
                                            <td><FontAwesomeIcon icon={faSquare} /></td>
                                            <td>{item._id}</td>
                                            <td>{item.name}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td><img src={`${baseImgUrl}/${item.images[0]}`} alt={item.name} width={100} /></td>
                                            <td>{item.category}</td>
                                            <td className='d-flex gap-2 border-0 align-items-center edit-product'>
                                                <div className='edit-btn' onClick={() => editProduct(item._id)}>
                                                    Edit
                                                </div>
                                                <div className='delete-btn' onClick={() => deleteProduct(item._id)}>
                                                    Delete
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
                        </table>) : (
                            <div className='d-flex justify-content-center'>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>

    )

    return (
        <div>
            <Layout children={ProductComponent} />
        </div>
    )
}

export default Product