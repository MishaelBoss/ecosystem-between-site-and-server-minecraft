import axios from "axios";
import { IUserLogin, IUserRegister } from "../types/user.interface";
import { IGalleryCreate } from "../types/gallery.interface";

export const checkAuthStatus = async () => {
    try {
        const res = await axios.get(`/is_authenticated/`, {
            withCredentials: true, 
        });

        return res.data.is_authenticated ? res.data : null;
    } catch (error) {
        if (axios.isAxiosError(error)) {            
            if (error.response?.status === 401) {
                console.log("User не авторизован");
                return null;
            }
        } else {
            console.error("Неизвестная ошибка:", error);
        }
        return null;
    }
};

export const login = async (data: IUserLogin): Promise<boolean> => {
    try{
        const res = await axios.post(`/login/`, data, {
            withCredentials: true, 
        });

        if (res.status >= 200 && res.status < 300){
            window.dispatchEvent(new Event("fetchUser"));
            return true; 
        };

        return false;
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.error('Ошибка входа:', error.response?.data || error.message);
        }
        return false;
    }
};

export const register = async (data: IUserRegister): Promise<boolean> => {
    try{
        const res =  await axios.post(`/register/`, data, {
            withCredentials: true, 
        });

        if (res.status === 200 || res.status === 201){
            window.dispatchEvent(new Event("fetchUser"));
            return true;
        };

        return false;
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.error('Ошибка регистрации:', error.response?.data || error.message);
        }
        return false;
    }
};

export const logout = async () => {
    try{
        const res = await axios.post(`/logout/`, {
            withCredentials: true, 
        })

        if (res.status === 201){
            window.dispatchEvent(new Event("fetchUser"));
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка выхода из аккаунта:', error.response?.data || error.message);
        }
    }
}

export const uploadImage = async (data: IGalleryCreate): Promise<boolean> => {
    try {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('image', data.image!);

        const res = await axios.post('/upload-image/', formData, {
            withCredentials: true,
        })

        if (res.status === 201 || res.status === 200){
            return true;
        }

        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка загрузки картинки', error.response?.data || error.message);
        }

        return false;
    }
}

export const getGalleryList = async () => {
    try {
        const res = await axios.get('/all-list-galleries/', {
            withCredentials: true,
        });

        return await res.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            console.error('Ошибка загрузки галери', error.response?.data || error.message);
        }
    }
}

export const getDataServer = async () => {
    try {
        const res = await axios.get('/server-status/', {
            withCredentials: true,
        });

        return res.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            console.error('Ошибка загрузки данных', error.response?.data || error.message);
        }
    }
}

export const getListNews = async (offset: number, limit: number = 20) => {
    try {
        const res = await axios.get('/all-list-news/', {
            params: { limit, offset },
            withCredentials: true,
        });

        return res.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            console.error('Ошибка загрузки данных', error.response?.data || error.message);
        }
    }
}

export const getNewsDetail = async (id: number) => {
    try {
        const res = await axios.get(`/news/${id}/`, {
            withCredentials: true,
        });

        return res.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            console.error('Ошибка загрузки данных', error.response?.data || error.message);
        }
    }
}

export const approveGalleryItem = async (id: number, coins?: number) => {
    try {
        const res = await axios.post(`/gallery/${id}/approve/`, 
            coins !== undefined ? { coins } : {},
            { withCredentials: true }
        );

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка одобрения работы', error.response?.data || error.message);
        }
    }
};

export const rejectGalleryItem = async (id: number) => {
    try {
        const res = await axios.post(`/gallery/${id}/reject/`, {}, {
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка отклонения работы', error.response?.data || error.message);
        }
    }
};

export const undoGalleryItem = async (id: number) => {
    try {
        const res = await axios.post(`/gallery/${id}/undo/`, {}, {
            withCredentials: true,
        });

        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка возврата на проверку', error.response?.data || error.message);
        }
    }
};