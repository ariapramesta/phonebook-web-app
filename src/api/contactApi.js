import { request } from './request';

export const getContacts = () => request.get('contacts');

export const addContact = (data) => request.post('contacts', data);

export const updateContact = (id, data) => request.put(`contacts/${id}`, { data });

export const deleteContact = (id) => request.delete(`contacts/${id}`);
