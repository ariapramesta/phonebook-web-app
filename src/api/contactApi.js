import { request } from './request';

export const read = (params = {}) => request.get('contacts', { params });

export const create = (data) => request.post('contacts', data);

export const update = (id, data) => request.put(`contacts/${id}`, data);

export const remove = (id) => request.delete(`contacts/${id}`);
