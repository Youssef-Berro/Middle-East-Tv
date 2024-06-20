import React, { useEffect, useState } from 'react'
import './../css/UpdatePage.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { isEmpty, isMoreThanMaxLen, checkImageSize, isSyntaxIncorrect } from '../Validations'

function Newsdetails() {
    const params = useParams();
    const navigate = useNavigate();
    const [newsData, setNewsData] = useState({});


    const [title, setTitle] = useState("");
    const [titleInput, setTitleInput] = useState(false);

    const [categoryName, setCategoryName] = useState("");
    const [categoryNameInput, setCategoryNameInput] = useState(false);

    const [categorySpecificName, setCategorySpecificName] = useState("");
    const [categorySpecificNameInput, setCategorySpecificNameInput] = useState(false);

    const [content, setContent] = useState("");
    const [contentInput, setContentInput] = useState(false);


    useEffect(() => {
        if(!sessionStorage.getItem('token'))    navigate('/');
    }, [])


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const resp = await axios.get(`http://localhost:8000/api/news/get-news-by-id/${params.id}`);
                setNewsData(resp.data.data);
            }catch(err) {
                console.log(err);
            }
        }

        fetchNews();
    }, [params])


    useEffect(() => {
        if(Object.keys(newsData).length !== 0) {
            setTitle(newsData.title);
            setCategoryName(newsData.categoryName);
            setCategorySpecificName(newsData.categorySpecificName);
            setContent(newsData.content);
        }
    }, [newsData])


    const updateTitle = async () => {
        if((isEmpty(title, 'title')) || (isMoreThanMaxLen(title, 250, 'title')))   return;

        try {
            setTitleInput(false);
            await axios.patch(`http://localhost:8000/api/admin/news/${params.id}`, {
                title: title}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setNewsData({...newsData, title: title});
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
        const image = e.target.files[0];
        const formData = new FormData();
        const imgName = `${Date.now()}_${image.name}`;
        formData.append('image', image, imgName);

        const isValidImg = await checkImageSize(image);
        if(!isValidImg)  return;


        try {
            await axios.patch(`http://localhost:8000/api/admin/news/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            setNewsData({ ...newsData, image: imgName });
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Image Updated',
                showConfirmButton: false,
                timer: 1000
            })
        } catch (err) {
            console.error(err.message);
        }
    }


    const updateCategoryName = async () => {
        if(isEmpty(categoryName, "category name"))  return;
        if((isMoreThanMaxLen(categoryName, 200, "category name")))   return;


        try {
            setCategorySpecificNameInput(false);
            setCategoryNameInput(false);

            const resp = await axios.patch(`http://localhost:8000/api/admin/news/${params.id}`, {
                categoryName: categoryName}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            const updatedData = resp.data.data;

            setNewsData({...newsData, 
                        categoryName: updatedData.categoryName,
                        categorySpecificName: updatedData.categorySpecificName});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Category Name Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;
            if(msg == `category ${categoryName} not found`)  toast.error(msg);
            else if(isSyntaxIncorrect(msg)) toast.error(msg);
            else  toast.error('error');
        }
    }


    const updateCategorySpecificName = async () => {
        if(isEmpty(categorySpecificName, "category specific name"))  return;
        if((isMoreThanMaxLen(categorySpecificName, 50, "category specific name")))   return;

        try {
            setCategorySpecificNameInput(false);
            setCategoryNameInput(false);

            const resp = await axios.patch(`http://localhost:8000/api/admin/news/${params.id}`, {
                categorySpecificName: categorySpecificName,
                categoryName: newsData.categoryName}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })


            const updatedData = resp.data.data;
            setNewsData({...newsData,
                        categorySpecificName: updatedData.categorySpecificName});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Category Specific Name Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;
            if(msg == `category ${categoryName} with specific name ${categorySpecificName} not found`)
                toast.error(msg);
            else if(isSyntaxIncorrect(msg))
                toast.error(msg);
            else  toast.error('error');
        }
    }


    const updateContent = async () => {
        if(isEmpty(content, "content"))   return;

        try {
            setContentInput(false);
            await axios.patch(`http://localhost:8000/api/admin/news/${params.id}`, {
                content: content}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            setNewsData({...newsData, content: content});
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Content Updated',
                showConfirmButton: false,
                timer: 1000
            })
        }catch(err) {
            const msg = err.response.data.message;

            if(isSyntaxIncorrect(msg))
                toast.error(msg);
        }
    }


    const dropNews = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/admin/news/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'News Deleted',
                showConfirmButton: false,
                timer: 1000
            })
            navigate('/homepage');
        }catch(err) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error',
                showConfirmButton: false,
                timer: 1000
            })
            console.log(err);
        }
    }



    return (
        <>
            {Object.keys(newsData).length !== 0 && 
                <div className='details-page-container'>
                    <div className="details-page-head">
                        {!titleInput ? (
                            <>
                                <div className="details-page-title">{newsData.title}</div>
                                <button
                                    onClick={() => {setTitleInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <div className='edit-input-container'>
                                <input
                                    onChange={(e) => {setTitle(e.target.value)}}
                                    defaultValue={newsData.title}
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
                            src={`./../../img/news/${newsData.image}`} 
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
                    <div className="category-name-container">
                        {!categoryNameInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Category Name :</span>
                                    <span className="category-name">{newsData.categoryName}</span>
                                </div>
                                <button
                                    onClick={() => {setCategoryNameInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Category Name :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setCategoryName(e.target.value)}}
                                        defaultValue={newsData.categoryName}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setCategoryNameInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateCategoryName}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="specific-category-name-container">
                        {!categorySpecificNameInput ? (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Category Specific Name :</span>
                                    <span className="category-name">{newsData.categorySpecificName}</span>
                                </div>
                                <button
                                    onClick={() => {setCategorySpecificNameInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <>
                                <div className="category-data">
                                    <span className="category-title">Category Specific Name :</span>
                                </div>
                                <div className='edit-input-container categorical-edit'>
                                    <input
                                        onChange={(e) => {setCategorySpecificName(e.target.value)}}
                                        defaultValue={newsData.categorySpecificName}
                                        type="text"
                                        autoFocus={true}/>
                                    <div className='edit-input-functionality'>
                                        <button 
                                            onClick={() => {setCategorySpecificNameInput(false)}}
                                            className='cancel-btn'>cancel</button>
                                        <button
                                            onClick={updateCategorySpecificName}
                                            className='save-btn'>save</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="details-page-content-container">
                        {!contentInput ? (
                            <>
                                <div className="category-content">{newsData.content}</div>
                                <button
                                    onClick={() => {setContentInput(true)}}
                                    className='edit-btn'>edit</button>
                            </>
                        ) : (
                            <div className='edit-input-container'>
                                <input
                                    onChange={(e) => {setContent(e.target.value)}}
                                    defaultValue={newsData.content}
                                    type="text"
                                    autoFocus={true}/>
                                <div className='edit-input-functionality'>
                                    <button 
                                        onClick={() => {setContentInput(false)}}
                                        className='cancel-btn'>cancel</button>
                                    <button
                                        onClick={updateContent}
                                        className='save-btn'>save</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='edit-page-btns-container'>
                        <button 
                            onClick={() => navigate(-1)}
                            className="log-in-btn back-btn">Back</button>
                        <button
                            onClick={dropNews}
                            className="log-in-btn drop-btn">Drop News</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Newsdetails