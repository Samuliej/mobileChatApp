// wsApi.js
export const createWebSocketConnection = (url, onMessage) => {
  const ws = new WebSocket(url)

  ws.onopen = () => {
    console.log('connected to websocket')
  }

  ws.onmessage = (e) => {
    const messageData = JSON.parse(e.data)
    onMessage(messageData)
  }

  ws.onerror = (error) => {
    console.log('WebSocket error: ', error)
  }

  ws.onclose = () => {
    console.log('disconnected from websocket')
  }

  return ws
}