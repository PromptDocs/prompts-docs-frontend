import { api } from "../axios";

// 파일 업로드할 때 사용하는 함수
export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/file/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}