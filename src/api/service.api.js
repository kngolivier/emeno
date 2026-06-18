// FILE: src/api/service.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export const getAll = async (params = {}) => {
    const res = await API.get(ENDPOINTS.SERVICES, { params });
    return res;
}

export const getById = async (id) => {
    const res = await API.get(ENDPOINTS.SERVICE_BY_ID(id));
    return res;
}

export const create = async (formData) => {
    const res = await API.post(ENDPOINTS.SERVICES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
};

export const update = async (id, formData) => {
    const res = await API.patch(ENDPOINTS.SERVICE_BY_ID(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
};

export const remove = async (id) => {
    const res = await API.delete(ENDPOINTS.SERVICE_BY_ID(id));
    return res;
};

export const getWhatsappLink = async (id) => {
    const res = await API.get(ENDPOINTS.SERVICE_WHATSAPP(id));
    return res;
};

export const getStats = async() => {
    const res = await API.get(ENDPOINTS.SERVICES_STATS);
    return res
}