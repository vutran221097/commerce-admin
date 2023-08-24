import { useState } from 'react'

import Layout from '../../components/Layout/Layout'
import Axios from '../../api/Axios'
import { toastNoti, validateProduct } from '../../utils/utils'
import NewProductForm from './components/NewProductForm';

const MAX_LENGTH = 5;

const initState = {
    name: "",
    category: "default",
    stock: "",
    price: "",
    shortDesc: "",
    longDesc: "",
    images: null
}

const NewProduct = () => {
    const [data, setData] = useState(initState)
    const [preview, setPreview] = useState()
    const [fileInputKey, setFileInputKey] = useState(Math.random().toString(36))

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const submit = async () => {
        try {
            const validate = validateProduct(data, false)
            if (validate) {
                const formData = new FormData();
                let textFields = { ...data }
                delete textFields["images"]
                for (const name in textFields) {
                    formData.append(name, textFields[name]);
                }
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
                const res = await Axios.post(`/product/create`, formData)
                if (res.status === 200) {
                    const newData = { ...initState }
                    setData(newData)
                    setFileInputKey(Math.random().toString(36))
                    setPreview(null)
                    toastNoti("Add success!", 'success')
                }
            }
        } catch (e) {
            toastNoti('Error when creating product', 'error')
            console.error(e);
        }
    }

    const uploadMultipleFiles = (e) => {
        if (Array.from(e.target.files).length > MAX_LENGTH) {
            e.preventDefault();
            toastNoti(`Cannot upload files more than ${MAX_LENGTH}`, "error");
            setData({ ...data, image: [] })
            e.target.value = null
            return;
        } else {
            setData({ ...data, images: e.target.files })
            const previewImages = []

            for (let i = 0; i < e.target.files.length; i++) {
                const url = URL.createObjectURL(e.target.files[i]);
                previewImages.push(url)
            }
            setPreview(previewImages)
        }
    }


    const NewProductComponent = (
        <div>
            <NewProductForm data={data} onChange={onChange} onSubmit={submit} uploadMultipleFiles={uploadMultipleFiles} isEdit={false} preview={preview} fileInputKey={fileInputKey} />
        </div>
    )
    return (
        <div>
            <Layout children={NewProductComponent} />
        </div>
    )
}

export default NewProduct