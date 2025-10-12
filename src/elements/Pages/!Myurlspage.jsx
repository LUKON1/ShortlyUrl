import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from "../../utils/useAxiosPrivate"; 
import Logout from "../Myurls/logout";
import Urlslist from "../Myurls/myurlslist";
import Notifications from '../shared/messagewindow'; 

function Myurlspage() {
    const API_MYURLS = "/myurls/geturls"
    const { t } = useTranslation();
    const axiosPrivate = useAxiosPrivate();
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const notificationRef = useRef();

    const getMyUrls = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axiosPrivate.get(API_MYURLS);
            setUrls(response.data);
        } catch (err) {
            console.error("Failed to fetch user URLs:", err);
            setError(t('myurls.loaderr'));
            notificationRef.current?.addNotification(
                t("myurls.loaderr"),
                3000
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMyUrls();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center grow text-rose-900 text-2xl">
                {t('myurls.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center grow text-red-600 text-2xl">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col grow items-center p-4">
             <Notifications ref={notificationRef} />
            <Logout />
            <h1 className="text-3xl font-bold mb-6 text-sky-400">{t('myurls.myurls')}</h1>
            <button
                onClick={getMyUrls}
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {t('myurls.refresh')}
            </button>
            {urls.length > 0 ? (
                <Urlslist urls={urls} notificationRef={notificationRef} />
            ) : (
                <p className="text-xl text-rose-900">{t('myurls.nourls')}</p>
            )}
        </div>
    );
}

export default Myurlspage;
