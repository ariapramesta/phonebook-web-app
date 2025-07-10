import { request } from './request';

export const getContacts = () => request.get('contacts');

export const addContact = (data) => request.post('contacts', data);

export const updateContact = (data) => request.put('contacts', data);

export const deleteContact = (id) => request.delete('contacts', { data: { id } });
