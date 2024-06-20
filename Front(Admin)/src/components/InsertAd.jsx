import React, { useState, useEffect } from 'react'
import './../css/Insert.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { checkImageSize, isEmpty, isMoreThanMaxLen, isMoreThanMaxNum, 
        isNegativeNum, isSyntaxIncorrect, validDate, validUrl } from '../Validations'

function InsertAd() {
    const navigate = useNavigate();

    const [url, setUrl] = useState("");
    const [image, setImg] = useState(null);
    const [price, setPrice] = useState("");
    const [expiry, setExpiry] = useState(null);
    const [title, setTitle] = useState("");


    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    const createAdReq = async () => {
        const imgName = `${Date.now()}_${image.name}`;
        const expiryDate = new Date(expiry);
        const isValidImg = await checkImageSize(image);


        if((isEmpty(title, "title")) || (isMoreThanMaxLen(title, 100, "title")))   return;
        if((isEmpty(url, "url")) || (isMoreThanMaxLen(url, 250, "url")))   return;
        if((isMoreThanMaxNum(price, 2000, "price")) || isNegativeNum(price, "price"))   return;
        if(!(validUrl(url)) || !(isValidImg))   return;
        if(!validDate(expiry, "expiry"))   return;


        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('image', image, imgName);
            formData.append('url', url);
            formData.append('price', price);
            formData.append('expiry', expiryDate);

            await axios.post("http://localhost:8000/api/admin/ad", formData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : `Bearer ${sessionStorage.getItem('token')}`
                }
            })


            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Ad Created',
                showConfirmButton: false,
                timer: 1000
            })
            navigate('/homepage');
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }



    const handleAdImage = async (e) => {setImg(e.target.files[0])}

    return (
        <div className="insert-ad-container">
            <div className="form">
                    <div className="insert-form-title">Enter new Ad Data :</div>
                    <div className="form-data">
                        <div className="form-section1">
                            <input 
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="title" 
                                type="text" />
                            <input
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="url" 
                                type="text" />
                            <form encType='multipart/form-data'>
                                <input 
                                    id="fileInput"
                                    type="file"
                                    className='insert-new-obj-image'
                                    accept="image/jpeg, image/png"
                                    onChange={handleAdImage}/>
                                <label htmlFor="fileInput">
                                    choose ad image
                                </label>
                            </form>
                        </div>
                        <div className="form-section2">
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="price in USD" 
                                type="number" />
                            <input
                                onChange={(e) => setExpiry(e.target.value)}
                                type="date" />
                            <div className='insert-btns-container'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="log-in-btn discard-btn">Discard</button>
                                <button 
                                    onClick={createAdReq}
                                    className="log-in-btn create-btn">Create</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default InsertAd