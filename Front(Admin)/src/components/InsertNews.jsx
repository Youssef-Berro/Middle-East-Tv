import React, { useState, useEffect } from 'react'
import './../css/Insert.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { checkImageSize, isEmpty, isMoreThanMaxLen, isSyntaxIncorrect } from '../Validations'

function InsertNews() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [image, setImg] = useState(null);
    const [content, setContent] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categorySpecificName, setCategorySpecificName] = useState("");


    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    const createNewsReq = async () => {
        const imgName = `${Date.now()}_${image.name}`;
        const isValidImg = await checkImageSize(image);

        if((isEmpty(title, "title")) || (isMoreThanMaxLen(title, 250, "title")))   return;
        if(isEmpty(categoryName, "category name"))  return;
        if((isMoreThanMaxLen(categoryName, 200, "category name")))   return;
        if(isEmpty(categorySpecificName, "category specific name"))  return;
        if((isMoreThanMaxLen(categorySpecificName, 50, "category specific name")))   return;
        if(!isValidImg)  return;


        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('image', image, imgName);
            formData.append('content', content);
            formData.append('categoryName', categoryName);
            formData.append('categorySpecificName', categorySpecificName);


            await axios.post("http://localhost:8000/api/admin/news" , formData, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'News Created',
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



    const handleNewsImage = async (e) => {setImg(e.target.files[0])}

    return (
        <div className="insert-news-container">
            <div className="form">
                    <div className="insert-form-title">Enter new News Data :</div>
                    <div className="form-data">
                        <div className="form-section1">
                            <input 
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="title" 
                                type="text" />
                            <input
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="content" 
                                type="text" />
                            <form encType='multipart/form-data'>
                                <input 
                                    id="fileInput"
                                    type="file"
                                    className='insert-new-obj-image'
                                    accept="image/jpeg, image/png"
                                    onChange={handleNewsImage}/>
                                <label htmlFor="fileInput">
                                    choose news image
                                </label>
                            </form>
                        </div>
                        <div className="form-section2">
                            <input
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="category name" 
                                type="text" />
                            <input
                                onChange={(e) => setCategorySpecificName(e.target.value)}
                                placeholder="specific category name" 
                                type="text" />
                            <div className='insert-btns-container'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="log-in-btn discard-btn">Discard</button>
                                <button 
                                    onClick={createNewsReq}
                                    className="log-in-btn create-btn">Create</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default InsertNews