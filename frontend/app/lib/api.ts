import axios from "axios";
import { IUserLogin, IUserRegister } from "../types/user.interface";
import { IGalleryCreate } from "../types/gallery.interface";
import { IModCreate } from "../types/mod.interface";

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

export const createNews = async (data: FormData) => {
    try {
        const res = await axios.post('/all-list-news/', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка создания новости', error.response?.data || error.message);
        }
        throw error;
    }
};

export const updateNews = async (id: number, data: FormData) => {
    try {
        const res = await axios.patch(`/news/${id}/`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка обновления новости', error.response?.data || error.message);
        }
        throw error;
    }
};

export const deleteNews = async (id: number) => {
    try {
        await axios.delete(`/news/${id}/`, {
            withCredentials: true,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка удаления новости', error.response?.data || error.message);
        }
        throw error;
    }
};


export const getModList = async (category?: string, search?: string) => {
    try {
        const params: Record<string, string> = {};
        if (category) params.category = category;
        if (search) params.search = search;
        
        const res = await axios.get('/mods/', {
            params,
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка загрузки модов', error.response?.data || error.message);
        }
        return [];
    }
};

export const getModDetail = async (id: number) => {
    try {
        const res = await axios.get(`/mods/${id}/`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка загрузки мода', error.response?.data || error.message);
        }
        return null;
    }
};

export const uploadMod = async (data: IModCreate) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.file) formData.append('file', data.file);
        if (data.version) formData.append('version', data.version);
        if (data.category) formData.append('category', data.category);

        const res = await axios.post('/admin/mods/create/', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка загрузки мода', error.response?.data || error.message);
        }
        throw error;
    }
};

export const updateMod = async (id: number, data: Partial<IModCreate>) => {
    try {
        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.file) formData.append('file', data.file);
        if (data.version) formData.append('version', data.version);
        if (data.category) formData.append('category', data.category);

        const res = await axios.patch(`/admin/mods/${id}/`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка обновления мода', error.response?.data || error.message);
        }
        throw error;
    }
};

export const deleteMod = async (id: number) => {
    try {
        await axios.delete(`/admin/mods/${id}/`, {
            withCredentials: true,
        });
        return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка удаления мода', error.response?.data || error.message);
        }
        throw error;
    }
};

export const approveMod = async (id: number) => {
    try {
        const res = await axios.post(`/admin/mods/${id}/approve/`, {}, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка одобрения мода', error.response?.data || error.message);
        }
        throw error;
    }
};

export const rejectMod = async (id: number) => {
    try {
        const res = await axios.post(`/admin/mods/${id}/reject/`, {}, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка отклонения мода', error.response?.data || error.message);
        }
        throw error;
    }
};

export const getAdminModList = async (status?: string) => {
    try {
        const params: Record<string, string> = {};
        if (status) params.status = status;
        
        const res = await axios.get('/admin/mods/', {
            params,
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка загрузки списка модов', error.response?.data || error.message);
        }
        return [];
    }
};

export const uploadModsBatch = async (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const res = await axios.post('/admin/mods/batch-upload/', formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const registerModDownload = async (id: number) => {
    try {
        const res = await axios.post(`/mods/${id}/download/`, {}, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка регистрации скачивания', error.response?.data || error.message);
        }
    }
};
