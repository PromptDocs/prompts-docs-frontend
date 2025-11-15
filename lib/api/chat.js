import { api } from "../axios";

// 채팅 보낼 때 사용하는 함수
export async function sendMessage(data) {
  const res = await api.post(`/chat/`, data);
  return res.data;
}