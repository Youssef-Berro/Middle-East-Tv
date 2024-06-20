import React, { useEffect, useState } from 'react'
import './../css/UpdatePage.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { checkImageSize, isEmpty, isMoreThanMaxLen, isMoreThanMaxNum,
        isNegativeNum, isSyntaxIncorrect, validDate, validUrl } from '../Validations'

function AdDetails() {
    const navigate = useNavigate();
    const params = useParams();
    const [adData, setAdData] = useState({});

    const [title, setTitle] = useState("");
    const [titleInput, setTitleInput] = useState(false);

    const [url, setUrl] = useState("");
    const [urlInput, setUrlInput] = useState(false);

    const [expiry, setExpiry] = useState("");
    const [expiryInput, setExpiryInput] = useState(false);

    const [price, setPrice] = useState("");
    const [priceInput, setPriceInput] = useState(false);


    useEffect(() => {
        const fetchAd = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/api/ad/get-ad-by-id/${params.id}`);
                setAdData(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchAd();
    }, [params])

    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    useEffect(() => {
        if(Object.keys(adData).length !== 0) {
            setTitle(adData.title);
            setUrl(adData.url);
            setPrice(adData.price);
            setExpiry(adData.expiry);
        }
    }, [adData])


    const updateTitle = async () => {
        if((isEmpty(title, "title")) || (isMoreThanMaxLen(title, 100, "title")))   return;

        try {
            setTitleInput(false);
            await axios.patch(`http://localhost:8000/api/admin/ad/${params.id}`, {
                title: title}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setAdData({...adData, title: title});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Title Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }


    const updateImage = async (e) => {
        try {
            const image = e.target.files[0];
            const formData = new FormData();
            const imgName = `${Date.now()}_${image.name}`;
            formData.append('image', image, imgName);


            const isValidImg = await checkImageSize(image);
            if(!isValidImg)  return;


            await axios.patch(`http://localhost:8000/api/admin/ad/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            setAdData({ ...adData, image: imgName });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Image Updated',
                showConfirmButton: false,
                timer: 1000
            })
        } catch (err) {
            console.log(err);
        }
    }


    const updateUrl = async () => {
        if((isEmpty(url, "url")) || (isMoreThanMaxLen(url, 250, "url")))   return;
        if(!validUrl(url))   return;


        try {
            setUrlInput(false);
            await axios.patch(`http://localhost:8000/api/admin/ad/${params.id}`, {
                url: url}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setAdData({...adData, url: url});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Url Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }


    const updatePrice = async () => {
        if((isNegativeNum(price, "price")) || (isMoreThanMaxNum(price, 2000, "price")))   return;


        try {
            setPriceInput(false);
            await axios.patch(`http://localhost:8000/api/admin/ad/${params.id}`, {
                price: price}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setAdData({...adData, price: price});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Price Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            console.log(err)
        }
    }


    const updateExpiry = async () => {
        if(!validDate(expiry, "expiry"))  return;


        try {
            setExpiryInput(false);
            await axios.patch(`http://localhost:8000/api/admin/ad/${params.id}`, {
                expiry: exp}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setAdData({...adData, expiry: expiry});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Expiry Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }


    const dropAd = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/ad/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            navigate('/homepage');
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Ad Deleted',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            console.log(err);
        }
    }



    return (
        <>
            {Object.keys(adData).length !== 0 && 
                <div className='details-page-container'>
                    <div className="details-page-head">
                        {!titleInput ? (
                            <>
                                <div className="details-page-title">{adData.title}</div>
                                <button
                                    onClick={() => {setTitleInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <div className='edit-input-container'>
                                <input
                                    onChange={(e) => {setTitle(e.target.value)}}
                                    defaultValue={adData.title}
                                    type="text"
                                    autoFocus={true}/>
                                <div className='edit-input-functionality'>
                                    <button 
                                        onClick={() => {setTitleInput(false)}}
                                        className='cancel-btn'>cancel</button>
                                    <button
                                        onClick={updateTitle}
                                        className='save-btn'>save</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="details-page-img-container">
                        <img
                            className="details-page-img" 
                            src={`./../../img/ads/${adData.image}`} 
                            alt="not found" />
                        <form encType='multipart/form-data'>
                            <input
                                onChange={updateImage}
                                id="fileInput"
                                type="file"
                                accept="image/jpeg, image/png"/>
                            <label htmlFor="fileInput">
                                choose another image
                            </label>
                        </form>
                    </div>
                    <div className="url-edit-container">
                        {!urlInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Url :</span>
                                    <span className="category-name">{adData.url}</span>
                                </div>
                                <button
                                    onClick={() => {setUrlInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Url :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setUrl(e.target.value)}}
                                        defaultValue={adData.url}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setUrlInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateUrl}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="specific-category-name-container">
                        {!priceInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Price :</span>
                                    <span className="category-name">{adData.price}</span>
                                </div>
                                <button
                                    onClick={() => {setPriceInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Price :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setPrice(e.target.value)}}
                                        defaultValue={adData.price}
                                        type="number"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setPriceInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updatePrice}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="specific-category-name-container">
                        {!expiryInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Expriy At:</span>
                                    <span className="category-name">
                                        {new Date(adData.expiry).toLocaleDateString('en-GB')}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {setExpiryInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Expiry At :</span>
                                </div>
                                <div className='edit-input-container'>
                                    <input
                                        onChange={(e) => {setExpiry(e.target.value)}}
                                        defaultValue={new Date(adData.expiry).toLocaleDateString('en-GB')}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setExpiryInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateExpiry}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='edit-page-btns-container'>
                        <button 
                            onClick={() => navigate(-1)}
                            className="log-in-btn back-btn">Back</button>
                        <button
                            onClick={dropAd}
                            className="log-in-btn drop-btn">Drop Ad</button>
                    </div>
                </div>
            }
        </>
    )
}

export default AdDetails