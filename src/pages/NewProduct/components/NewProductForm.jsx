import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

import './NewProductForm.css'
import { PRODUCT_CATEGORY } from '../../../constants/category';
import { baseImgUrl } from '../../../constants/baseImgUrl'

const NewProductForm = (props) => {
    const { data, onChange, onSubmit, isEdit, uploadMultipleFiles, preview, fileInputKey } = props

    return (
        <div className="new-form">
            {!isEdit && <div className='card title'>
                <h5> ADD NEW PRODUCT</h5>
            </div>}

            <div className='card form'>
                <Form encType='multipart/form-data'>
                    <div className='form-layout'>
                        <Form.Group className="mb-3" >
                            <Form.Label>Product Name </Form.Label>
                            <Form.Control type="text" placeholder="Enter Product Name" name='name' value={data.name || ""} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Category</Form.Label>
                            <Form.Select name='category' onChange={onChange} value={data.category || ""}>
                                <option value="default">Please select category for product</option>
                                {PRODUCT_CATEGORY.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value || ""}>{item.name}</option>
                                    )
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" placeholder="Enter stock" name='stock' value={data.stock || ""} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter price" name='price' value={data.price || ""} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Enter Short Description" name='shortDesc' value={data.shortDesc || ""} onChange={onChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control as="textarea" rows={4} placeholder="Enter Long Description" name='longDesc' value={data.longDesc || ""} onChange={onChange} />
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label>Upload image (5 images)</Form.Label>
                            {!isEdit && <Form.Control name='images' key={fileInputKey || ''} accept=".png, .jpg, .jpeg" multiple type="file" onChange={uploadMultipleFiles} />}
                        </Form.Group>

                        <div className='preview-image-container'>
                            {!isEdit && preview && preview.map((item, index) => {
                                return (<div className='preview-image' key={index}>
                                    <img src={item} alt={index} />
                                </div>)
                            })}

                            {isEdit && data.images?.map((item, index) => {
                                return (<div className='preview-image' key={index}>
                                    <img src={`${baseImgUrl}/${item}`} alt={index} />
                                </div>)
                            })}
                        </div>

                    </div>
                    <div hidden={isEdit}>
                        <Button className="mb-3" variant="success" onClick={() => onSubmit()}>Create</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default NewProductForm