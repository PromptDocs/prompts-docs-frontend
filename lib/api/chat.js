import { api } from "../axios";

// 기존 채팅 세션 리스트 불러오는 함수
export async function searchExistingChatSession() {
  const res = await api.get(`/chat/list`);
  return res.data;
}

// 새로운 채팅 세션 만드는 함수
export async function createChatSession() {
  const res = await api.post(`/chat/new`);
  return res.data;
}

// 채팅 보낼 때 사용하는 함수
export async function sendMessage(data) {
  const res = await api.post(`/chat/`, data);
  return res.data;
}
