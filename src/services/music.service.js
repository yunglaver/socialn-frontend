import {apiFetch} from "../core/api.js";

export async function getMyMusic(page = 1) {
    const token = localStorage.getItem('token');

    const response = await apiFetch(
        `/music/my?page=${page}&limit=20`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

export async function getOtherMusic(page = 1) {
    const token = localStorage.getItem('token');

    const response = await apiFetch(
        `/music/all?page=${page}&limit=20`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return await response.json();
}

export async function uploadMusic( audioFile, artistName, songTitle, coverFile, isPublic ) {

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('artistName', artistName)
    formData.append('songTitle', songTitle)
    formData.append('isPublic', String(Number(isPublic)));
    formData.append('audioFile', audioFile);
    formData.append('coverPic', coverFile)


    const response = await apiFetch("/music", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return await response.json();
}

export const likeSong = async (songId) => {
    const token = localStorage.getItem('token');
    return apiFetch(`/music/${songId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export async function removeSong(songId) {
    const token = localStorage.getItem('token');

    const response = await apiFetch(`/music/${songId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
}